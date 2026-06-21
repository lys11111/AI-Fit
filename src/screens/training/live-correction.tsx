import {
  Activity,
  Camera,
  CheckCircle2,
  ChevronLeft,
  Home,
  Loader2,
  Play,
  RefreshCw,
  Repeat2,
  ScanLine,
  Square,
  VideoOff,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { routes } from '@/app/routes'
import { Button } from '@/components/ui/button'
import { aiFitApi, type BackendFormAnalysis } from '@/lib/api'
import { useCameraStream } from '@/lib/use-camera-stream'
import { usePrototypeState } from '@/prototype/state'
import { findEquipmentCorrectionRule, type EquipmentCorrectionRule } from './equipment-correction-rules'
import { findEquipmentOption } from './equipment-options'

type SessionState = 'ready' | 'recording' | 'analyzing' | 'summary'
type PoseStatus = 'idle' | 'loading' | 'ready' | 'error'
type RepPhase = 'waiting-lengthened' | 'lengthened' | 'contracted'
type MovementMode = 'low-is-contracted' | 'high-is-contracted'

type PoseLandmark = {
  x: number
  y: number
  z?: number
  visibility?: number
}

type PoseResults = {
  poseLandmarks?: PoseLandmark[]
}

type PoseInstance = {
  setOptions: (options: {
    modelComplexity?: number
    smoothLandmarks?: boolean
    enableSegmentation?: boolean
    minDetectionConfidence?: number
    minTrackingConfidence?: number
  }) => void
  onResults: (callback: (results: PoseResults) => void) => void
  send: (input: { image: HTMLVideoElement }) => Promise<void>
  close?: () => void
}

type PoseConstructor = new (config: { locateFile: (file: string) => string }) => PoseInstance

type MovementSnapshot = {
  metric: number
  mode: MovementMode
  contractedThreshold: number
  lengthenedThreshold: number
  label: string
}

type SetSummary = {
  reps: number
  durationSeconds: number
  primaryCue: string
  nextSuggestion: string
  cues: string[]
}

type RepState = {
  count: number
  phase: RepPhase
  cueHistory: string[]
  baseline: { earShoulder: number | null; samples: number }
  smoothedMetric: number | null
  lengthenedFrames: number
  contractedFrames: number
  missingFrames: number
  firstLengthenedAt: number | null
  contractedAt: number | null
  lastRepAt: number
  minMetric: number | null
  maxMetric: number | null
}

declare global {
  interface Window {
    Pose?: PoseConstructor
    POSE_CONNECTIONS?: Array<[number, number]>
  }
}

const poseCdnBase = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose'
const poseScriptId = 'aifit-mediapipe-pose'
const targetReps = 12
const metricSmoothing = 0.72
const requiredStableFrames = 3
const minRepDurationMs = 700
const maxRepDurationMs = 9000
const minReturnDurationMs = 260
const repCooldownMs = 760

const landmarkIndex = {
  leftEar: 7,
  rightEar: 8,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
} as const

const pullLabels = new Set(['Lat Pull Down', 'Seated Cable Rows', 'arm curl machine', 'chinning dipping'])
const pushLabels = new Set(['Chest Press machine', 'seated dip machine', 'shoulder press machine'])
const legExtensionLabels = new Set(['leg extension', 'leg press', 'smith machine'])

function createRepState(): RepState {
  return {
    count: 0,
    phase: 'waiting-lengthened',
    cueHistory: [],
    baseline: { earShoulder: null, samples: 0 },
    smoothedMetric: null,
    lengthenedFrames: 0,
    contractedFrames: 0,
    missingFrames: 0,
    firstLengthenedAt: null,
    contractedAt: null,
    lastRepAt: 0,
    minMetric: null,
    maxMetric: null,
  }
}

function loadScript(src: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    if (window.Pose) {
      resolve()
      return
    }

    const existing = document.getElementById(id) as HTMLScriptElement | null

    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve()
        return
      }

      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = id
    script.src = src
    script.async = true
    script.crossOrigin = 'anonymous'
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true'
        resolve()
      },
      { once: true },
    )
    script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true })
    document.head.appendChild(script)
  })
}

function visible(point: PoseLandmark | undefined, threshold = 0.34) {
  return Boolean(point && (point.visibility ?? 1) >= threshold)
}

function averageVisibility(landmarks: PoseLandmark[], indexes: number[]) {
  return indexes.reduce((sum, index) => sum + (landmarks[index]?.visibility ?? 0), 0) / indexes.length
}

