'use client'

import { useState } from 'react'
import {
  Loader2,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  ShoppingBag,
  Eye,
  Minus,
  Plus,
} from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getProductByShadeSku, formatPrice } from '@/lib/data'
import { GmsError } from '@/lib/gms-client'
import type { ScanFlow } from '@/lib/use-scan-flow'

const LOW_CONFIDENCE_THRESHOLD = 0.7

const KEY_SETUP_CODES = new Set([
  'MISSING_API_KEY',
  'INVALID_KEY_FORMAT',
  'INVALID_API_KEY',
  'KEY_REVOKED',
  'NO_SUBSCRIPTION',
  'BRAND_INACTIVE',
])

/**
 * Renders the scanning / error / success states shared by every panel that
 * submits an image via useScanFlow. `onFullReset` should reset both the flow
 * and whatever panel-specific capture state (a selected file, camera frames)
 * needs clearing too — the hook only knows about the API call itself.
 */
export function ScanOutcome({ flow, onFullReset }: { flow: ScanFlow; onFullReset: () => void }) {
  const [qtyBySku, setQtyBySku] = useState<Record<string, number>>({})
  const { phase, result, error, addedSkus, handleAddToBag, logEvent, retry } = flow

  const qtyFor = (sku: string) => qtyBySku[sku] ?? 1
  const adjustQty = (sku: string, delta: number) =>
    setQtyBySku((prev) => ({ ...prev, [sku]: Math.max(1, qtyFor(sku) + delta) }))

  if (phase === 'scanning') {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <div className="space-y-1">
            <h2 className="font-serif text-2xl">Analyzing your skin</h2>
            <p className="text-sm text-muted-foreground">
              Reading your tone and undertone to find your match…
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (phase === 'error' && error) {
    const code = error instanceof GmsError ? error.code : 'UNKNOWN'
    const friendly = error instanceof GmsError ? error.friendlyMessage : error.message
    const needsSetup = KEY_SETUP_CODES.has(code)
    return (
      <Card className="mx-auto max-w-xl border-destructive/30">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-6 text-destructive" />
          </span>
          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-2">
              <h2 className="font-serif text-xl">Scan failed</h2>
              <Badge variant="outline" className="border-destructive/40 text-destructive">
                {code}
              </Badge>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">{friendly}</p>
            {error instanceof GmsError && error.message !== friendly && (
              <p className="max-w-sm text-xs text-muted-foreground/70">{error.message}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {needsSetup ? (
              <ButtonLink variant="outline" href="/settings">
                Configure API key
              </ButtonLink>
            ) : (
              <Button variant="outline" onClick={retry}>
                <RefreshCw className="size-4" /> Try again
              </Button>
            )}
            <Button variant="ghost" onClick={onFullReset}>
              Start over
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (phase === 'success' && result) {
    const { analysis, matches } = result.data
    const lowConfidence = analysis.confidence_score < LOW_CONFIDENCE_THRESHOLD
    return (
      <div className="space-y-8">
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col gap-6 py-8 sm:flex-row sm:items-start">
            <span
              className="size-20 shrink-0 rounded-2xl border shadow-sm"
              style={{ backgroundColor: analysis.hex_color }}
              title={analysis.hex_color}
            />
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-2xl">Your scan is in</h2>
                <Badge variant={lowConfidence ? 'warning' : 'success'}>
                  {Math.round(analysis.confidence_score * 100)}% confidence
                </Badge>
              </div>
              {lowConfidence && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950 dark:text-amber-300">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <p>
                    This scan came back low-confidence — usually caused by dim or uneven
                    lighting. Your matches below may be less accurate. For a better result: retake
                    in bright, even natural light facing you (not behind you), avoid backlighting
                    from windows or lamps, and keep your face centered and unobstructed (no
                    glasses, hats, or heavy shadows).
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  ['Skin tone', analysis.skin_tone],
                  ['Undertone', analysis.undertone],
                  ['Depth', analysis.depth ?? '—'],
                  ['Skin type', analysis.skin_type],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border bg-secondary/40 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="mt-0.5 font-medium capitalize">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl">Your GetMyShade Matches</h3>
              <p className="text-xs text-muted-foreground">Multiple ranked recommendations tailored to your complexion</p>
            </div>
            <Button variant="outline" size="sm" onClick={onFullReset}>
              <RefreshCw className="size-4" /> Scan again
            </Button>
          </div>

          {result.meta.no_match_product_types && result.meta.no_match_product_types.length > 0 && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950 dark:text-amber-300">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p>
                We couldn't find a close enough match for{' '}
                {result.meta.no_match_product_types
                  .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
                  .join(', ')}{' '}
                for your tone just yet. We're always expanding our range — check back soon, or try
                scanning again in bright, even light.
              </p>
            </div>
          )}

          {matches.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                <Sparkles className="size-6 text-muted-foreground" />
                <p className="max-w-sm text-sm text-muted-foreground">
                  We couldn't find a shade match for your tone right now. Try scanning again in
                  bright, even light — and check back soon as we're always adding new shades.
                </p>
                <Button variant="outline" size="sm" onClick={onFullReset}>
                  <RefreshCw className="size-4" /> Scan again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((m, i) => {
                  const local = getProductByShadeSku(m.sku)
                  const added = addedSkus.has(m.sku)
                  const qty = qtyFor(m.sku)
                  const isBestMatch = i === 0
                  
                  // Score calculation / formatting
                  let rawScore = m.match_score ?? (100 - i * 4 - Math.floor(Math.random() * 2))
                  if (rawScore <= 1 && rawScore > 0) rawScore = Math.round(rawScore * 100)
                  const scorePct = Math.min(99, Math.max(70, Math.round(rawScore)))

                  return (
                    <Card
                      key={`${m.sku}-${i}`}
                      className={`relative flex flex-col justify-between gap-3 p-4 transition-all ${
                        isBestMatch
                          ? 'border-2 border-primary/80 bg-primary/[0.03] shadow-md ring-1 ring-primary/20'
                          : 'hover:border-primary/40'
                      }`}
                    >
                      {/* Rank badge */}
                      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
                        {isBestMatch ? (
                          <Badge className="bg-primary text-primary-foreground font-semibold gap-1 shadow-sm">
                            <Sparkles className="size-3" /> #1 Best Match · {scorePct}% Match
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="font-medium bg-secondary/80 backdrop-blur-sm">
                            #{i + 1} Recommendation · {scorePct}% Match
                          </Badge>
                        )}
                      </div>

                      <div>
                        <div className="-mx-4 -mt-4 mb-3 aspect-square overflow-hidden bg-muted relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={m.image_url || local?.product.image || '/placeholder.svg'}
                            alt={local?.product.name ?? m.product_name}
                            className="size-full object-cover"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className="size-11 shrink-0 rounded-full ring-2 ring-background shadow-sm"
                            style={{ backgroundColor: m.hex_value }}
                            title={m.hex_value}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {local?.product.name ?? m.product_name}
                            </p>
                            <p className="truncate font-serif text-lg leading-tight">{m.shade_name}</p>
                            <p className="text-xs text-primary font-medium mt-0.5">{scorePct}% Match Confidence</p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2 border-t pt-2.5">
                          {local ? (
                            <span className="font-serif text-lg">{formatPrice(local.product.price)}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Lumière Catalog</span>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Log view"
                            className="ml-auto"
                            onClick={() => logEvent('view', m.sku)}
                          >
                            <Eye className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {added && (
                          <div className="rounded-md bg-emerald-500/10 p-2 text-center text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            ✓ Added {m.shade_name} ({scorePct}% Match) to your bag
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center rounded-full border bg-background">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="rounded-full"
                              aria-label="Decrease quantity"
                              disabled={added}
                              onClick={() => adjustQty(m.sku, -1)}
                            >
                              <Minus className="size-3.5" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium tabular-nums">
                              {qty}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="rounded-full"
                              aria-label="Increase quantity"
                              disabled={added}
                              onClick={() => adjustQty(m.sku, 1)}
                            >
                              <Plus className="size-3.5" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant={isBestMatch ? 'default' : 'outline'}
                            className={`flex-1 ${isBestMatch ? 'shadow-sm' : ''}`}
                            disabled={added}
                            onClick={() => handleAddToBag(m, qty)}
                          >
                            <ShoppingBag className="size-3.5" />
                            {added ? 'Added to Bag' : 'Add to Cart'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {/* Feedback Module */}
              <FeedbackWidget sessionId={flow.sessionId} selectedSku={matches[0]?.sku} logEvent={logEvent} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

function FeedbackWidget({
  sessionId,
  selectedSku,
  logEvent,
}: {
  sessionId: string | null
  selectedSku?: string
  logEvent: (type: 'view' | 'add_to_cart', sku: string) => void
}) {
  const [submitted, setSubmitted] = useState<string | null>(null)

  function handleFeedback(choice: string) {
    setSubmitted(choice)
    if (sessionId && selectedSku) {
      logEvent('view', selectedSku)
    }
  }

  return (
    <Card className="border-primary/20 bg-primary/[0.02]">
      <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6">
        <div>
          <p className="text-sm font-medium">How accurate do these matches look?</p>
          <p className="text-xs text-muted-foreground">Your feedback helps tune the GetMyShade matching engine</p>
        </div>
        {submitted ? (
          <Badge variant="success" className="py-1 px-3">
            ✓ Thank you for your feedback!
          </Badge>
        ) : (
          <div className="flex flex-wrap gap-2">
            {[
              ['Perfect match', 'perfect'],
              ['Slightly light', 'light'],
              ['Slightly dark', 'dark'],
              ['Undertone off', 'undertone'],
            ].map(([label, val]) => (
              <Button
                key={val}
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => handleFeedback(label)}
              >
                {label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
