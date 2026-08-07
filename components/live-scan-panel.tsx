'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, AlertTriangle, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScanOutcome } from '@/components/scan-outcome'
import { ScanTips } from '@/components/scan-tips'
import { useScanFlow } from '@/lib/use-scan-flow'
import { cn } from '@/lib/utils'

type CameraState = 'idle' | 'requesting' | 'capturing' | 'denied' | 'unsupported'
type Pose = 'forward' | 'left' | 'right'

const COUNTDOWN_FROM = 3

const poseInstructions: Record<Pose, string> = {
  forward: 'Look forward',
  left: 'Turn your head left',
  right: 'Turn your head right',
}

const poseLabels: Record<Pose, string> = {
  forward: 'Forward',
  left: 'Left',
  right: 'Right',
}

// The three angles we walk the user through, in order. The forward frame is
// what gets sent to the shade-match API; left/right add a guided, liveness-style
// capture so the user squares up and we confirm even lighting from each side.
const POSES: Pose[] = ['forward', 'left', 'right']

export function LiveScanPanel() {
  const flow = useScanFlow()
  // runScan is a stable reference from useScanFlow (a useCallback with [] deps).
  // Pull it out so captureCurrentPose doesn't depend on the whole `flow` object,
  // which is a fresh identity on every render.
  const { runScan } = flow
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  // Frames captured so far, keyed by pose. Guards against a pose being captured
  // twice: lastCapturedPoseRef holds the index of the last pose we captured.
  const framesRef = useRef<Partial<Record<Pose, string>>>({})
  const lastCapturedPoseRef = useRef(-1)

  const [cameraState, setCameraState] = useState<CameraState>('idle')
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM)
  const [poseIndex, setPoseIndex] = useState(0)

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraState((s) => (s === 'capturing' ? 'idle' : s))
  }, [])

  useEffect(() => stopCamera, [stopCamera])

  // Capture the current pose's frame. When more poses remain, advance to the
  // next one (resetting the countdown in the same batched update so the trigger
  // effect below never re-fires against a stale countdown of 0). On the final
  // pose, stop the camera and send the forward frame to the API.
  const captureCurrentPose = useCallback(() => {
    if (lastCapturedPoseRef.current >= poseIndex) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth || 960
    canvas.height = video.videoHeight || 960
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    lastCapturedPoseRef.current = poseIndex
    // Un-mirror the frame — the preview is mirrored for a natural "looking in a
    // mirror" feel, but the API should get the true (un-flipped) image.
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    framesRef.current[POSES[poseIndex]] = canvas.toDataURL('image/jpeg', 0.92)

    if (poseIndex < POSES.length - 1) {
      setCountdown(COUNTDOWN_FROM)
      setPoseIndex((i) => i + 1)
    } else {
      stopCamera()
      runScan(framesRef.current.forward ?? framesRef.current[POSES[poseIndex]]!)
    }
  }, [poseIndex, runScan, stopCamera])

  // Tick a short countdown for the current pose. Depends on cameraState and
  // poseIndex only — NOT on countdown or captureCurrentPose — so ticking never
  // tears down its own interval. Restarts fresh each time the pose advances.
  useEffect(() => {
    if (cameraState !== 'capturing') return
    setCountdown(COUNTDOWN_FROM)
    const interval = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 0 : c - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [cameraState, poseIndex])

  // When a pose's countdown reaches zero, capture that frame automatically.
  useEffect(() => {
    if (cameraState === 'capturing' && countdown === 0) {
      captureCurrentPose()
    }
  }, [cameraState, countdown, captureCurrentPose])

  async function startCamera() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported')
      return
    }
    framesRef.current = {}
    lastCapturedPoseRef.current = -1
    setPoseIndex(0)
    setCountdown(COUNTDOWN_FROM)
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
      setCameraState('capturing')
    } catch {
      setCameraState('denied')
    }
  }

  function fullReset() {
    flow.reset()
    framesRef.current = {}
    lastCapturedPoseRef.current = -1
    setPoseIndex(0)
    setCameraState('idle')
    setCountdown(COUNTDOWN_FROM)
  }

  if (flow.phase !== 'idle') {
    return <ScanOutcome flow={flow} onFullReset={fullReset} />
  }

  const currentPose = POSES[poseIndex]

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
                cameraState !== 'capturing' && 'hidden',
              )}
            />
            {cameraState === 'capturing' && (
              <>
                <div className="pointer-events-none absolute inset-6 rounded-[45%] border-2 border-dashed border-white/70" />
                {/* Pose progress dots — one per angle, checked as it's captured */}
                <div className="pointer-events-none absolute inset-x-0 top-4 flex items-center justify-center gap-2">
                  {POSES.map((pose, i) => (
                    <span
                      key={pose}
                      className={cn(
                        'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs backdrop-blur-sm transition-colors',
                        i === poseIndex
                          ? 'bg-white/90 font-medium text-black'
                          : i < poseIndex
                            ? 'bg-emerald-500/80 text-white'
                            : 'bg-black/40 text-white/80',
                      )}
                    >
                      {i < poseIndex && <Check className="size-3" />}
                      {poseLabels[pose]}
                    </span>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center gap-1">
                  <span className="grid size-14 place-items-center rounded-full bg-black/45 font-serif text-2xl text-white backdrop-blur-sm">
                    {countdown}
                  </span>
                  <span className="rounded-full bg-black/45 px-3 py-1 text-xs text-white backdrop-blur-sm">
                    {poseInstructions[currentPose]} — hold still
                  </span>
                </div>
              </>
            )}
            {cameraState !== 'capturing' && (
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
                      We'll guide you through three quick angles — look forward, then turn left and
                      right. Each is captured automatically.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {cameraState !== 'capturing' && (
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