function pickSide(landmarks: PoseLandmark[]) {
  const left = averageVisibility(landmarks, [
    landmarkIndex.leftShoulder,
    landmarkIndex.leftElbow,
    landmarkIndex.leftWrist,
    landmarkIndex.leftHip,
    landmarkIndex.leftKnee,
    landmarkIndex.leftAnkle,
  ])
  const right = averageVisibility(landmarks, [
    landmarkIndex.rightShoulder,
    landmarkIndex.rightElbow,
    landmarkIndex.rightWrist,
    landmarkIndex.rightHip,
    landmarkIndex.rightKnee,
    landmarkIndex.rightAnkle,
  ])

  return left >= right ? 'left' : 'right'
}

function pointForSide(landmarks: PoseLandmark[], side: 'left' | 'right', joint: 'shoulder' | 'elbow' | 'wrist' | 'hip' | 'knee' | 'ankle' | 'ear') {
  const key = `${side}${joint[0].toUpperCase()}${joint.slice(1)}` as keyof typeof landmarkIndex
  return landmarks[landmarkIndex[key]]
}

function midpoint(a: PoseLandmark | undefined, b: PoseLandmark | undefined) {
  if (visible(a) && visible(b)) {
    return {
      x: ((a?.x ?? 0) + (b?.x ?? 0)) / 2,
      y: ((a?.y ?? 0) + (b?.y ?? 0)) / 2,
      visibility: Math.min(a?.visibility ?? 1, b?.visibility ?? 1),
    } satisfies PoseLandmark
  }

  if (visible(a)) {
    return a
  }

  if (visible(b)) {
    return b
  }

  return null
}

function distance(a: PoseLandmark, b: PoseLandmark) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function angleDegrees(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  const degrees = Math.abs((radians * 180) / Math.PI)
  return degrees > 180 ? 360 - degrees : degrees
}

function getMovementSnapshot(landmarks: PoseLandmark[], equipmentLabel: string): MovementSnapshot | null {
  const side = pickSide(landmarks)
  const shoulder = pointForSide(landmarks, side, 'shoulder')
  const elbow = pointForSide(landmarks, side, 'elbow')
  const wrist = pointForSide(landmarks, side, 'wrist')
  const hip = pointForSide(landmarks, side, 'hip')
  const knee = pointForSide(landmarks, side, 'knee')
  const ankle = pointForSide(landmarks, side, 'ankle')

  if (pullLabels.has(equipmentLabel) && visible(shoulder) && visible(elbow) && visible(wrist)) {
    return {
      metric: angleDegrees(shoulder, elbow, wrist),
      mode: 'low-is-contracted',
      contractedThreshold: 98,
      lengthenedThreshold: 143,
      label: '肘关节屈伸',
    }
  }

  if (pushLabels.has(equipmentLabel) && visible(shoulder) && visible(elbow) && visible(wrist)) {
    return {
      metric: angleDegrees(shoulder, elbow, wrist),
      mode: 'high-is-contracted',
      contractedThreshold: 150,
      lengthenedThreshold: 112,
      label: '推举伸肘',
    }
  }

  if (equipmentLabel === 'chest fly machine') {
    const leftWrist = landmarks[landmarkIndex.leftWrist]
    const rightWrist = landmarks[landmarkIndex.rightWrist]

    if (visible(leftWrist) && visible(rightWrist)) {
      return {
        metric: distance(leftWrist, rightWrist),
        mode: 'low-is-contracted',
        contractedThreshold: 0.25,
        lengthenedThreshold: 0.42,
        label: '双臂合拢距离',
      }
    }
  }

  if (equipmentLabel === 'lateral raises machine') {
    const bothShoulders = midpoint(landmarks[landmarkIndex.leftShoulder], landmarks[landmarkIndex.rightShoulder])
    const bothElbows = midpoint(landmarks[landmarkIndex.leftElbow], landmarks[landmarkIndex.rightElbow])

    if (bothShoulders && bothElbows) {
      return {
        metric: bothShoulders.y - bothElbows.y,
        mode: 'high-is-contracted',
        contractedThreshold: -0.02,
        lengthenedThreshold: -0.18,
        label: '肘部抬高幅度',
      }
    }
  }

  if (equipmentLabel === 'reg curl machine' && visible(hip) && visible(knee) && visible(ankle)) {
    return {
      metric: angleDegrees(hip, knee, ankle),
      mode: 'low-is-contracted',
      contractedThreshold: 105,
      lengthenedThreshold: 145,
      label: '膝关节屈曲',
    }
  }

  if (legExtensionLabels.has(equipmentLabel) && visible(hip) && visible(knee) && visible(ankle)) {
    return {
      metric: angleDegrees(hip, knee, ankle),
      mode: 'high-is-contracted',
      contractedThreshold: 154,
      lengthenedThreshold: 112,
      label: '膝关节伸展',
    }
  }

  if (visible(shoulder) && visible(elbow) && visible(wrist)) {
    return {
      metric: angleDegrees(shoulder, elbow, wrist),
      mode: 'low-is-contracted',
      contractedThreshold: 100,
      lengthenedThreshold: 142,
      label: '手臂轨迹',
    }
  }

  return null
}

