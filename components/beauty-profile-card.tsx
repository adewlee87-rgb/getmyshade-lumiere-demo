import { Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { beautyProfile } from '@/lib/data'

const attributes = [
  { label: 'Skin Tone', key: 'skinTone' as const },
  { label: 'Undertone', key: 'undertone' as const },
  { label: 'Skin Type', key: 'skinType' as const },
  { label: 'Face Shape', key: 'faceShape' as const },
]

export function BeautyProfileCard({ compact = false }: { compact?: boolean }) {
  const p = beautyProfile
  return (
    <Card className="gap-5 overflow-hidden p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h3 className="font-medium leading-tight">Your Beauty Profile</h3>
            <p className="text-xs text-muted-foreground">Analyzed {p.lastAnalyzed}</p>
          </div>
        </div>
        <Badge variant="success">{p.confidence}% confidence</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {attributes.map((a) => (
          <div key={a.key} className="rounded-lg border bg-secondary/40 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{a.label}</p>
            <p className="mt-0.5 font-medium">{p[a.key]}</p>
          </div>
        ))}
      </div>

      {!compact && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Skin Concerns</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.concerns.map((c) => (
              <Badge key={c} variant="outline">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
