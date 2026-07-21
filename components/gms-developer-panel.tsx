'use client'

import { useEffect, useState } from 'react'
import { Loader2, RefreshCw, CheckCircle2, AlertTriangle, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toGmsCatalogPayload } from '@/lib/data'
import {
  gms,
  GmsError,
  type BrandResponse,
  type UsageResponse,
} from '@/lib/gms-client'

export function GmsDeveloperPanel() {
  const [brand, setBrand] = useState<BrandResponse | null>(null)
  const [usage, setUsage] = useState<UsageResponse | null>(null)
  const [bootError, setBootError] = useState<GmsError | Error | null>(null)
  const [bootLoading, setBootLoading] = useState(true)

  const [seedState, setSeedState] = useState<'idle' | 'seeding' | 'done' | 'error'>('idle')
  const [seedResults, setSeedResults] = useState<{ product_name: string; variants_count: number }[]>(
    [],
  )
  const [seedError, setSeedError] = useState<GmsError | Error | null>(null)

  function loadBoot() {
    setBootLoading(true)
    setBootError(null)
    gms
      .brand()
      .then((b) => setBrand(b))
      .catch((e) => setBootError(e instanceof GmsError ? e : new Error(String(e))))
      .finally(() => setBootLoading(false))
    gms.usage().then(setUsage).catch(() => {})
  }

  useEffect(() => {
    loadBoot()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function seedCatalog() {
    setSeedState('seeding')
    setSeedError(null)
    try {
      const payload = toGmsCatalogPayload()
      const res = await gms.bulkCreate(payload)
      setSeedResults(res.results)
      setSeedState('done')
      loadBoot()
    } catch (e) {
      setSeedError(e instanceof GmsError ? e : new Error(String(e)))
      setSeedState('error')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integration status</CardTitle>
          <CardDescription>
            GET /api-v1-brand — confirms the API key is valid and the brand is active.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bootLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Checking key…
            </div>
          ) : bootError ? (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Not connected</p>
                  <Badge variant="outline" className="border-destructive/40 text-destructive">
                    {bootError instanceof GmsError ? bootError.code : 'ERROR'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {bootError instanceof GmsError ? bootError.friendlyMessage : bootError.message}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Add your key to <code className="font-mono">.env.local</code> as{' '}
                  <code className="font-mono">GMS_API_KEY</code>, then restart the dev server.
                </p>
              </div>
            </div>
          ) : brand ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border bg-secondary/40 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Brand</p>
                <p className="mt-0.5 flex items-center gap-2 font-medium">
                  {brand.brand.name}
                  <Badge variant="success">{brand.brand.status}</Badge>
                </p>
              </div>
              <div className="rounded-lg border bg-secondary/40 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Plan</p>
                <p className="mt-0.5 font-medium capitalize">
                  {brand.subscription.plan_tier} · {brand.subscription.status}
                </p>
              </div>
              <div className="rounded-lg border bg-secondary/40 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Catalog</p>
                <p className="mt-0.5 font-medium">
                  {brand.catalog.total_products} products · {brand.catalog.total_variants} variants
                </p>
              </div>
              <div className="rounded-lg border bg-secondary/40 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Included scans
                </p>
                <p className="mt-0.5 font-medium">{brand.subscription.included_scans} / period</p>
              </div>
            </div>
          ) : null}
          <Button variant="outline" size="sm" onClick={loadBoot} disabled={bootLoading}>
            <RefreshCw className="size-3.5" /> Refresh
          </Button>
        </CardContent>
      </Card>

      {usage && (
        <Card>
          <CardHeader>
            <CardTitle>Usage this period</CardTitle>
            <CardDescription>
              GET /api-v1-usage · {new Date(usage.billing_period.start).toLocaleDateString()} –{' '}
              {new Date(usage.billing_period.end).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress
              value={(usage.usage.used_scans / Math.max(1, usage.usage.included_scans)) * 100}
            />
            <p className="text-sm text-muted-foreground">
              {usage.usage.used_scans} / {usage.usage.included_scans} scans used ·{' '}
              {usage.usage.remaining_scans} remaining
              {usage.usage.overage_scans > 0 &&
                ` · ${usage.usage.overage_scans} overage @ $${usage.usage.overage_rate}`}
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(usage.breakdown).map(([k, v]) => (
                <Badge key={k} variant="outline">
                  {k}: {v}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Seed brand catalog</CardTitle>
          <CardDescription>
            POST /api-v1-products/bulk · pushes this storefront's products and shades into your
            GetMyShade catalog so /api-v1-match has something to rank.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={seedCatalog} disabled={seedState === 'seeding'}>
            {seedState === 'seeding' ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UploadCloud className="size-4" />
            )}
            Seed catalog from this storefront
          </Button>

          {seedState === 'done' && (
            <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm dark:border-emerald-900 dark:bg-emerald-950">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p>
                Created {seedResults.length} products (
                {seedResults.reduce((sum, r) => sum + r.variants_count, 0)} shades total).
              </p>
            </div>
          )}

          {seedState === 'error' && seedError && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-muted-foreground">
                {seedError instanceof GmsError ? seedError.friendlyMessage : seedError.message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
