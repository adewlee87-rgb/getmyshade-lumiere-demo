import { Sparkles, Wand2, Clock } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ProductCard } from '@/components/product-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { beautyProfile, recommendedProducts } from '@/lib/data'

const attributes = [
  { label: 'Skin Tone', value: beautyProfile.skinTone },
  { label: 'Undertone', value: beautyProfile.undertone },
  { label: 'Skin Type', value: beautyProfile.skinType },
  { label: 'Face Shape', value: beautyProfile.faceShape },
  { label: 'Recommended Shade', value: beautyProfile.recommendedShade },
]

const scanHistory = [
  { date: beautyProfile.lastAnalyzed, confidence: beautyProfile.confidence, source: 'Guided quiz' },
  { date: 'Feb 3, 2026', confidence: 91, source: 'Guided quiz' },
]

export default function BeautyProfilePage() {
  return (
    <>
      <PageHeader
        eyebrow="Personalized"
        title="Beauty profile"
        description="Everything your AI Beauty Match has learned about you, in one place."
      >
        <ButtonLink href="/match">
          <Wand2 className="size-4" /> Re-run analysis
        </ButtonLink>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="gap-5 p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-medium">
                <Sparkles className="size-4 text-primary" /> Your analysis
              </h3>
              <Badge variant="success">{beautyProfile.confidence}% confidence</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {attributes.map((a) => (
                <div key={a.label} className="rounded-lg border bg-secondary/40 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{a.label}</p>
                  <p className="mt-0.5 font-medium">{a.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Skin Concerns</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {beautyProfile.concerns.map((c) => (
                  <Badge key={c} variant="outline">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-xl">Matched for you</h3>
              <ButtonLink href="/recommendations" variant="ghost" size="sm">
                See all
              </ButtonLink>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {recommendedProducts.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>

        <Card className="h-fit gap-4 p-6">
          <h3 className="flex items-center gap-2 font-medium">
            <Clock className="size-4" /> Scan history
          </h3>
          <div className="flex flex-col divide-y">
            {scanHistory.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{s.date}</p>
                  <p className="text-xs text-muted-foreground">{s.source}</p>
                </div>
                <Badge variant="muted">{s.confidence}%</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