function drawPoseOverlay(canvas: HTMLCanvasElement, video: HTMLVideoElement, landmarks: PoseLandmark[], phase: RepPhase) {
  const width = video.videoWidth || 720
  const height = video.videoHeight || 1280
  const context = canvas.getContext('2d')

  if (!context) {
    return
  }

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  context.clearRect(0, 0, width, height)

  const connections = window.POSE_CONNECTIONS ?? []
  context.lineWidth = Math.max(3, width * 0.004)
  context.lineCap = 'round'
  context.strokeStyle = phase === 'contracted' ? 'rgba(134, 239, 172, 0.96)' : 'rgba(139, 92, 246, 0.96)'

  connections.forEach(([from, to]) => {
    const start = landmarks[from]
    const end = landmarks[to]

    if (!visible(start, 0.4) || !visible(end, 0.4)) {
      return
    }

    context.beginPath()
    context.moveTo(start.x * width, start.y * height)
    context.lineTo(end.x * width, end.y * height)
    context.stroke()
  })

  landmarks.forEach((point, index) => {
    if (!visible(point, 0.45)) {
      return
    }

    const importantLandmarks: number[] = [
      landmarkIndex.leftShoulder,
      landmarkIndex.rightShoulder,
      landmarkIndex.leftElbow,
      landmarkIndex.rightElbow,
      landmarkIndex.leftWrist,
      landmarkIndex.rightWrist,
      landmarkIndex.leftHip,
      landmarkIndex.rightHip,
      landmarkIndex.leftKnee,
      landmarkIndex.rightKnee,
      landmarkIndex.leftAnkle,
      landmarkIndex.rightAnkle,
    ]
    const important = importantLandmarks.includes(index)

    context.fillStyle = important ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.55)'
    context.beginPath()
    context.arc(point.x * width, point.y * height, important ? Math.max(5, width * 0.006) : Math.max(3, width * 0.004), 0, Math.PI * 2)
    context.fill()
  })
}

function hasFullBodySignal(landmarks: PoseLandmark[]) {
  const required = [
    landmarkIndex.leftShoulder,
    landmarkIndex.rightShoulder,
    landmarkIndex.leftHip,
    landmarkIndex.rightHip,
    landmarkIndex.leftKnee,
    landmarkIndex.rightKnee,
    landmarkIndex.leftAnkle,
    landmarkIndex.rightAnkle,
  ]

  return required.filter((index) => visible(landmarks[index], 0.3)).length >= 6
}

function findRuleCue(rule: EquipmentCorrectionRule | null, keyword: string, fallback: string) {
  const cue = rule?.correctionItems.find((item) => item.name.includes(keyword))?.cue
  return cue ?? rule?.liveCues[0] ?? fallback
}

function analyzeLiveCue(
  landmarks: PoseLandmark[],
  rule: EquipmentCorrectionRule | null,
  baseline: { earShoulder: number | null; samples: number },
) {
  if (!hasFullBodySignal(landmarks)) {
    return '请把手机后退一点，确保头、肩、髋、膝和脚都完整入镜。'
  }

  const side = pickSide(landmarks)
  const ear = pointForSide(landmarks, side, 'ear')
  const shoulder = pointForSide(landmarks, side, 'shoulder')

  if (visible(ear) && visible(shoulder)) {
    const earShoulderDistance = Math.abs((ear?.y ?? 0) - (shoulder?.y ?? 0))

    if (earShoulderDistance > 0.02 && baseline.samples < 18) {
      baseline.earShoulder =
        baseline.earShoulder === null ? earShoulderDistance : baseline.earShoulder * 0.82 + earShoulderDistance * 0.18
      baseline.samples += 1
    }

    if (baseline.earShoulder !== null && baseline.samples >= 6 && earShoulderDistance < baseline.earShoulder * 0.68) {
      return findRuleCue(rule, '耸肩', '肩膀放低，先沉肩再发力。')
    }
  }

  return rule?.liveCues[0] ?? '保持全身入镜，沿标准力线完成动作。'
}

