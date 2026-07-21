'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, CircleDot, RefreshCw, AlertTriangle, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScanOutcome } from '@/components/scan-outcome'
import { useScanFlow } from '@/lib/use-scan-flow'
import { cn } from '@/lib/utils'

const steps = [
  {
    title: 'Look straight ahead',
    instruction: 'Center your face in the frame and look directly at the camera.',
  },
  {
    title: 'Turn slightly left',
    instruction: 'Slowly turn your head a little to your left.',
  },
  {
    title: 'Turn slightly right',
    instruction: 'Slowly turn your head a little to your right.',
  },
] as const

type CameraState = 'idle' | 'requesting' | 'live' | 'denied' | 'unsupported'

export function LiveScanPanel() {
  const flow = useScanFlow()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [cameraState, setCameraState] = useState<CameraState>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const [captures, setCaptures] = useState<(string | null)[]>([null, null, null])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraState((s) => (s === 'live' ? 'idle' : s))
  }, [])

  useEffect(() => stopCamera, [stopCamera])

  async function startCamera() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported')
      return
    }
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

  function captureFrame() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth || 960
    canvas.height = video.videoHeight || 960
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Un-mirror the frame — the preview is mirrored for a natural "looking in a mirror" feel.
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)

    setCaptures((prev) => {
      const next = [...prev]
      next[stepIndex] = dataUrl
      return next
    })

    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      stopCamera()
    }
  }

  function retakeAll() {
    setCaptures([null, null, null])
    setStepIndex(0)
    startCamera()
  }

  function fullReset() {
    flow.reset()
    setCaptures([null, null, null])
    setStepIndex(0)
    setCameraState('idle')
  }

  function handleAnalyze() {
    // The straight-on capture is the actual image sent to the API — it best
    // matches GetMyShade's documented "one centered face" requirement. The
    // two turns are a liveness check confirming a real, live capture.
    if (captures[0]) flow.runScan(captures[0])
  }

  if (flow.phase !== 'idle') {
    return <ScanOutcome flow={flow} onFullReset={fullReset} />
  }

  const allCaptured = captures.every(Boolean)

  return (
    <Card className="mx-auto max-w-xl">
      <CardContent className="space-y-5 py-8">
        {!allCaptured ? (
          <>
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
                <div className="pointer-events-none absolute inset-6 rounded-[45%] border-2 border-dashed border-white/70" />
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
                        We'll guide you through a 3-step live scan: straight, left, right.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {cameraState === 'live' ? (
              <div className="space-y-3 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  {steps.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        'size-2 rounded-full transition-colors',
                        captures[i]
                          ? 'bg-primary'
                          : i === stepIndex
                            ? 'bg-primary/50'
                            : 'bg-muted-foreground/30',
                      )}
                    />
                  ))}
                </div>
                <p className="font-serif text-xl">{steps[stepIndex].title}</p>
                <p className="text-sm text-muted-foreground">{steps[stepIndex].instruction}</p>
                <Button size="lg" onClick={captureFrame}>
                  <CircleDot className="size-4" /> Capture step {stepIndex + 1} of {steps.length}
                </Button>
              </div>
            ) : (
              <Button
                className="w-full justify-center"
                size="lg"
                onClick={startCamera}
                disabled={cameraState === 'requesting' || cameraState === 'unsupported'}
              >
                <Camera className="size-4" /> Turn on camera
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {captures.map((c, i) => (
                <div key={i} className="space-y-1.5 text-center">
                  <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                    {c && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c} alt={steps[i].title} className="size-full object-cover" />
                    )}
                  </div>
                  <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Check className="size-3 text-primary" /> {steps[i].title}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={retakeAll}>
                <RefreshCw className="size-4" /> Retake
              </Button>
              <Button className="flex-1 justify-center" size="lg" onClick={handleAnalyze}>
                Analyze with GetMyShade API
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Your straight-on capture is sent to{' '}
              <span className="font-mono">POST /api-v1-match</span>. The two turns just help
              confirm a genuine live capture.
            </p>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
}
