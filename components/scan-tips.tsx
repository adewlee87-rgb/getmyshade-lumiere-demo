import React from 'react'
import { Sun, Sparkles, Scan, Focus, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const tips = [
  {
    icon: Sun,
    title: 'Natural & Bright Light',
    text: 'Face a window or bright, even light — avoid dim rooms and warm/yellow indoor bulbs.',
  },
  {
    icon: Focus,
    title: 'Front Lighting Only',
    text: 'Keep the light source in front of you, not behind — backlighting hides your true tone.',
  },
  {
    icon: Sparkles,
    title: 'Bare Skin & Clear View',
    text: 'Remove glasses and, if possible, heavy makeup for the most accurate reading.',
  },
  {
    icon: Scan,
    title: 'Centered & Unfiltered',
    text: 'Center your face in the frame with a neutral expression and no filters.',
  },
]

export function ScanTips() {
  return (
    <Card className="mx-auto mb-8 max-w-3xl overflow-hidden border-primary/20 bg-gradient-to-br from-card via-background to-primary/5 p-6 sm:p-8 shadow-md">
      <div className="flex flex-col items-center text-center space-y-2 mb-6">
        <Badge variant="accent" className="gap-1.5 px-3 py-1 text-[11px] uppercase tracking-wider font-semibold">
          <CheckCircle2 className="size-3.5 text-primary" /> Scanning Best Practices
        </Badge>
        <h3 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Get the most accurate match
        </h3>
        <p className="text-xs text-muted-foreground max-w-md">
          Follow these quick guidelines to help GetMyShade measure your true skin depth and undertone.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {tips.map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={i}
              className="group flex items-start gap-3.5 rounded-2xl border bg-card/60 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-sm"
            >
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Icon className="size-4.5" />
              </span>
              <div className="space-y-1 text-left">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
