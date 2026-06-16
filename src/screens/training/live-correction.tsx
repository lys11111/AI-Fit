import { Camera, CheckCircle2, Loader2, Pause, RefreshCw, ScanLine, VideoOff, X } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { aiFitApi, type BackendFormAnalysis } from '@/lib/api'
import { useCameraStream } from '@/lib/use-camera-stream'
import { usePrototypeState } from '@/prototype/state'
import { findEquipmentOption } from './equipment-options'

type AnalyzeState = 'idle' | 'analyzing' | 'done'

export function LiveCorrectionScreen() {
  const { state } = usePrototypeState()
  const { cameraError, cameraState, facingMode, startCamera, switchCamera, videoRef } = useCameraStream()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [analyzeState, setAnalyzeState] = useState<AnalyzeState>('idle')
  const [analysis, setAnalysis] = useState<BackendFormAnalysis | null>(null)
  const currentExercise = state.plan.exercises[0]
  const equipmentLabel = state.equipment.manualSelection ?? state.equipment.lastDetectedLabel ?? currentExercise?.machineClass ?? 'Lat Pull Down'
  const equipment = findEquipmentOption(equipmentLabel)
  const displayName = equipment?.name ?? currentExercise?.name ?? '正握宽距高位下拉'
  const confidence = state.equipment.lastDetectedConfidence

  const statusCopy = useMemo(() => {
    if (cameraState === 'blocked') {
      return cameraError ?? '摄像头未开启，请检查浏览器权限，或回到器械识别页重新授权。'
    }

    if (cameraState === 'starting') {
      return '正在请求摄像头权限，请在浏览器提示中选择允许。'
    }

    if (analysis) {
      return analysis.cues.join('；')
    }

    return '请让身体、关节和器械轨迹完整入镜。开始分析后，系统会把当前动作和标准力线进行比对。'
  }, [analysis, cameraError, cameraState])

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

  const analyzeCurrentFrame = useCallback(async () => {
    setAnalyzeState('analyzing')

    try {
      if (cameraState !== 'ready') {
        await startCamera()
      }

      const frame = await captureFrame()
      const response = await aiFitApi.analyzeForm(frame ?? undefined, equipmentLabel)
      setAnalysis(response)
    } catch {
      setAnalysis({
        status: 'needs-camera',
        equipment: equipmentLabel,
        repCount: 0,
        cues: ['请保持全身和器械轨迹清晰入镜', equipment?.cue ?? '先对齐标准力线，再开始动作'],
        drawPoseLines: false,
        source: 'local-fallback',
      })
    } finally {
      setAnalyzeState('done')
    }
  }, [cameraState, captureFrame, equipment?.cue, equipmentLabel, startCamera])

  return (
    <div className="-mx-4 -my-1 flex min-h-[calc(100dvh-52px)] flex-col bg-black text-white" data-screen="live-correction">
      <div className="relative min-h-[calc(100dvh-52px)] overflow-hidden">
        <video autoPlay className="absolute inset-0 h-full w-full object-cover opacity-86" muted playsInline ref={videoRef} />
        {cameraState !== 'ready' ? (
          <div className="absolute inset-0 bg-[url('/figma/live-correction.png')] bg-cover bg-center opacity-70" />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.66),rgba(0,0,0,0.12)_34%,rgba(0,0,0,0.84))]" />

        <svg aria-label="标准力线" className="pointer-events-none absolute inset-x-4 top-[16%] z-10 h-[46%] rounded-[28px] border border-white/18 bg-black/8" viewBox="0 0 100 100">
          <path d={equipment?.line ?? 'M 50 16 C 50 30, 46 48, 38 70'} fill="none" stroke="rgba(255,255,255,0.32)" strokeDasharray="6 7" strokeLinecap="round" strokeWidth="4" />
          <path d={equipment?.line ?? 'M 50 16 C 50 30, 46 48, 38 70'} fill="none" stroke="rgba(134,239,172,0.95)" strokeLinecap="round" strokeWidth="3.2" />
          {analysis?.drawPoseLines ? (
            <path d="M 48 18 C 51 34, 49 50, 41 72" fill="none" stroke="rgba(251,191,36,0.95)" strokeLinecap="round" strokeWidth="3" />
          ) : null}
          <circle cx="50" cy="16" fill="rgba(134,239,172,0.95)" r="3.2" />
          <circle cx="38" cy="70" fill="rgba(134,239,172,0.95)" r="3.2" />
        </svg>

        <div className="relative z-20 flex min-h-[calc(100dvh-52px)] flex-col justify-between px-5 pb-7 pt-8">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Link className="flex size-14 items-center justify-center rounded-full bg-black/35 backdrop-blur" replace to={routes.app.equipmentResult}>
                <X className="size-7" />
              </Link>
              <div className="max-w-[230px] rounded-full bg-black/45 px-5 py-2 text-center backdrop-blur">
                <p className="truncate text-[13px] font-semibold text-white/75">{equipment?.machine ?? equipmentLabel}</p>
                <p className="truncate text-[20px] font-semibold">{displayName}</p>
              </div>
              <button
                aria-label="切换前后摄像头"
                className="flex size-14 items-center justify-center rounded-full bg-black/35 backdrop-blur"
                disabled={cameraState === 'starting'}
                onClick={switchCamera}
                type="button"
              >
                {cameraState === 'starting' ? <Loader2 className="size-6 animate-spin" /> : <RefreshCw className="size-6" />}
              </button>
            </div>

            <div className="mx-auto w-fit rounded-full bg-[var(--accent-primary-solid)] px-6 py-3 shadow-[0_16px_38px_-22px_rgba(255,255,255,0.75)]">
              <div className="flex items-center gap-2">
                {analyzeState === 'analyzing' ? <Loader2 className="size-5 animate-spin" /> : <ScanLine className="size-5" />}
                <span className="text-[20px] font-semibold">
                  {analyzeState === 'analyzing' ? '正在比对力线...' : cameraState === 'ready' ? '标准力线已加载' : cameraState === 'starting' ? '正在打开摄像头...' : '等待摄像头权限'}
                </span>
              </div>
            </div>

            {cameraState !== 'ready' ? (
              <div className="rounded-[22px] border border-white/18 bg-black/48 p-4 text-center backdrop-blur-md">
                <p className="text-[18px] font-semibold">{cameraState === 'starting' ? '正在等待摄像头授权' : '摄像头还没有开启'}</p>
                <p className="mt-1 text-[14px] leading-[22px] text-white/72">{statusCopy}</p>
                <Button className="mt-4 min-h-[48px] rounded-[16px] bg-white text-[var(--accent-primary-ink)] hover:bg-white/92" disabled={cameraState === 'starting'} onClick={() => void startCamera()} type="button">
                  {cameraState === 'starting' ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
                  开启摄像头
                </Button>
              </div>
            ) : null}
          </div>

          <div className="space-y-5">
            <div className="rounded-[22px] border border-white/18 bg-black/42 p-4 backdrop-blur-md">
              <div className="flex items-start gap-3">
                {cameraState === 'blocked' ? <VideoOff className="mt-1 size-5 text-red-200" /> : <Camera className="mt-1 size-5 text-[var(--accent-primary-solid)]" />}
                <div className="space-y-2">
                  <p className="text-[18px] font-semibold">{equipment?.cue ?? '先对齐标准力线，再开始动作'}</p>
                  <p className="text-[14px] leading-[22px] text-white/72">{statusCopy}</p>
                </div>
              </div>
            </div>

            <div className="rounded-t-[34px] bg-white px-5 py-6 text-[var(--text-primary)]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[14px] font-semibold text-[var(--text-secondary)]">识别器械</p>
                  <p className="mt-2 text-[22px] leading-[27px] font-semibold">{displayName}</p>
                  <p className="mt-1 text-[13px] font-semibold text-[var(--accent-primary-ink)]">
                    {facingMode === 'environment' ? '后置摄像头' : '前置摄像头'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-semibold text-[var(--text-secondary)]">完成次数</p>
                  <p className="mt-2 text-[34px] font-semibold text-[var(--accent-primary-ink)]">{analysis?.repCount ?? 0}/12</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-[0.82fr_1.18fr] gap-3">
                <Button className="min-h-[56px] rounded-[18px]" variant="secondary">
                  <Pause className="size-5" />
                  暂停
                </Button>
                <Button className="min-h-[56px] rounded-[18px]" disabled={analyzeState === 'analyzing' || cameraState === 'starting'} onClick={() => void (cameraState === 'ready' ? analyzeCurrentFrame() : startCamera())}>
                  {analyzeState === 'analyzing' || cameraState === 'starting' ? <Loader2 className="size-5 animate-spin" /> : cameraState === 'ready' ? <ScanLine className="size-5" /> : <Camera className="size-5" />}
                  {cameraState === 'ready' ? '分析当前动作' : '开启摄像头'}
                </Button>
              </div>

              <Button className="mt-3 min-h-[52px] w-full rounded-[18px]" disabled={cameraState === 'starting'} onClick={switchCamera} variant="subtle">
                {cameraState === 'starting' ? <Loader2 className="size-5 animate-spin" /> : <RefreshCw className="size-5" />}
                切换到{facingMode === 'environment' ? '前置' : '后置'}摄像头
              </Button>

              <Button asChild className="mt-3 min-h-[52px] w-full rounded-[18px]" variant="secondary">
                <Link to={routes.app.feedback}>
                  <CheckCircle2 className="size-5" />
                  完成本组
                </Link>
              </Button>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">标准力线：{equipment?.focus ?? state.plan.focusPreference}</Badge>
                <Badge variant="outline">{confidence ? `器械匹配 ${(confidence * 100).toFixed(0)}%` : '器械已选择'}</Badge>
                <Badge variant="outline">{analysis?.drawPoseLines ? '用户力线已捕捉' : '等待用户力线'}</Badge>
              </div>
            </div>
          </div>
        </div>
        <canvas aria-hidden="true" className="hidden" ref={canvasRef} />
      </div>
    </div>
  )
}
