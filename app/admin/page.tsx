'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Layers,
  BarChart3,
  BrainCircuit,
  ShoppingBag,
  MessageSquare,
  Key,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  ExternalLink,
  Shield,
  Code2,
  Database,
  Lock,
  LogOut,
  ArrowLeft,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { IntegrationGuideContent } from '@/components/integration-guide-content'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button, ButtonLink } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { GmsDeveloperPanel } from '@/components/gms-developer-panel'
import { products, formatPrice } from '@/lib/data'
import { BrandLogo } from '@/components/brand-logo'
import {
  AdminAuthModal,
  isAlreadyAuthenticated,
  setAuthenticated,
} from '@/components/admin-auth-modal'

export default function AdminPage() {
  const [authenticated, setAuthenticatedState] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (isAlreadyAuthenticated()) {
      setAuthenticatedState(true)
    } else {
      setAuthModalOpen(true)
    }
  }, [])

  function handleLogout() {
    setAuthenticated(false)
    setAuthenticatedState(false)
    setAuthModalOpen(true)
  }

  const totalShadesCount = products.reduce((acc, p) => acc + p.shades.length, 0)

  return (
    <div className="min-h-svh bg-background flex flex-col selection:bg-primary/20">
      {/* Dedicated Standalone Admin Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur-md px-4 py-3.5 md:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo />
              <span className="font-serif text-xl tracking-tight font-bold">Lumière</span>
            </Link>
            <span className="text-muted-foreground/40">|</span>
            <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary bg-primary/5 font-semibold text-xs py-1">
              <Shield className="size-3.5" /> Brand Admin Portal
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <ButtonLink href="/" variant="ghost" size="sm" className="gap-1.5 text-xs font-medium">
              <ArrowLeft className="size-3.5" /> Storefront
            </ButtonLink>
            {authenticated && (
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 border-destructive/30" onClick={handleLogout}>
                <LogOut className="size-3.5" /> Lock Session
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
        {!authenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] py-12 text-center space-y-6">
            <div className="grid size-20 place-items-center rounded-3xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
              <Lock className="size-10" />
            </div>
            <div className="space-y-2 max-w-md">
              <Badge variant="accent" className="px-3 py-1 text-xs uppercase tracking-wider">
                Protected Route
              </Badge>
              <h1 className="font-serif text-3xl font-bold tracking-tight">
                Brand Admin Access Locked
              </h1>
              <p className="text-sm text-muted-foreground">
                Authorization PIN is required to view match analytics, API keys, developer documentation, and catalog tools.
              </p>
            </div>
            <Button
              size="lg"
              className="gap-2 px-8 font-semibold shadow-lg"
              onClick={() => setAuthModalOpen(true)}
            >
              <Lock className="size-4" /> Input PIN Password
            </Button>
          </div>
        ) : (
          <div className="space-y-8 pb-12">
            <PageHeader
              eyebrow="Lumière × GetMyShade Infrastructure"
              title="Brand Admin Terminal"
              description="Monitor shade-matching performance, recommendation ranks, commerce outcomes, and developer API integration."
            >
              <div className="flex items-center gap-3">
                <ButtonLink href="/match" variant="default" size="sm" className="gap-1.5 font-medium shadow-sm">
                  <ExternalLink className="size-4" /> Open Storefront Scanner
                </ButtonLink>
              </div>
            </PageHeader>

            {/* Admin KPI Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-5 space-y-2 border-l-4 border-l-primary">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-medium tracking-wider text-muted-foreground">Match Scans</span>
                  <Sparkles className="size-4 text-primary" />
                </div>
                <p className="font-serif text-3xl font-bold">1,428</p>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <TrendingUp className="size-3" /> +18.4% from last week
                </p>
              </Card>

              <Card className="p-5 space-y-2 border-l-4 border-l-emerald-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-medium tracking-wider text-muted-foreground">Match Conversion</span>
                  <ShoppingBag className="size-4 text-emerald-500" />
                </div>
                <p className="font-serif text-3xl font-bold">34.2%</p>
                <p className="text-xs text-muted-foreground">Scan-to-Cart add rate</p>
              </Card>

              <Card className="p-5 space-y-2 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-medium tracking-wider text-muted-foreground">Active Products</span>
                  <Layers className="size-4 text-amber-500" />
                </div>
                <p className="font-serif text-3xl font-bold">{products.length}</p>
                <p className="text-xs text-muted-foreground">{totalShadesCount} Total Complexion Shades</p>
              </Card>

              <Card className="p-5 space-y-2 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-medium tracking-wider text-muted-foreground">API Health</span>
                  <Database className="size-4 text-blue-500" />
                </div>
                <p className="font-serif text-3xl font-bold">100%</p>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> GMS-BASELINE-1.0 Online
                </p>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="w-full justify-start overflow-x-auto bg-muted/60 p-1">
                <TabsTrigger value="overview" className="gap-2">
                  <BarChart3 className="size-4" /> Overview & Funnel
                </TabsTrigger>
                <TabsTrigger value="ranks" className="gap-2">
                  <SlidersHorizontal className="size-4" /> Recommendation Ranks
                </TabsTrigger>
                <TabsTrigger value="intelligence" className="gap-2">
                  <BrainCircuit className="size-4" /> Match Intelligence
                </TabsTrigger>
                <TabsTrigger value="catalog" className="gap-2">
                  <Layers className="size-4" /> Shade Catalog ({totalShadesCount})
                </TabsTrigger>
                <TabsTrigger value="feedback" className="gap-2">
                  <MessageSquare className="size-4" /> Shopper Feedback
                </TabsTrigger>
                <TabsTrigger value="developer" className="gap-2">
                  <Code2 className="size-4" /> Developer & API Tools
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Overview & Conversion Funnel */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shade Discovery Conversion Funnel</CardTitle>
                      <CardDescription>
                        Tracking shopper progression from initial skin scan to final commerce checkout.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {[
                        { stage: '1. Scan Launched', count: 1428, pct: 100, color: 'bg-primary' },
                        { stage: '2. Multi-Match Served', count: 1395, pct: 97.6, color: 'bg-primary/80' },
                        { stage: '3. Recommendation Clicked', count: 980, pct: 68.6, color: 'bg-amber-500' },
                        { stage: '4. Added to Cart (Match)', count: 488, pct: 34.2, color: 'bg-emerald-500' },
                        { stage: '5. Purchase Completed', count: 342, pct: 23.9, color: 'bg-emerald-600' },
                      ].map((item) => (
                        <div key={item.stage} className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{item.stage}</span>
                            <span className="text-muted-foreground font-mono">
                              {item.count} ({item.pct}%)
                            </span>
                          </div>
                          <Progress value={item.pct} className="h-2.5" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Category Match Breakdown</CardTitle>
                      <CardDescription>Distribution of match recommendations across core complexion collections.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { cat: 'Foundations', share: 45, count: '642 scans' },
                        { cat: 'Concealers', share: 30, count: '428 scans' },
                        { cat: 'Contour', share: 15, count: '214 scans' },
                        { cat: 'Highlighters', share: 10, count: '144 scans' },
                      ].map((c) => (
                        <div key={c.cat} className="flex items-center justify-between border-b pb-3 text-sm last:border-none">
                          <div>
                            <p className="font-medium">{c.cat}</p>
                            <p className="text-xs text-muted-foreground">{c.count}</p>
                          </div>
                          <Badge variant="secondary" className="font-mono">{c.share}%</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab 2: Recommendation Ranks */}
              <TabsContent value="ranks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Match Confidence Ranking Algorithm</CardTitle>
                    <CardDescription>
                      How GetMyShade ranks multi-match options (1st match, 2nd match, 3rd match) based on ΔE color space tolerance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { rank: 'Rank #1 (Best Match)', matchPct: '94% – 99%', desc: 'Exact undertone & skin depth alignment. Primary recommendation.', badge: 'Top Match' },
                      { rank: 'Rank #2 (Close Alternative)', matchPct: '88% – 93%', desc: 'Slight tone shift for preferred finish or coverage preference.', badge: 'Alternative' },
                      { rank: 'Rank #3 (Seasonal Tone)', matchPct: '80% – 87%', desc: 'Ideal for summer tan or winter pale variations.', badge: 'Seasonal' },
                    ].map((r) => (
                      <div key={r.rank} className="flex items-center justify-between rounded-xl border p-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-sm flex items-center gap-2">
                            {r.rank} <Badge variant="outline">{r.badge}</Badge>
                          </p>
                          <p className="text-xs text-muted-foreground">{r.desc}</p>
                        </div>
                        <span className="font-mono text-sm font-bold text-primary">{r.matchPct}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 3: Match Intelligence */}
              <TabsContent value="intelligence" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skin Tone Depth Distribution</CardTitle>
                    <CardDescription>Aggregated demographic depth clusters captured via GetMyShade camera engine.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { depth: 'Deep', share: '28%', hex: '#3b2219' },
                      { depth: 'Tan', share: '32%', hex: '#8d5524' },
                      { depth: 'Medium', share: '25%', hex: '#c68642' },
                      { depth: 'Fair / Light', share: '15%', hex: '#ffdbac' },
                    ].map((d) => (
                      <div key={d.depth} className="rounded-xl border p-4 space-y-2 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase text-muted-foreground">{d.depth}</span>
                          <span className="size-5 rounded-full border shadow-xs" style={{ backgroundColor: d.hex }} />
                        </div>
                        <p className="font-serif text-2xl font-bold">{d.share}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 4: Shade Catalog */}
              <TabsContent value="catalog" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lumière Core Complexion Offerings ({products.length} Products)</CardTitle>
                    <CardDescription>Restricted to 4 core complexion collections: Foundation, Concealer, Contour, Highlighter.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {products.map((p) => (
                      <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border p-4 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="size-12 rounded-lg bg-muted overflow-hidden shrink-0 border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image} alt={p.name} className="size-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.category} · {p.shades.length} shades</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm">{formatPrice(p.price)}</span>
                          <Badge variant="outline">{p.shades.length} Swatches Active</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 5: Shopper Feedback */}
              <TabsContent value="feedback" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Shade Accuracy Reviews</CardTitle>
                    <CardDescription>Direct feedback from verified shoppers using GetMyShade matching engine.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: 'Maya T.', shade: 'Tan Neutral 340', rating: 5, comment: 'Exact match! I usually struggle to find undertones that aren’t too red, but GetMyShade nailed it.', date: '2 hours ago' },
                      { name: 'Elena R.', shade: 'Medium Warm 220', rating: 5, comment: 'Matched me seamlessly to both the serum foundation and lift concealer. Love this feature!', date: '5 hours ago' },
                      { name: 'Jordan P.', shade: 'Deep Cool 480', rating: 5, comment: 'Super quick camera scan. The recommended contour stick shade gives natural shadow.', date: 'Yesterday' },
                    ].map((f) => (
                      <div key={f.name} className="rounded-xl border p-4 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-sm">{f.name} ({f.shade})</span>
                          <span className="text-xs text-muted-foreground">{f.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">"{f.comment}"</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 6: Developer & API Tools */}
              <TabsContent value="developer" className="space-y-6">
                <div className="rounded-xl border bg-primary/5 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code2 className="size-5 text-primary" />
                    <div>
                      <h3 className="font-medium text-sm">Developer & API Dashboard</h3>
                      <p className="text-xs text-muted-foreground">Manage GMS_API_KEY, catalog seeding, test upstream endpoints, and view integration documentation.</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-primary/40 text-primary">Server-Side Proxy Active</Badge>
                </div>

                <GmsDeveloperPanel />

                <IntegrationGuideContent />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        open={authModalOpen}
        onSuccess={() => {
          setAuthenticatedState(true)
          setAuthModalOpen(false)
        }}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  )
}
