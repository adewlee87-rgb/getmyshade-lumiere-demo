'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Loader2,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  ShoppingBag,
  Eye,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
} from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getProductByShadeSku, formatPrice } from '@/lib/data'
import { GmsError } from '@/lib/gms-client'
import type { ScanFlow } from '@/lib/use-scan-flow'

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
  const [showRaw, setShowRaw] = useState(false)
  const [qtyBySku, setQtyBySku] = useState<Record<string, number>>({})
  const { phase, result, error, sessionId, addedSkus, handleAddToBag, logEvent, retry } = flow

  const qtyFor = (sku: string) => qtyBySku[sku] ?? 1
  const adjustQty = (sku: string, delta: number) =>
    setQtyBySku((prev) => ({ ...prev, [sku]: Math.max(1, qtyFor(sku) + delta) }))

  if (phase === 'scanning') {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <div className="space-y-1">
            <h2 className="font-serif text-2xl">Calling the GetMyShade API</h2>
            <p className="text-sm text-muted-foreground">
              POST /api-v1-match · typical latency ~1.8s
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
                <Badge variant="success">
                  {Math.round(analysis.confidence_score * 100)}% confidence
                </Badge>
              </div>
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
              <p className="font-mono text-xs text-muted-foreground">
                session {result.meta.session_id ?? sessionId} · {result.meta.processing_time_ms}ms ·
                api {result.meta.api_version}
              </p>
              <button
                type="button"
                onClick={() => setShowRaw((s) => !s)}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                {showRaw ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                {showRaw ? 'Hide' : 'View'} raw response
              </button>
              {showRaw && (
                <pre className="max-h-64 overflow-auto rounded-lg border bg-muted/50 p-3 text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl">Ranked shade matches</h3>
            <Button variant="outline" size="sm" onClick={onFullReset}>
              <RefreshCw className="size-4" /> Scan again
            </Button>
          </div>

          {result.meta.no_match_product_types && result.meta.no_match_product_types.length > 0 && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p>
                No match found for{' '}
                {result.meta.no_match_product_types
                  .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
                  .join(', ')}
                . None of the shades we have for{' '}
                {result.meta.no_match_product_types.length > 1 ? 'these categories' : 'this category'}{' '}
                are close enough to your scanned tone yet.
              </p>
            </div>
          )}

          {matches.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                <Sparkles className="size-6 text-muted-foreground" />
                <p className="max-w-sm text-sm text-muted-foreground">
                  Your GetMyShade catalog is empty, so there's nothing to rank yet. Seed it from{' '}
                  <Link href="/settings" className="text-primary hover:underline">
                    Settings → Developer
                  </Link>
                  , then scan again.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((m, i) => {
                const local = getProductByShadeSku(m.sku)
                const added = addedSkus.has(m.sku)
                const qty = qtyFor(m.sku)
                return (
                  <Card key={`${m.sku}-${i}`} className="gap-3 p-4">
                    <div className="-mx-4 -mt-4 aspect-square overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.image_url || local?.product.image || '/placeholder.svg'}
                        alt={local?.product.name ?? m.product_name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="size-10 shrink-0 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: m.hex_value }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{m.shade_name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {m.product_name} · {m.sku}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">score {m.match_score.toFixed(1)}</Badge>
                      <span>ΔE {m.delta_e.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      {local && (
                        <span className="text-sm font-serif">{formatPrice(local.product.price)}</span>
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
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-full border">
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
                      <Button size="sm" disabled={added} onClick={() => handleAddToBag(m, qty)}>
                        <ShoppingBag className="size-3.5" />
                        {added ? 'Added' : 'Add to Cart'}
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