function updateRepPhase(
  snapshot: MovementSnapshot,
  repState: RepState,
) {
  const now = performance.now()
  const previousMetric = repState.smoothedMetric
  const metric =
    previousMetric === null ? snapshot.metric : previousMetric * metricSmoothing + snapshot.metric * (1 - metricSmoothing)

  repState.smoothedMetric = metric
  repState.missingFrames = 0
  repState.minMetric = repState.minMetric === null ? metric : Math.min(repState.minMetric, metric)
  repState.maxMetric = repState.maxMetric === null ? metric : Math.max(repState.maxMetric, metric)

  const contracted =
    snapshot.mode === 'low-is-contracted'
      ? metric <= snapshot.contractedThreshold
      : metric >= snapshot.contractedThreshold
  const lengthened =
    snapshot.mode === 'low-is-contracted'
      ? metric >= snapshot.lengthenedThreshold
      : metric <= snapshot.lengthenedThreshold

  repState.lengthenedFrames = lengthened ? repState.lengthenedFrames + 1 : 0
  repState.contractedFrames = contracted ? repState.contractedFrames + 1 : 0

  const amplitude = Math.abs((repState.maxMetric ?? metric) - (repState.minMetric ?? metric))
  const requiredAmplitude = Math.abs(snapshot.lengthenedThreshold - snapshot.contractedThreshold) * 0.58
  const hasEnoughAmplitude = amplitude >= requiredAmplitude

  if (repState.phase === 'waiting-lengthened' && repState.lengthenedFrames >= requiredStableFrames) {
    repState.phase = 'lengthened'
    repState.firstLengthenedAt = now
    repState.contractedAt = null
    repState.minMetric = metric
    repState.maxMetric = metric
  }

  if (
    repState.phase === 'lengthened' &&
    repState.contractedFrames >= requiredStableFrames &&
    repState.firstLengthenedAt !== null &&
    now - repState.firstLengthenedAt >= minReturnDurationMs &&
    hasEnoughAmplitude
  ) {
    repState.phase = 'contracted'
    repState.contractedAt = now
    return false
  }

  if (
    repState.phase === 'contracted' &&
    repState.lengthenedFrames >= requiredStableFrames &&
    repState.firstLengthenedAt !== null &&
    repState.contractedAt !== null
  ) {
    const repDuration = now - repState.firstLengthenedAt
    const returnDuration = now - repState.contractedAt
    const cooldownReady = now - repState.lastRepAt >= repCooldownMs

    if (repDuration >= minRepDurationMs && repDuration <= maxRepDurationMs && returnDuration >= minReturnDurationMs && cooldownReady && hasEnoughAmplitude) {
      repState.count += 1
      repState.lastRepAt = now
      repState.firstLengthenedAt = now
      repState.contractedAt = null
      repState.minMetric = metric
      repState.maxMetric = metric
      repState.phase = 'lengthened'
      return true
    }

    repState.phase = 'lengthened'
    repState.firstLengthenedAt = now
    repState.contractedAt = null
    repState.minMetric = metric
    repState.maxMetric = metric
  }

  return false
}

function markPoseMissing(repState: RepState) {
  repState.missingFrames += 1
  repState.lengthenedFrames = 0
  repState.contractedFrames = 0

  if (repState.missingFrames >= 8) {
    repState.phase = 'waiting-lengthened'
    repState.smoothedMetric = null
    repState.firstLengthenedAt = null
    repState.contractedAt = null
    repState.minMetric = null
    repState.maxMetric = null
  }
}

function rememberCue(history: string[], cue: string) {
  if (!cue || history[0] === cue) {
    return
  }

  const next = [cue, ...history.filter((item) => item !== cue)].slice(0, 5)
  history.splice(0, history.length, ...next)
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return minutes > 0 ? `${minutes}分${rest.toString().padStart(2, '0')}秒` : `${rest}秒`
}

function buildSetSummary(args: {
  reps: number
  durationSeconds: number
  cues: string[]
  rule: EquipmentCorrectionRule | null
  backendAnalysis: BackendFormAnalysis | null
}) {
  const fallbackCue = args.rule?.correctionItems[0]?.cue ?? args.rule?.liveCues[0] ?? '下一组继续保持完整入镜和稳定节奏。'
  const cues = Array.from(new Set([...args.cues, ...(args.backendAnalysis?.cues ?? []), fallbackCue])).slice(0, 3)
  const primaryCue = cues[0] ?? fallbackCue

  let nextSuggestion = '下一组保持当前重量，休息 60-90 秒，优先把动作节奏放慢。'

  if (args.reps === 0) {
    nextSuggestion = '这组没有捕捉到完整往返。下一组先把手机后退到推荐距离，从动作底端开始记录。'
  } else if (args.reps < 6) {
    nextSuggestion = '下一组建议降低重量或增加辅助，先稳定做到 8 次以上，再考虑加重。'
  } else if (args.reps <= targetReps) {
    nextSuggestion = `下一组保持当前重量，休息 60-90 秒，重点修正：${primaryCue}`
  } else {
    nextSuggestion = '次数已经超过目标。若力线稳定，下一组可以小幅增加重量；若出现代偿，先维持重量。'
  }

  return {
    reps: args.reps,
    durationSeconds: args.durationSeconds,
    primaryCue,
    nextSuggestion,
    cues,
  } satisfies SetSummary
}

