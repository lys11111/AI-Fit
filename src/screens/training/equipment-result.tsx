import { Camera, CheckCircle2, Dumbbell, Loader2, RefreshCw, ScanLine, SlidersHorizontal, VideoOff, XCircle } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { aiFitApi, type BackendEquipmentDetection } from '@/lib/api'
import { useCameraStream } from '@/lib/use-camera-stream'
import { usePrototypeState } from '@/prototype/state'
import { findEquipmentCorrectionRule } from './equipment-correction-rules'
import { findEquipmentOption } from './equipment-options'

type EquipmentCandidate = BackendEquipmentDetection['candidates'][number]
type DetectionStatus = 'idle' | 'scanning' | 'ranking' | 'awaiting-confirmation' | 'confirmed'
type ScanSession = { active: boolean; responses: BackendEquipmentDetection[] }

const noDetectionSources = new Set(['backend-fallback', 'yolo-empty'])

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function mergeCandidates(responses: BackendEquipmentDetection[]) {
  const byLabel = new Map<string, EquipmentCandidate>()

  for (const response of responses) {
    if (noDetectionSources.has(response.source)) {
      continue
    }

    const candidates = (response.candidates?.length ?? 0) > 0 ? response.candidates : [response]

    for (const candidate of candidates) {
      if (!candidate.supported || candidate.confidence <= 0) {
        continue
      }

      const previous = byLabel.get(candidate.label)
      if (!previous || candidate.confidence > previous.confidence) {
        byLabel.set(candidate.label, candidate)
      }
    }
  }

  return [...byLabel.values()].sort((left, right) => right.confidence - left.confidence)
}

function nextCandidateIndex(candidates: EquipmentCandidate[], rejectedLabels: string[]) {
  const rejected = new Set(rejectedLabels)
  return candidates.findIndex((candidate) => !rejected.has(candidate.label))
}

