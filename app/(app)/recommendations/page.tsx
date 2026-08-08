'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { BeautyProfileCard } from '@/components/beauty-profile-card'
import { ProductCard } from '@/components/product-card'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { recommendedProducts } from '@/lib/data'
import { cn } from '@/lib/utils'

const filters = ['All', 'Foundation', 'Concealer', 'Contour', 'Blush', 'Highlighter', 'Lipstick'] as const

export default function RecommendationsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')

  const visible =
    filter === 'All'
      ? recommendedProducts
      : recommendedProducts.filter((p) => p.category === filter)

  return (
    <>
      <PageHeader
        eyebrow="Personalized"
        title="Recommended for you"
        description="Every product below was matched to your beauty profile for your unique tone and undertone."
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BeautyProfileCard />
        </aside>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm transition-colors',
                  filter === f
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-muted',
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {visible.map((p) => (
              <Card key={p.id} className="overflow-hidden">
                <CardContent className="grid gap-0 p-0 sm:grid-cols-[220px_1fr]">
                  <div className="aspect-square bg-muted sm:aspect-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image || '/placeholder.svg'}
                      alt={p.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-3 p-6">
                    <div className="flex items-center gap-2">
                      <Badge className="gap-1">
                        <Sparkles className="size-3" /> Matched
                      </Badge>
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {p.category}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl">{p.name}</h3>
                    {p.matchReason && (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-primary">
                          Why it matches you
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{p.matchReason}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {p.bestFor.map((b) => (
                        <Badge key={b} variant="outline">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h2 className="mb-4 font-serif text-xl">Complete the routine</h2>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
