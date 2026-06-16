import { Camera, CheckCircle2, Dumbbell, Loader2, RefreshCw, SlidersHorizontal, VideoOff, XCircle } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { aiFitApi, type BackendEquipmentDetection } from '@/lib/api'
import { useCameraStream } from '@/lib/use-camera-stream'
import { usePrototypeState } from '@/prototype/state'
import { findEquipmentOption } from './equipment-options'

type EquipmentCandidate = BackendEquipmentDetection['candidates'][number]
type DetectionStatus = 'idle' | 'scanning' | 'awaiting-confirmation' | 'confirmed'

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function mergeCandidates(responses: BackendEquipmentDetection[]) {
  const byLabel = new Map<string, EquipmentCandidate>()

  for (const response of responses) {
    const candidates = (response.candidates?.length ?? 0) > 0 ? response.candidates : [response]

    for (const candidate of candidates) {
      const previous = byLabel.get(candidate.label)
      if (!previous || candidate.confidence > previous.confidence) {
        byLabel.set(candidate.label, candidate)
      }
    }
  }

  return [...byLabel.values()].sort((left, right) => right.confidence - left.confidence)
}

function firstCandidateIndex(candidates: EquipmentCandidate[], rejectedLabels: string[]) {
  const rejected = new Set(rejectedLabels)
  const index = candidates.findIndex((candidate) => !rejected.has(candidate.label))
  return index === -1 ? 0 : index
}

