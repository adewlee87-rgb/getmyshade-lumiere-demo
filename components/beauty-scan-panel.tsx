'use client'

import { useRef, useState } from 'react'
import { UploadCloud, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScanOutcome } from '@/components/scan-outcome'
import { ScanTips } from '@/components/scan-tips'
import { useScanFlow } from '@/lib/use-scan-flow'
import { fileToBase64 } from '@/lib/gms-client'

export function BeautyScanPanel() {
  const flow = useScanFlow()
  const inputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  function pickFile(f: File) {
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) pickFile(f)
  }

  function fullReset() {
    flow.reset()
    setFile(null)
    setPreviewUrl(null)
  }

  async function runScan() {
    if (!file) return
    const image = await fileToBase64(file)
    flow.runScan(image)
  }

  if (flow.phase !== 'idle') {
    return <ScanOutcome flow={flow} onFullReset={fullReset} />
  }

  return (
    <>
      <ScanTips />
      <Card className="mx-auto max-w-xl">
        <CardContent className="space-y-5 py-8">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors hover:border-primary/40 hover:bg-muted/40"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) pickFile(f)
              }}
            />
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Selected selfie preview"
                className="size-40 rounded-xl object-cover"
              />
            ) : (
              <>
                <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
                  <UploadCloud className="size-6" />
                </span>
                <div>
                  <p className="font-medium">Drag a selfie here, or click to upload</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPEG, PNG, WebP, or HEIC · up to 10MB · one centered, evenly lit face
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Sent directly to <span className="font-mono">POST /api-v1-match</span>
            </p>
            <Button onClick={runScan} disabled={!file}>
              <Sparkles className="size-4" /> Analyze My Skin
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