export function LiveCorrectionScreen() {
  const navigate = useNavigate()
  const { state } = usePrototypeState()
  const { cameraError, cameraState, facingMode, startCamera, switchCamera, videoRef } = useCameraStream()
  const poseCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const poseRef = useRef<PoseInstance | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const recordingRef = useRef(false)
  const sendingPoseRef = useRef(false)
  const lastPoseSendRef = useRef(0)
  const lastUiUpdateRef = useRef(0)
  const latestLandmarksRef = useRef<PoseLandmark[] | null>(null)
  const startedAtRef = useRef<number | null>(null)
  const repStateRef = useRef<RepState>(createRepState())

  const currentExercise = state.plan.exercises[0]
  const equipmentLabel = state.equipment.manualSelection ?? state.equipment.lastDetectedLabel ?? currentExercise?.machineClass ?? 'Lat Pull Down'
  const equipment = findEquipmentOption(equipmentLabel)
  const correctionRule = findEquipmentCorrectionRule(equipmentLabel)
  const equipmentLabelRef = useRef(equipmentLabel)
  const correctionRuleRef = useRef(correctionRule)
  const displayName = correctionRule?.displayName ?? equipment?.name ?? currentExercise?.name ?? '正握宽距高位下拉'
  const confidence = state.equipment.lastDetectedConfidence

  const [poseStatus, setPoseStatus] = useState<PoseStatus>('idle')
  const [sessionState, setSessionState] = useState<SessionState>('ready')
  const [overlayVisible, setOverlayVisible] = useState(true)
  const [repCount, setRepCount] = useState(0)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [liveCue, setLiveCue] = useState(correctionRule?.liveCues[0] ?? equipment?.cue ?? '保持全身入镜，沿标准力线完成动作。')
  const [analysis, setAnalysis] = useState<BackendFormAnalysis | null>(null)
  const [summary, setSummary] = useState<SetSummary | null>(null)

  const cameraPrompt = correctionRule
    ? `${correctionRule.camera.prompt} 镜头高度：${correctionRule.camera.height}`
    : '请让身体、关节和器械轨迹完整入镜。'

  const cameraStatusCopy = useMemo(() => {
    if (cameraState === 'blocked') {
      return cameraError ?? '浏览器没有获得摄像头权限，请允许后重新打开。'
    }

    if (cameraState === 'starting') {
      return '正在请求摄像头权限，请在浏览器提示中选择允许。'
    }

    if (poseStatus === 'error') {
      return 'MediaPipe 力线识别未加载成功，请检查手机网络后刷新页面。'
    }

    return cameraPrompt
  }, [cameraError, cameraPrompt, cameraState, poseStatus])

  useEffect(() => {
    equipmentLabelRef.current = equipmentLabel
    correctionRuleRef.current = correctionRule
    setLiveCue(correctionRule?.liveCues[0] ?? equipment?.cue ?? '保持全身入镜，沿标准力线完成动作。')
  }, [correctionRule, equipment?.cue, equipmentLabel])

  useEffect(() => {
    setOverlayVisible(true)
    const timer = window.setTimeout(() => setOverlayVisible(false), 5200)
    return () => window.clearTimeout(timer)
  }, [equipmentLabel])

  useEffect(() => {
    if (sessionState !== 'recording') {
      return undefined
    }

    const timer = window.setInterval(() => {
      if (!startedAtRef.current) {
        return
      }

      setSessionDuration(Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000)))
    }, 500)

    return () => window.clearInterval(timer)
  }, [sessionState])

  const captureFrame = useCallback(async () => {
    const video = videoRef.current
    const canvas = captureCanvasRef.current

    if (!video || !canvas || !video.srcObject) {
      return null
    }

    const width = video.videoWidth || 720
    const height = video.videoHeight || 1280
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')?.drawImage(video, 0, 0, width, height)

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.84)
    })
  }, [videoRef])

  const handlePoseResults = useCallback(
    (results: PoseResults) => {
      const landmarks = results.poseLandmarks
      const canvas = poseCanvasRef.current
      const video = videoRef.current

      if (!landmarks || !canvas || !video) {
        return
      }

      latestLandmarksRef.current = landmarks
      const repState = repStateRef.current
      drawPoseOverlay(canvas, video, landmarks, repState.phase)

      if (!recordingRef.current) {
        return
      }

      const movement = getMovementSnapshot(landmarks, equipmentLabelRef.current)
      const cue = analyzeLiveCue(landmarks, correctionRuleRef.current, repState.baseline)
      rememberCue(repState.cueHistory, cue)

      if (movement) {
        updateRepPhase(movement, repState)
      } else {
        markPoseMissing(repState)
        rememberCue(repState.cueHistory, '当前角度没有稳定捕捉到关键关节，请调整到推荐角度和距离。')
      }

      const now = performance.now()
      if (now - lastUiUpdateRef.current > 220) {
        lastUiUpdateRef.current = now
        setRepCount(repState.count)
        setLiveCue(repState.cueHistory[0] ?? cue)
      }
    },
    [videoRef],
  )

  const ensurePose = useCallback(async () => {
    if (poseRef.current) {
      return true
    }

    try {
      setPoseStatus('loading')
      await loadScript(`${poseCdnBase}/pose.js`, poseScriptId)

      if (!window.Pose) {
        throw new Error('MediaPipe Pose global is unavailable.')
      }

      const pose = new window.Pose({
        locateFile: (file) => `${poseCdnBase}/${file}`,
      })

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.52,
        minTrackingConfidence: 0.5,
      })
      pose.onResults(handlePoseResults)
      poseRef.current = pose
      setPoseStatus('ready')
      return true
    } catch {
      setPoseStatus('error')
      setLiveCue('MediaPipe 加载失败，请确认手机网络能访问 jsDelivr 后刷新重试。')
      return false
    }
  }, [handlePoseResults])

  const runPoseLoop = useCallback(() => {
    if (!recordingRef.current) {
      return
    }

    const video = videoRef.current
    const pose = poseRef.current
    const now = performance.now()

    if (video && pose && video.readyState >= 2 && !sendingPoseRef.current && now - lastPoseSendRef.current > 120) {
      sendingPoseRef.current = true
      lastPoseSendRef.current = now

      void pose
        .send({ image: video })
        .catch(() => {
          setPoseStatus('error')
          setLiveCue('力线识别暂时中断，请保持页面在前台运行后再试一次。')
        })
        .finally(() => {
          sendingPoseRef.current = false
        })
    }

    animationFrameRef.current = window.requestAnimationFrame(runPoseLoop)
  }, [videoRef])

  useEffect(() => {
    return () => {
      recordingRef.current = false

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }

      poseRef.current?.close?.()
    }
  }, [])

  const resetSetState = useCallback(() => {
    repStateRef.current = createRepState()
    latestLandmarksRef.current = null
    startedAtRef.current = null
    setRepCount(0)
    setSessionDuration(0)
    setAnalysis(null)
    setSummary(null)
    setLiveCue(correctionRuleRef.current?.liveCues[0] ?? equipment?.cue ?? '保持全身入镜，沿标准力线完成动作。')
  }, [equipment?.cue])

  const startSetRecording = useCallback(async () => {
    resetSetState()

    const cameraReady = cameraState === 'ready' || (await startCamera())
    if (!cameraReady) {
      return
    }

    const poseReady = await ensurePose()
    if (!poseReady) {
      return
    }

    setOverlayVisible(false)
    setSessionState('recording')
    startedAtRef.current = Date.now()
    recordingRef.current = true
    animationFrameRef.current = window.requestAnimationFrame(runPoseLoop)
  }, [cameraState, ensurePose, resetSetState, runPoseLoop, startCamera])

  const finishSetRecording = useCallback(async () => {
    if (sessionState !== 'recording') {
      return
    }

    recordingRef.current = false

    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current)
    }

    const durationSeconds = startedAtRef.current ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)) : sessionDuration
    setSessionDuration(durationSeconds)
    setSessionState('analyzing')

    let backendAnalysis: BackendFormAnalysis | null = null

    try {
      const frame = await captureFrame()
      backendAnalysis = await aiFitApi.analyzeForm(frame ?? undefined, equipmentLabelRef.current)
      setAnalysis(backendAnalysis)
    } catch {
      backendAnalysis = null
    }

    const cues = repStateRef.current.cueHistory
    const nextSummary = buildSetSummary({
      reps: repStateRef.current.count,
      durationSeconds,
      cues,
      rule: correctionRuleRef.current,
      backendAnalysis,
    })

    setRepCount(repStateRef.current.count)
    setSummary(nextSummary)
    setLiveCue(nextSummary.primaryCue)
    setSessionState('summary')
  }, [captureFrame, sessionDuration, sessionState])

  const prepareNextSet = useCallback(() => {
    resetSetState()
    setSessionState('ready')
    setOverlayVisible(true)
    window.setTimeout(() => setOverlayVisible(false), 4200)
  }, [resetSetState])

  const goChooseAnotherEquipment = useCallback(() => {
    navigate(routes.app.equipmentResult)
  }, [navigate])

  const finishWorkout = useCallback(() => {
    navigate(routes.app.home)
  }, [navigate])

  return (
    <div className="-mx-4 -my-1 min-h-[calc(100dvh-52px)] bg-black text-white" data-screen="live-correction">
      <div className="relative min-h-[calc(100dvh-52px)] overflow-hidden">
        <video autoPlay className="absolute inset-0 h-full w-full object-cover opacity-95" muted playsInline ref={videoRef} />
        {cameraState !== 'ready' ? <div className="absolute inset-0 bg-[url('/figma/live-correction.png')] bg-cover bg-center opacity-60" /> : null}
        <canvas aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover" ref={poseCanvasRef} />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(0,0,0,0.68),rgba(0,0,0,0.06)_28%,rgba(0,0,0,0.16)_62%,rgba(0,0,0,0.78))]" />

        <svg
          aria-label="标准力线"
          className="pointer-events-none absolute inset-x-[18%] top-[20%] z-20 h-[42%] opacity-70"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d={equipment?.line ?? 'M 50 16 C 50 30, 46 48, 38 70'}
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeDasharray="7 8"
            strokeLinecap="round"
            strokeWidth="6"
          />
          <path
            d={equipment?.line ?? 'M 50 16 C 50 30, 46 48, 38 70'}
            fill="none"
            stroke="rgba(134,239,172,0.92)"
            strokeLinecap="round"
            strokeWidth="3.6"
          />
        </svg>

        <div className="relative z-30 flex min-h-[calc(100dvh-52px)] flex-col justify-between px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <Link className="flex size-12 items-center justify-center rounded-full bg-black/42 backdrop-blur" replace to={routes.app.equipmentResult}>
                <ChevronLeft className="size-7" />
              </Link>
              <div className="min-w-0 flex-1 rounded-full bg-black/46 px-4 py-2 text-center backdrop-blur">
                <p className="truncate text-[12px] font-semibold text-white/68">{equipment?.machine ?? equipmentLabel}</p>
                <p className="truncate text-[18px] font-semibold leading-[22px]">{displayName}</p>
              </div>
              <button
                aria-label="切换前后摄像头"
                className="flex size-12 items-center justify-center rounded-full bg-black/42 backdrop-blur disabled:opacity-50"
                disabled={cameraState === 'starting' || sessionState === 'recording'}
                onClick={() => void switchCamera()}
                type="button"
              >
                {cameraState === 'starting' ? <Loader2 className="size-5 animate-spin" /> : <RefreshCw className="size-6" />}
              </button>
            </div>

            <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-[var(--accent-primary-solid)] px-5 py-3 shadow-[0_16px_38px_-20px_rgba(139,92,246,0.75)]">
              {sessionState === 'recording' ? <Activity className="size-5" /> : poseStatus === 'loading' ? <Loader2 className="size-5 animate-spin" /> : <ScanLine className="size-5" />}
              <span className="text-[17px] font-semibold">
                {sessionState === 'recording'
                  ? '力线识别中'
                  : sessionState === 'analyzing'
                    ? '正在分析本组'
                    : poseStatus === 'ready'
                      ? '标准力线已加载'
                      : '标准力线待加载'}
              </span>
            </div>

            <div
              className={`rounded-[24px] border border-white/16 bg-black/52 p-4 backdrop-blur-md transition-opacity duration-1000 ${
                overlayVisible && sessionState !== 'recording' && sessionState !== 'summary' ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div className="flex items-start gap-3">
                <Camera className="mt-1 size-5 text-[var(--accent-primary-solid)]" />
                <div>
                  <p className="text-[18px] font-semibold">{correctionRule?.liveCues[0] ?? '先调整拍摄位置'}</p>
                  <p className="mt-2 text-[14px] leading-[22px] text-white/72">{cameraStatusCopy}</p>
                  {correctionRule ? (
                    <div className="mt-3 flex flex-wrap gap-2 text-[12px] font-semibold">
                      <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1">{correctionRule.camera.angle}</span>
                      <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1">{correctionRule.camera.distance}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {cameraState !== 'ready' ? (
              <div className="rounded-[24px] border border-white/16 bg-black/58 p-4 text-center backdrop-blur-md">
                <VideoOff className="mx-auto size-7 text-white/76" />
                <p className="mt-2 text-[18px] font-semibold">{cameraState === 'starting' ? '正在等待摄像头授权' : '摄像头还没有开启'}</p>
                <p className="mt-1 text-[14px] leading-[22px] text-white/68">{cameraStatusCopy}</p>
                <Button
                  className="mt-4 min-h-[50px] rounded-[18px] bg-white px-6 text-[var(--accent-primary-ink)] hover:bg-white/92"
                  disabled={cameraState === 'starting'}
                  onClick={() => void startCamera()}
                  type="button"
                >
                  {cameraState === 'starting' ? <Loader2 className="size-5 animate-spin" /> : <Camera className="size-5" />}
                  开启摄像头
                </Button>
              </div>
            ) : null}

            {sessionState === 'ready' ? (
              <div className="rounded-[24px] border border-white/14 bg-black/52 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white/64">准备记录本组</p>
                    <p className="mt-1 truncate text-[16px] font-semibold">{liveCue}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[12px] font-semibold text-white/58">目标</p>
                    <p className="text-[24px] font-semibold leading-none">0/{targetReps}</p>
                  </div>
                </div>
                <Button
                  className="mt-4 min-h-[56px] w-full rounded-[18px] text-[16px]"
                  disabled={cameraState === 'starting' || poseStatus === 'loading'}
                  onClick={() => void startSetRecording()}
                  type="button"
                >
                  {poseStatus === 'loading' ? <Loader2 className="size-5 animate-spin" /> : <Play className="size-5" />}
                  开始本组记录
                </Button>
              </div>
            ) : null}

            {sessionState === 'recording' ? (
              <div className="rounded-[24px] border border-white/14 bg-black/54 p-4 backdrop-blur-md">
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white/62">当前纠偏</p>
                    <p className="mt-1 text-[15px] leading-[20px]">{liveCue}</p>
                    <p className="mt-2 text-[12px] font-semibold text-white/56">
                      {facingMode === 'environment' ? '后置摄像头' : '前置摄像头'} · {formatDuration(sessionDuration)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-semibold text-white/58">次数</p>
                    <p className="text-[36px] font-semibold leading-none text-[var(--accent-primary-solid)]">
                      {repCount}/{targetReps}
                    </p>
                  </div>
                </div>
                <Button className="mt-4 min-h-[56px] w-full rounded-[18px] bg-white text-[var(--text-primary)] hover:bg-white/92" onClick={() => void finishSetRecording()} type="button">
                  <Square className="size-5" />
                  本组训练结束
                </Button>
              </div>
            ) : null}

            {sessionState === 'analyzing' ? (
              <div className="rounded-[24px] border border-white/14 bg-black/58 p-5 text-center backdrop-blur-md">
                <Loader2 className="mx-auto size-7 animate-spin text-[var(--accent-primary-solid)]" />
                <p className="mt-3 text-[18px] font-semibold">正在生成本组分析</p>
                <p className="mt-1 text-[14px] text-white/66">会结合本组次数、入镜情况和当前器械纠偏规则。</p>
              </div>
            ) : null}

            {sessionState === 'summary' && summary ? (
              <div className="rounded-t-[30px] bg-white px-5 py-5 text-[var(--text-primary)] shadow-[0_-20px_60px_-34px_rgba(0,0,0,0.65)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--text-secondary)]">本组分析</p>
                    <h2 className="mt-1 text-[22px] font-semibold">{displayName}</h2>
                    <p className="mt-1 text-[13px] text-[var(--text-secondary)]">记录时长 {formatDuration(summary.durationSeconds)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-[var(--text-secondary)]">完成次数</p>
                    <p className="mt-1 text-[34px] font-semibold leading-none text-[var(--accent-primary-ink)]">
                      {summary.reps}/{targetReps}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-[18px] bg-[var(--surface-subtle)] p-4">
                  <p className="text-[13px] font-semibold text-[var(--text-secondary)]">下一组建议</p>
                  <p className="mt-2 text-[15px] leading-[22px]">{summary.nextSuggestion}</p>
                </div>

                <div className="mt-3 rounded-[18px] bg-[rgba(139,92,246,0.10)] p-4">
                  <p className="text-[13px] font-semibold text-[var(--accent-primary-ink)]">本组重点纠偏</p>
                  <ul className="mt-2 space-y-1 text-[14px] leading-[21px] text-[var(--text-secondary)]">
                    {summary.cues.map((cue) => (
                      <li className="flex gap-2" key={cue}>
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--accent-primary-ink)]" />
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button className="min-h-[52px] rounded-[18px]" onClick={prepareNextSet} type="button">
                    <Repeat2 className="size-5" />
                    进行下一组
                  </Button>
                  <Button className="min-h-[52px] rounded-[18px]" onClick={goChooseAnotherEquipment} type="button" variant="secondary">
                    <ScanLine className="size-5" />
                    更换器械
                  </Button>
                </div>
                <Button className="mt-3 min-h-[52px] w-full rounded-[18px]" onClick={finishWorkout} type="button" variant="subtle">
                  <Home className="size-5" />
                  结束训练，返回首页
                </Button>

                {analysis?.source ? <p className="mt-3 text-center text-[12px] text-[var(--text-tertiary)]">分析来源：{analysis.source}</p> : null}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-white/64">
              <span className="rounded-full bg-black/42 px-3 py-1 backdrop-blur">{confidence ? `器械匹配 ${(confidence * 100).toFixed(0)}%` : '器械已确认'}</span>
              <span className="rounded-full bg-black/42 px-3 py-1 backdrop-blur">
                {poseStatus === 'ready' ? 'MediaPipe 已就绪' : poseStatus === 'loading' ? 'MediaPipe 加载中' : poseStatus === 'error' ? 'MediaPipe 未加载' : '待开始识别'}
              </span>
            </div>
          </div>
        </div>

        <canvas aria-hidden="true" className="hidden" ref={captureCanvasRef} />
      </div>
    </div>
  )
}
