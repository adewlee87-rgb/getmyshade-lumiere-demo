import Link from 'next/link'
import {
  Camera,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Star,
  ShieldCheck,
  Wand2,
} from 'lucide-react'
import { MarketingNav } from '@/components/marketing-nav'
import { MarketingFooter } from '@/components/marketing-footer'
import { ButtonLink } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { categories, products, formatPrice } from '@/lib/data'

const steps = [
  {
    icon: Camera,
    title: 'Upload a selfie',
    desc: 'Take or upload a photo in natural light. No filters needed.',
  },
  {
    icon: Wand2,
    title: 'AI analyzes your skin',
    desc: 'Our external Beauty Analysis API reads tone, undertone, type, and face shape.',
  },
  {
    icon: Sparkles,
    title: 'Get your matches',
    desc: 'Receive a personalized beauty profile with matched products and shades.',
  },
  {
    icon: ShoppingBag,
    title: 'Shop with confidence',
    desc: 'Build your look, understand every recommendation, and check out seamlessly.',
  },
]

export default function LandingPage() {
  const featured = products.filter((p) => p.tags?.includes('Bestseller')).slice(0, 4)

  return (
    <div className="flex min-h-svh flex-col">
      <MarketingNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
            <div className="flex flex-col items-start gap-6">
              <Badge variant="accent" className="gap-1.5 px-3 py-1">
                <Sparkles className="size-3.5" /> AI-Powered Beauty Matching
              </Badge>
              <h1 className="text-balance font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
                Beauty matched to <em className="italic text-primary">your</em> skin, precisely.
              </h1>
              <p className="max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
                Lumière analyzes your complexion and curates foundations, shades, and
                finishing products chosen for your unique tone, undertone, and skin type.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <ButtonLink href="/signup" size="lg" className="h-11 px-5 text-base">
                  Get your free match <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink href="/catalog" variant="outline" size="lg" className="h-11 px-5 text-base">
                  Browse products
                </ButtonLink>
              </div>
              <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-amber-400 text-amber-400" /> 4.9 from 12k reviews
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-primary" /> 94% match accuracy
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl border shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-editorial.png"
                  alt="Model with radiant, matched complexion"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <Card className="absolute -bottom-6 -left-2 w-56 gap-1 p-4 shadow-lg md:-left-8">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Your Match
                </p>
                <p className="font-serif text-lg">Light Medium 9W · Warm</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[94%] rounded-full bg-primary" />
                  </div>
                  <span className="text-xs font-medium">94%</span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Find My Shade CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-8 md:pb-20">
          <Link
            href="/match"
            className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl border bg-card px-6 py-12 text-center transition-colors hover:border-primary/40 md:px-16 md:py-16"
          >
            <Badge variant="accent" className="gap-1.5 px-3 py-1">
              <Sparkles className="size-3.5" /> Find My Shade — Powered by GetMyShade
            </Badge>
            <h2 className="text-balance font-serif text-3xl tracking-tight md:text-4xl">
              Scan your skin, find your shade
            </h2>
            <p className="max-w-md text-pretty text-muted-foreground">
              Jump straight into a live scan or upload a selfie for an instant AI-powered
              shade match.
            </p>
            <span className="mt-2 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-base font-medium text-primary-foreground transition-transform group-hover:translate-x-0.5">
              Start matching <ArrowRight className="size-4" />
            </span>
          </Link>
        </section>

        {/* How it works */}
        <section id="how" className="border-y bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                The Lumière Method
              </p>
              <h2 className="mt-2 text-balance font-serif text-4xl tracking-tight">
                Your beauty match in four steps
              </h2>
              <p className="mt-3 text-muted-foreground">
                The analysis is only the beginning. Lumière helps you discover, understand, and
                shop with total confidence.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => {
                const Icon = s.icon
                return (
                  <Card key={s.title} className="gap-3 p-6">
                    <div className="flex items-center justify-between">
                      <span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <span className="font-serif text-3xl text-muted-foreground/40">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-2 font-medium">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-4xl tracking-tight">Shop by category</h2>
              <p className="mt-2 text-muted-foreground">Everything for a flawless complexion.</p>
            </div>
            <ButtonLink href="/catalog" variant="ghost">
              View all <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/catalog?category=${encodeURIComponent(c.name)}`}
                className="group flex flex-col gap-1 rounded-xl border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <span className="font-medium">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.blurb}</span>
                <ArrowRight className="mt-3 size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="border-t bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
            <h2 className="font-serif text-4xl tracking-tight">Loved by our community</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image || '/placeholder.svg'}
                      alt={p.name}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {p.category}
                    </p>
                    <p className="font-medium leading-snug">{p.name}</p>
                    <p className="mt-1 font-serif text-lg">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-20 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground md:px-16">
            <h2 className="mx-auto max-w-2xl text-balance font-serif text-4xl tracking-tight md:text-5xl">
              Find your perfect match today
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-primary-foreground/80">
              Join thousands who shop smarter with beauty personalized to their skin. Free to
              start, no commitment.
            </p>
            <ButtonLink
              href="/signup"
              variant="secondary"
              size="lg"
              className="mt-8 h-11 px-6 text-base"
            >
              Create your beauty profile <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
