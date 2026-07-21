import Link from 'next/link'
import {
  Wand2,
  ArrowRight,
  Sparkles,
  Package,
  Heart,
  TrendingUp,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { BeautyProfileCard } from '@/components/beauty-profile-card'
import { ProductCard } from '@/components/product-card'
import { Card } from '@/components/ui/card'
import { ButtonLink } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { recommendedProducts, orders, collections, formatPrice } from '@/lib/data'

const stats = [
  { label: 'Matched products', value: '8', icon: Sparkles },
  { label: 'Wishlist items', value: '2', icon: Heart },
  { label: 'Orders placed', value: '2', icon: Package },
  { label: 'Match accuracy', value: '94%', icon: TrendingUp },
]

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Welcome back, Sofia"
        title="Your beauty dashboard"
        description="Your personalized matches, saved looks, and orders — all in one place."
      >
        <ButtonLink href="/match">
          <Wand2 className="size-4" /> Re-run analysis
        </ButtonLink>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="gap-2 p-5">
              <div className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-full bg-accent/60 text-accent-foreground">
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-1 font-serif text-3xl">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </Card>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <BeautyProfileCard />

        {/* Continue your look */}
        <Card className="gap-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Complete your look</h3>
            <ButtonLink href="/recommendations" variant="ghost" size="sm">
              See all <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <div className="flex flex-col divide-y">
            {recommendedProducts.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image || '/placeholder.svg'} alt={p.name} className="size-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                </div>
                <Badge className="gap-1">
                  <Sparkles className="size-3" /> Matched
                </Badge>
                <span className="font-serif text-lg">{formatPrice(p.price)}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommended for you */}
      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl tracking-tight">Recommended for you</h2>
            <p className="text-sm text-muted-foreground">
              Chosen for your warm undertone and combination skin.
            </p>
          </div>
          <ButtonLink href="/recommendations" variant="ghost">
            View all <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recommendedProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Recent order + collections */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="gap-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Recent order</h3>
            <ButtonLink href="/orders" variant="ghost" size="sm">
              All orders <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-secondary/40 p-4">
            <div>
              <p className="text-sm font-medium">#{orders[0].id}</p>
              <p className="text-xs text-muted-foreground">
                {orders[0].date} · {orders[0].items.length} items
              </p>
            </div>
            <div className="text-right">
              <Badge variant="success">{orders[0].status}</Badge>
              <p className="mt-1 font-serif text-lg">{formatPrice(orders[0].total)}</p>
            </div>
          </div>
        </Card>

        <Card className="gap-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Curated collections</h3>
            <ButtonLink href="/collections" variant="ghost" size="sm">
              Explore <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <div className="flex flex-col gap-3">
            {collections.slice(0, 2).map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.id}`}
                className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-accent/40"
              >
                <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image || '/placeholder.svg'} alt={c.title} className="size-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </>
  )
}