export function EquipmentResultScreen() {
  const navigate = useNavigate()
  const { actions } = usePrototypeState()
  const { saveEquipmentDetection } = actions
  const { cameraError, cameraState, facingMode, startCamera, switchCamera, videoRef } = useCameraStream()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const scanSessionRef = useRef<ScanSession | null>(null)
  const [status, setStatus] = useState<DetectionStatus>('idle')
  const [candidates, setCandidates] = useState<EquipmentCandidate[]>([])
  const [candidateIndex, setCandidateIndex] = useState(0)
  const [rejectedLabels, setRejectedLabels] = useState<string[]>([])
  const [sampleCount, setSampleCount] = useState(0)
  const [message, setMessage] = useState('点击开始识别后，请围绕器械保持 3-5 秒稳定拍摄；点击结束识别后会按置信度给出候选。')
  const candidate = candidates[candidateIndex] ?? null
  const option = candidate ? findEquipmentOption(candidate.label) : null
  const correctionRule = candidate ? findEquipmentCorrectionRule(candidate.label) : null
  const remainingCandidates = candidates.filter((item) => !rejectedLabels.includes(item.label)).length
  const cameraStatusText =
    cameraState === 'ready'
      ? `实时画面已开启，当前使用${facingMode === 'environment' ? '后置' : '前置'}摄像头。`
      : cameraState === 'starting'
        ? '正在请求摄像头权限，请在浏览器提示中选择允许。'
        : cameraError ?? '摄像头还没有开启，可以点击开启摄像头或手动选择器械。'

  useEffect(() => {
    return () => {
      if (scanSessionRef.current) {
        scanSessionRef.current.active = false
      }
    }
  }, [])

  const captureFrame = useCallback(async () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || !video.srcObject) {
      return null
    }

    const width = video.videoWidth || 640
    const height = video.videoHeight || 480
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')?.drawImage(video, 0, 0, width, height)

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.86)
    })
  }, [videoRef])

  const showRankedCandidates = useCallback(
    (responses: BackendEquipmentDetection[], nextRejectedLabels = rejectedLabels) => {
      const rankedCandidates = mergeCandidates(responses)
      const nextIndex = nextCandidateIndex(rankedCandidates, nextRejectedLabels)

      setCandidates(rankedCandidates)
      setCandidateIndex(nextIndex >= 0 ? nextIndex : 0)
      setStatus(rankedCandidates.length > 0 && nextIndex >= 0 ? 'awaiting-confirmation' : 'idle')

      if (rankedCandidates.length === 0) {
        setMessage('本轮没有识别到支持的器械。请换到器械正前方或前侧方，重新开始识别。')
        return
      }

      if (nextIndex < 0) {
        setCandidates([])
        setMessage('本轮候选已经全部排除。请重新开始识别，或手动选择器械。')
        return
      }

      setMessage(nextRejectedLabels.length > 0 ? '已切换到下一名候选，请继续确认是否正确。' : '已结束识别，请确认当前候选是否是你正在使用的器械。')
    },
    [rejectedLabels],
  )

  const startRecognition = useCallback(async () => {
    const session: ScanSession = { active: true, responses: [] }
    scanSessionRef.current = session
    setCandidates([])
    setCandidateIndex(0)
    setRejectedLabels([])
    setSampleCount(0)
    setStatus('scanning')
    setMessage('正在持续采样摄像头画面并调用本地 YOLO 模型。拍摄稳定后点击结束识别。')

    try {
      if (cameraState !== 'ready') {
        await startCamera()
        await sleep(700)
      }

      while (session.active) {
        const frame = await captureFrame()

        if (frame) {
          const detection = await aiFitApi.detectEquipment(frame)
          if (session.active) {
            session.responses.push(detection)
            setSampleCount(session.responses.length)
          }
        }

        await sleep(650)
      }
    } catch {
      if (session.active) {
        session.active = false
        setStatus('idle')
        setMessage('调用本地 YOLO 模型失败，请确认手机链接、前端代理和后端服务都在运行。')
      }
    }
  }, [cameraState, captureFrame, startCamera])

  const stopRecognition = useCallback(() => {
    const session = scanSessionRef.current
    if (!session) {
      return
    }

    session.active = false
    scanSessionRef.current = null
    setStatus('ranking')
    setMessage('正在汇总本轮采样结果，并按置信度排序...')
    window.setTimeout(() => showRankedCandidates(session.responses, []), 80)
  }, [showRankedCandidates])

  const confirmCandidate = () => {
    if (!candidate) {
      return
    }

    saveEquipmentDetection({ label: candidate.label, confidence: candidate.confidence })
    setStatus('confirmed')
    navigate(routes.app.live)
  }

  const rejectCandidate = () => {
    if (!candidate) {
      return
    }

    const nextRejectedLabels = [...new Set([...rejectedLabels, candidate.label])]
    setRejectedLabels(nextRejectedLabels)
    const nextIndex = nextCandidateIndex(candidates, nextRejectedLabels)

    if (nextIndex >= 0) {
      setCandidateIndex(nextIndex)
      setMessage('已排除刚才的候选，正在展示下一名置信度候选。')
      return
    }

    setCandidates([])
    setCandidateIndex(0)
    setStatus('idle')
    setMessage('本轮候选已全部排除。请重新开始识别，或手动选择器械。')
  }

  return (
    <Screen dataScreen="equipment-result">
      <PageHeader backTo={routes.app.training} eyebrow="Equipment" title="拍照识别器械" variant="compact" />

      <div className="overflow-hidden rounded-[var(--radius-section)] border border-[var(--border-strong)] bg-black shadow-[var(--shadow-raised)]">
        <div className="relative aspect-[4/5] min-h-[360px] overflow-hidden">
          <video autoPlay className="absolute inset-0 h-full w-full object-cover" muted playsInline ref={videoRef} />
          {cameraState !== 'ready' ? (
            <div className="absolute inset-0 bg-[url('/figma/equipment-camera.png')] bg-cover bg-center opacity-80" />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.58),rgba(0,0,0,0.06)_42%,rgba(0,0,0,0.7))]" />
          <div className="absolute inset-x-4 top-[13%] h-[62%] rounded-[30px] border-2 border-white/70 shadow-[0_0_0_999px_rgba(0,0,0,0.10)]" />
          <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
            <Badge className="border-white/20 bg-white/18 text-white" variant="outline">
              {status === 'scanning' ? `采样 ${sampleCount} 帧` : cameraState === 'ready' ? '摄像头已开启' : cameraState === 'starting' ? '正在打开摄像头' : '点击开启摄像头'}
            </Badge>
            <button
              aria-label="切换前后摄像头"
              className="flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-white/18 px-3 text-[13px] font-semibold text-white backdrop-blur transition hover:bg-white/26"
              disabled={cameraState === 'starting' || status === 'scanning'}
              onClick={switchCamera}
              type="button"
            >
              {cameraState === 'starting' || status === 'ranking' ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              {facingMode === 'environment' ? '后置' : '前置'}
            </button>
          </div>
          {cameraState !== 'ready' ? (
            <div className="absolute inset-x-5 top-1/2 z-10 -translate-y-1/2 rounded-[22px] border border-white/20 bg-black/48 p-4 text-center text-white backdrop-blur-md">
              <p className="text-[16px] font-semibold">{cameraState === 'starting' ? '正在等待摄像头授权' : '摄像头还没有开启'}</p>
              <p className="mt-1 text-[13px] leading-[19px] text-white/72">{cameraStatusText}</p>
              <Button className="mt-4 min-h-[46px] rounded-[16px] bg-white text-[var(--accent-primary-ink)] hover:bg-white/92" disabled={cameraState === 'starting'} onClick={() => void startCamera()} type="button">
                {cameraState === 'starting' ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
                开启摄像头
              </Button>
            </div>
          ) : null}
          <div className="absolute bottom-5 left-5 right-5 space-y-3 text-white">
            <Badge className="w-fit border-white/20 bg-white/18 text-white" variant="outline">
              {status === 'scanning' ? '持续识别中' : status === 'ranking' ? '正在排序' : candidate ? `候选 ${candidateIndex + 1}/${candidates.length}` : '待识别'}
            </Badge>
            <div>
              <h2 className="text-[28px] leading-[32px] font-semibold">{option?.name ?? candidate?.chineseName ?? '点击开始识别'}</h2>
              <p className="mt-1 text-[14px] leading-[21px] text-white/75">{candidate ? `${candidate.label} · 置信度 ${(candidate.confidence * 100).toFixed(0)}%` : '结束识别后会展示候选器械排名'}</p>
            </div>
          </div>
          <canvas aria-hidden="true" className="hidden" ref={canvasRef} />
        </div>
      </div>

      <GroupedSection className="space-y-3">
        <InsetRow
          copy={cameraStatusText}
          icon={cameraState === 'ready' ? Camera : VideoOff}
          meta="摄像头状态"
          title={cameraState === 'ready' ? `实时画面已开启 · ${facingMode === 'environment' ? '后置' : '前置'}` : '需要开启摄像头'}
          tone={cameraState === 'ready' ? 'mint' : 'amber'}
          trailing={
            <button
              aria-label="切换前后摄像头"
              className="flex size-10 items-center justify-center rounded-full bg-[var(--surface-raised)] text-[var(--accent-primary-ink)]"
              disabled={cameraState === 'starting' || status === 'scanning'}
              onClick={switchCamera}
              type="button"
            >
              {cameraState === 'starting' ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            </button>
          }
        />
        <InsetRow
          copy={candidate ? `候选 ${candidateIndex + 1}/${candidates.length}，本轮置信度 ${(candidate.confidence * 100).toFixed(0)}%。${message}` : message}
          icon={status === 'scanning' || status === 'ranking' ? Loader2 : candidate ? CheckCircle2 : Dumbbell}
          meta="YOLO 识别状态"
          title={candidate ? `${candidate.chineseName} · ${candidate.label}` : status === 'scanning' ? `正在采样第 ${sampleCount} 帧` : '等待开始识别'}
          tone={candidate ? 'mint' : status === 'scanning' ? 'primary' : 'indigo'}
          trailing={status === 'scanning' || status === 'ranking' ? <Loader2 className="mt-1 size-4 animate-spin text-[var(--text-tertiary)]" /> : null}
        />
        {candidate && correctionRule ? (
          <InsetRow
            copy={`${correctionRule.camera.prompt} 关键入框：${correctionRule.camera.framing}`}
            icon={ScanLine}
            meta={`${correctionRule.camera.angle} · ${correctionRule.camera.distance}`}
            title="下一步动作纠偏推荐机位"
            tone="amber"
          />
        ) : null}
        {candidates.length > 1 ? (
          <InsetRow
            copy={candidates
              .map((item, index) => `${index + 1}. ${item.chineseName} ${(item.confidence * 100).toFixed(0)}%${rejectedLabels.includes(item.label) ? ' 已排除' : ''}`)
              .join(' / ')}
            icon={SlidersHorizontal}
            title={`本轮候选排名 · 剩余 ${remainingCandidates} 个`}
            tone="primary"
          />
        ) : null}
      </GroupedSection>

      <div className="grid gap-3">
        <Button disabled={status === 'ranking'} onClick={() => void (status === 'scanning' ? stopRecognition() : startRecognition())} variant={status === 'scanning' ? 'secondary' : 'default'}>
          {status === 'scanning' || status === 'ranking' ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
          {status === 'scanning' ? '结束识别并查看结果' : candidate ? '重新开始识别' : '开始识别'}
        </Button>
        {candidate ? (
          <div className="grid grid-cols-2 gap-3">
            <Button className="min-h-[54px]" onClick={confirmCandidate} type="button">
              <CheckCircle2 className="size-4" />
              识别正确，进入纠偏
            </Button>
            <Button className="min-h-[54px]" onClick={rejectCandidate} type="button" variant="secondary">
              <XCircle className="size-4" />
              不对，查看下一候选
            </Button>
          </div>
        ) : null}
        <Button asChild variant="subtle">
          <Link to={routes.app.manualEquipment}>
            <SlidersHorizontal className="size-4" />
            手动选择器械
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to={routes.app.training}>返回训练中心</Link>
        </Button>
      </div>
    </Screen>
  )
}