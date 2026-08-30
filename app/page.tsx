'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Camera,
  Sparkles,
  ArrowRight,
  Star,
  ShieldCheck,
  Wand2,
  Eye,
  ShoppingBag,
} from 'lucide-react'
import { MarketingNav } from '@/components/marketing-nav'
import { MarketingFooter } from '@/components/marketing-footer'
import { Button, ButtonLink } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { products, formatPrice, Category, type Product } from '@/lib/data'
import { ProductModal } from '@/components/product-modal'

export default function LandingPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const collectionsData: {
    category: Category
    title: string
    subtitle: string
    description: string
    badgeText: string
    image: string
    productId: string
  }[] = [
    {
      category: 'Foundation',
      title: 'Silk Veil Serum Foundation',
      subtitle: 'True-Match Complexion Base',
      description:
        'A weightless, skin-perfecting serum foundation with buildable medium coverage and a natural satin finish. Formulated for all-day comfort.',
      badgeText: '48 Inclusive Shades',
      image: '/images/product-foundation.png',
      productId: 'lumiere-silk-foundation',
    },
    {
      category: 'Concealer',
      title: 'Luminous Lift Concealer',
      subtitle: 'Targeted Brightening & Coverage',
      description:
        'Crease-proof, hydrating concealer designed to brighten dark circles and erase blemishes with seamless skin-like coverage.',
      badgeText: '48 Brightening Shades',
      image: '/images/product-concealer.png',
      productId: 'lumiere-radiant-concealer',
    },
    {
      category: 'Contour',
      title: 'Soft Sculpt Cream Contour',
      subtitle: 'Dimensional Shadowing & Definition',
      description:
        'A blendable cream contour stick that mimics natural facial shadows for believable structure and soft cheekbone definition.',
      badgeText: '20 Sculpting Shades',
      image: '/images/product-contour.png',
      productId: 'lumiere-sculpt-contour',
    },
    {
      category: 'Highlighter',
      title: 'Liquid Aura Highlighter',
      subtitle: 'Luminous Lit-From-Within Radiance',
      description:
        'A silky champagne-gold liquid highlighter that melts effortlessly into skin for a buildable, glass-skin glow.',
      badgeText: '8 Luminous Shades',
      image: '/images/product-highlighter.png',
      productId: 'lumiere-glow-highlighter',
    },
  ]

  function openProductDetails(product: Product) {
    setSelectedProduct(product)
    setModalOpen(true)
  }

  return (
    <div className="flex min-h-svh flex-col bg-background selection:bg-primary/20">
      <MarketingNav />

      <main className="flex-1">
        {/*-Inspired Luxury Hero */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-card via-background to-secondary/30">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
            <div className="flex flex-col items-start gap-6">
              <Badge variant="accent" className="gap-1.5 px-3.5 py-1 text-xs uppercase tracking-wider">
                <Sparkles className="size-3.5" /> Lumiere Precision Shade Matching
              </Badge>
              <h1 className="text-balance font-serif text-5xl leading-[1.04] tracking-tight md:text-6xl lg:text-7xl">
                Beauty for all. <br />
                Shades for <em className="italic text-primary">every</em> skin.
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Lumière crafts luxury complexion formulas across foundations, concealers, contour, and highlighters. Lumière Precision Shade matching aligns your skin tone seamlessly in seconds.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <ButtonLink href="/match" size="lg" className="h-12 px-7 text-base shadow-lg shadow-primary/20">
                  <Sparkles className="size-4" /> Find Your Shade
                </ButtonLink>
                <ButtonLink href="/collections" variant="outline" size="lg" className="h-12 px-6 text-base">
                  Explore Collections
                </ButtonLink>
              </div>

              <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <Star className="size-4 fill-amber-400 text-amber-400" /> 4.9 Rating · 12,000+ Verified Matches
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="size-4 text-primary" /> 100% Inclusive Spectrum
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border bg-card shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-editorial.png"
                  alt="Model with radiant complexion"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-white/20 bg-background/80 p-4 backdrop-blur-md">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-primary">Matched Shade</p>
                    <p className="font-serif text-lg font-bold">Tan Neutral 340 · 96% Match</p>
                  </div>
                  <ButtonLink href="/match" size="sm" variant="default" className="gap-1">
                    Match Me <ArrowRight className="size-3.5" />
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fenty Collections Showcase (Foundations, Concealers, Contour, Highlighters) */}
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="mb-14 text-center">
            <Badge variant="accent" className="mb-3 px-3 py-1 text-xs uppercase tracking-wider">
              Product Collections
            </Badge>
            <h2 className="font-serif text-4xl tracking-tight md:text-5xl">
              Shop by Complexion Collection
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Every collection is engineered with precision depth stops and undertones. Find your exact match across all 4 core complexion lines.
            </p>
          </div>

          <div className="space-y-16">
            {collectionsData.map((col, idx) => {
              const product = products.find((p) => p.id === col.productId)
              const shades = product?.shades ?? []
              const totalShades = shades.length

              return (
                <Card
                  key={col.category}
                  className="group overflow-hidden border-2 transition-all hover:border-primary/40 shadow-sm hover:shadow-xl"
                >
                  <div className="grid gap-0 lg:grid-cols-12">
                    {/* Left Editorial Image */}
                    <div className="relative lg:col-span-5 bg-muted min-h-[320px] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={col.image}
                        alt={col.title}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-background/90 text-foreground backdrop-blur-md border font-semibold px-3 py-1 text-xs">
                          {totalShades} Total Shades
                        </Badge>
                      </div>
                    </div>

                    {/* Right Content & Swatch Palette */}
                    <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7 space-y-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs uppercase tracking-widest font-semibold text-primary">
                            Collection 0{idx + 1} · {col.category}
                          </span>
                          <span className="font-serif text-2xl font-bold">{formatPrice(product?.price ?? 48)}</span>
                        </div>

                        <h3 className="font-serif text-3xl tracking-tight">{col.title}</h3>
                        <p className="text-sm font-medium text-muted-foreground">{col.subtitle}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{col.description}</p>
                      </div>

                      {/* Swatch Spectrum Showcase */}
                      <div className="space-y-2 rounded-xl border bg-secondary/30 p-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">Available Shade Spectrum</span>
                          <span className="font-mono text-muted-foreground font-semibold">{totalShades} Swatches</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {shades.slice(0, 14).map((s) => (
                            <span
                              key={s.name}
                              className="size-6 rounded-full border shadow-xs transition-transform hover:scale-125"
                              style={{ backgroundColor: s.hex }}
                              title={`${s.name} (${s.undertone})`}
                            />
                          ))}
                          {shades.length > 14 && (
                            <span className="inline-flex size-6 items-center justify-center rounded-full border bg-background text-[10px] font-semibold text-muted-foreground">
                              +{shades.length - 14}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Collection Actions: View Product Modal + Direct Match CTA */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                        <ButtonLink
                          href="/match"
                          variant="default"
                          size="lg"
                          className="flex-1 gap-2 shadow-sm font-medium"
                        >
                          <Sparkles className="size-4" /> Find Your {col.category} Shade
                        </ButtonLink>
                        {product && (
                          <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="shrink-0 gap-1.5 font-medium"
                            onClick={() => openProductDetails(product)}
                          >
                            <Eye className="size-4" /> View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Final Conversion Banner */}
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground md:px-16">
            <h2 className="mx-auto max-w-3xl font-serif text-4xl tracking-tight md:text-5xl">
              Ready to find your perfect Lumière shade?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
              No registration or account required. Experience precision shade matching across foundations, concealers, contour, and highlighters.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ButtonLink
                href="/match"
                variant="secondary"
                size="lg"
                className="h-12 px-7 text-base font-semibold"
              >
                <Sparkles className="size-4" /> Start Scan Now
              </ButtonLink>
              <ButtonLink
                href="/collections"
                variant="secondary"
                size="lg"
                className="h-12 px-6 text-base font-semibold bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-100 shadow-md"
              >
                Browse Collections
              </ButtonLink>
            </div>
          </div>
        </section>

      </main>

      <MarketingFooter />

      {/* Interactive Product Details Popup Modal */}
      <ProductModal
        product={selectedProduct}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
