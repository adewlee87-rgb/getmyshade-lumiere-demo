'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScanOutcome } from '@/components/scan-outcome'
import { ScanTips } from '@/components/scan-tips'
import { useScanFlow } from '@/lib/use-scan-flow'
import { cn } from '@/lib/utils'

type CameraState = 'idle' | 'requesting' | 'live' | 'denied' | 'unsupported'

// How long the "hold still" countdown runs before we auto-capture, so the
// user has a moment to center their face. One capture, no button presses.
const COUNTDOWN_FROM = 3

export function LiveScanPanel() {
  const flow = useScanFlow()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const capturedRef = useRef(false)

  const [cameraState, setCameraState] = useState<CameraState>('idle')
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM)

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraState((s) => (s === 'live' ? 'idle' : s))
  }, [])

  useEffect(() => stopCamera, [stopCamera])

  const captureAndAnalyze = useCallback(() => {
    if (capturedRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    capturedRef.current = true

    canvas.width = video.videoWidth || 960
    canvas.height = video.videoHeight || 960
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Un-mirror the frame — the preview is mirrored for a natural "looking in a
    // mirror" feel, but the API should get the true (un-flipped) image.
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)

    stopCamera()
    flow.runScan(dataUrl)
  }, [flow, stopCamera])

  // Once the camera is live, run a short countdown and then capture a single
  // frame automatically. No taps, no multi-step sequence.
  useEffect(() => {
    if (cameraState !== 'live') return
    setCountdown(COUNTDOWN_FROM)
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          captureAndAnalyze()
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [cameraState, captureAndAnalyze])

  async function startCamera() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported')
      return
    }
    capturedRef.current = false
    setCameraState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 960 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraState('live')
    } catch {
      setCameraState('denied')
    }
  }

  function fullReset() {
    flow.reset()
    capturedRef.current = false
    setCameraState('idle')
    setCountdown(COUNTDOWN_FROM)
  }

  if (flow.phase !== 'idle') {
    return <ScanOutcome flow={flow} onFullReset={fullReset} />
  }

  return (
    <>
      <ScanTips />
      <Card className="mx-auto max-w-xl">
        <CardContent className="space-y-5 py-8">
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-muted">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                'size-full scale-x-[-1] object-cover',
                cameraState !== 'live' && 'hidden',
              )}
            />
            {cameraState === 'live' && (
              <>
                <div className="pointer-events-none absolute inset-6 rounded-[45%] border-2 border-dashed border-white/70" />
                <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center gap-1">
                  <span className="grid size-14 place-items-center rounded-full bg-black/45 font-serif text-2xl text-white backdrop-blur-sm">
                    {countdown}
                  </span>
                  <span className="rounded-full bg-black/45 px-3 py-1 text-xs text-white backdrop-blur-sm">
                    Hold still — capturing automatically
                  </span>
                </div>
              </>
            )}
            {cameraState !== 'live' && (
              <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
                {cameraState === 'denied' ? (
                  <>
                    <AlertTriangle className="size-8 text-destructive" />
                    <p className="text-sm text-muted-foreground">
                      Camera access was denied. Allow camera permission for this site in your
                      browser and try again.
                    </p>
                  </>
                ) : cameraState === 'unsupported' ? (
                  <>
                    <AlertTriangle className="size-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Your browser doesn't support camera capture here. Try the Upload Photo tab
                      instead.
                    </p>
                  </>
                ) : cameraState === 'requesting' ? (
                  <>
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Requesting camera access…</p>
                  </>
                ) : (
                  <>
                    <Camera className="size-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Center your face in the frame and we'll capture your scan automatically.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {cameraState !== 'live' && (
            <Button
              className="w-full justify-center"
              size="lg"
              onClick={startCamera}
              disabled={cameraState === 'requesting' || cameraState === 'unsupported'}
            >
              <Camera className="size-4" /> Turn on camera
            </Button>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </>
  )
}
