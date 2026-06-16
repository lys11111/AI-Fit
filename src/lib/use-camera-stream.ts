import { useCallback, useEffect, useRef, useState } from 'react'

export type CameraState = 'idle' | 'starting' | 'ready' | 'blocked'
export type CameraFacingMode = 'environment' | 'user'

function describeCameraError(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError') {
      return '浏览器没有获得摄像头权限。请允许摄像头后再点击开启。'
    }

    if (error.name === 'NotFoundError') {
      return '没有检测到可用摄像头。可以接入摄像头或改用手动选择器械。'
    }

    if (error.name === 'NotReadableError') {
      return '摄像头正被其他程序占用。关闭占用程序后再试一次。'
    }
  }

  return '摄像头暂时无法开启。请检查浏览器权限或使用手动选择。'
}

export function useCameraStream() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const facingModeRef = useRef<CameraFacingMode>('environment')
  const [cameraState, setCameraState] = useState<CameraState>('idle')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<CameraFacingMode>('environment')

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  const startCamera = useCallback(async (nextFacingMode: CameraFacingMode = facingModeRef.current) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('blocked')
      setCameraError('当前浏览器没有开放摄像头能力，可以先手动选择器械。')
      return false
    }

    setCameraState('starting')
    setCameraError(null)
    stopCamera()

    const constraintCandidates: MediaStreamConstraints[] = [
      {
        video: {
          facingMode: { ideal: nextFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      },
      {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      },
      { video: true, audio: false },
    ]

    let lastError: unknown = null

    for (const constraints of constraintCandidates) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.muted = true
          videoRef.current.playsInline = true
          await videoRef.current.play().catch(() => undefined)
        }

        setCameraState('ready')
        setCameraError(null)
        facingModeRef.current = nextFacingMode
        setFacingMode(nextFacingMode)
        return true
      } catch (error) {
        lastError = error
      }
    }

    setCameraState('blocked')
    setCameraError(describeCameraError(lastError))
    return false
  }, [stopCamera])

  const switchCamera = useCallback(async () => {
    const nextFacingMode = facingModeRef.current === 'environment' ? 'user' : 'environment'
    return startCamera(nextFacingMode)
  }, [startCamera])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void startCamera()
    }, 0)

    return () => {
      window.clearTimeout(timer)
      stopCamera()
    }
  }, [startCamera, stopCamera])

  return {
    cameraError,
    cameraState,
    facingMode,
    startCamera,
    stopCamera,
    streamRef,
    switchCamera,
    videoRef,
  }
}