export function EquipmentResultScreen() {
  const navigate = useNavigate()
  const { state, actions } = usePrototypeState()
  const { saveEquipmentDetection } = actions
  const { cameraError, cameraState, facingMode, startCamera, switchCamera, videoRef } = useCameraStream()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fallbackMachine = state.equipment.manualSelection ?? state.plan.exercises[0]?.machineClass ?? 'Lat Pull Down'
  const [status, setStatus] = useState<DetectionStatus>('idle')
  const [candidates, setCandidates] = useState<EquipmentCandidate[]>([])
  const [candidateIndex, setCandidateIndex] = useState(0)
  const [rejectedLabels, setRejectedLabels] = useState<string[]>([])
  const [message, setMessage] = useState('请把器械主体放在画面中央，点击识别后会连续采样视频帧。')
  const candidate = candidates[candidateIndex] ?? null
  const option = findEquipmentOption(candidate?.label ?? fallbackMachine)
  const cameraStatusText =
    cameraState === 'ready'
      ? `实时画面已开启，当前使用${facingMode === 'environment' ? '后置' : '前置'}摄像头。`
      : cameraState === 'starting'
        ? '正在请求摄像头权限，请在浏览器提示中选择允许。'
        : cameraError ?? '摄像头还没有开启，可以点击开启摄像头或手动选择器械。'

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

  const scanEquipment = useCallback(
    async (nextRejectedLabels = rejectedLabels) => {
      setStatus('scanning')
      setMessage('正在连续采样摄像头画面，并调用本地 YOLO 模型识别器械...')

      try {
        if (cameraState !== 'ready') {
          await startCamera()
          await sleep(450)
        }

        const responses: BackendEquipmentDetection[] = []
        for (let index = 0; index < 5; index += 1) {
          const frame = await captureFrame()
          const detection = await aiFitApi.detectEquipment(frame ?? undefined)
          responses.push(detection)
          await sleep(260)
        }

        const rankedCandidates = mergeCandidates(responses)
        const nextIndex = firstCandidateIndex(rankedCandidates, nextRejectedLabels)
        setCandidates(rankedCandidates)
        setCandidateIndex(nextIndex)
        setStatus('awaiting-confirmation')

        const nextCandidate = rankedCandidates[nextIndex]
        if (nextCandidate) {
          const alreadyRejected = nextRejectedLabels.includes(rankedCandidates[0]?.label ?? '')
          setMessage(
            alreadyRejected && nextIndex > 0
              ? '最高置信度候选刚才已被否认，这次先展示下一名候选。'
              : '已选取本轮视频流中置信度最高的器械，请确认识别是否正确。',
          )
        } else {
          setMessage('本轮没有识别到支持的器械，请调整角度后再次识别。')
        }
      } catch {
        setStatus('idle')
        setMessage('调用本地 YOLO 模型失败，请确认后端服务已启动并加载模型。')
      }
    },
    [cameraState, captureFrame, rejectedLabels, startCamera],
  )

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
      void scanEquipment(rejectedLabels)
      return
    }

    const nextRejectedLabels = [...new Set([...rejectedLabels, candidate.label])]
    setRejectedLabels(nextRejectedLabels)
    const nextIndex = firstCandidateIndex(candidates, nextRejectedLabels)

    if (candidates[nextIndex] && !nextRejectedLabels.includes(candidates[nextIndex].label)) {
      setCandidateIndex(nextIndex)
      setMessage('已跳过刚才的候选，展示本轮置信度排名下一位。')
      return
    }

    setMessage('本轮候选已全部否认，正在重新调用模型识别。')
    void scanEquipment(nextRejectedLabels)
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
          <div className="absolute inset-x-9 top-[28%] h-[36%] rounded-[26px] border-2 border-white/75 shadow-[0_0_0_999px_rgba(0,0,0,0.15)]" />
          <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
            <Badge className="border-white/20 bg-white/18 text-white" variant="outline">
              {cameraState === 'ready' ? '摄像头已开启' : cameraState === 'starting' ? '正在打开摄像头' : '点击开启摄像头'}
            </Badge>
            <button
              aria-label="切换前后摄像头"
              className="flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-white/18 px-3 text-[13px] font-semibold text-white backdrop-blur transition hover:bg-white/26"
              disabled={cameraState === 'starting' || status === 'scanning'}
              onClick={switchCamera}
              type="button"
            >
              {cameraState === 'starting' || status === 'scanning' ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
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
              {status === 'scanning' ? '识别中' : candidate ? '等待确认' : '待识别'}
            </Badge>
            <div>
              <h2 className="text-[28px] leading-[32px] font-semibold">{option?.name ?? candidate?.chineseName ?? '对准器械开始识别'}</h2>
              <p className="mt-1 text-[14px] leading-[21px] text-white/75">{candidate ? candidate.label : '识别结果会用于下一步动作纠偏'}</p>
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
              {cameraState === 'starting' || status === 'scanning' ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            </button>
          }
        />
        <InsetRow
          copy={candidate ? `本轮置信度 ${(candidate.confidence * 100).toFixed(0)}%。${message}` : message}
          icon={status === 'scanning' ? Loader2 : candidate ? CheckCircle2 : Dumbbell}
          meta="YOLO 识别状态"
          title={candidate ? `${candidate.chineseName} · ${candidate.label}` : '等待模型识别'}
          tone={candidate ? 'mint' : 'indigo'}
          trailing={status === 'scanning' ? <Loader2 className="mt-1 size-4 animate-spin text-[var(--text-tertiary)]" /> : null}
        />
        {candidates.length > 1 ? (
          <InsetRow
            copy={candidates.map((item, index) => `${index + 1}. ${item.chineseName} ${(item.confidence * 100).toFixed(0)}%`).join(' / ')}
            icon={SlidersHorizontal}
            title="本轮候选排名"
            tone="primary"
          />
        ) : null}
      </GroupedSection>

      <div className="grid gap-3">
        <Button disabled={status === 'scanning'} onClick={() => void scanEquipment()} variant={candidate ? 'secondary' : 'default'}>
          {status === 'scanning' ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
          {candidate ? '再次调用模型识别' : '连续识别器械'}
        </Button>
        {candidate ? (
          <div className="grid grid-cols-2 gap-3">
            <Button className="min-h-[54px]" onClick={confirmCandidate} type="button">
              <CheckCircle2 className="size-4" />
              就是它，开练！
            </Button>
            <Button className="min-h-[54px]" onClick={rejectCandidate} type="button" variant="secondary">
              <XCircle className="size-4" />
              不是它，你搞错啦
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
