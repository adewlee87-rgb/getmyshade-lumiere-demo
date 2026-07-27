import { Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const tips = [
  'Face a window or bright, even light — avoid dim rooms and warm/yellow indoor bulbs.',
  'Keep the light source in front of you, not behind — backlighting hides your true tone.',
  'Remove glasses and, if possible, heavy makeup for the most accurate reading.',
  'Center your face in the frame with a neutral expression and no filters.',
]

export function ScanTips() {
  return (
    <Card className="mx-auto mb-6 max-w-xl border-dashed bg-secondary/30">
      <CardContent className="flex items-start gap-3 py-4">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <Lightbulb className="size-4" />
        </span>
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Get the most accurate match</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {tips.map((tip) => (
              <li key={tip}>· {tip}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
