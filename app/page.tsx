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
  ChevronLeft,
  ChevronRight,
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
        {/* Fenty-Inspired Luxury Hero Banner */}
        <section className="relative w-full bg-[#a6686d] text-neutral-950 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:py-20">
            <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              
              {/* Left Text Content */}
              <div className="flex flex-col items-start space-y-5 lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-900/90 bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
                  The Lumière Complexion Event
                </span>

                <h1 className="font-sans text-5xl font-black uppercase tracking-tight text-neutral-950 sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92]">
                  FLAWLESS MATCH. <br />
                  <span className="underline decoration-neutral-950/20 underline-offset-8">25% OFF SITEWIDE.</span>
                </h1>

                <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-900/90 leading-relaxed max-w-md">
                  Unveil your seamless skin tone match. Enjoy 25% off all luxury foundations, radiant concealers, contour, and highlighters—applied automatically at checkout.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <ButtonLink
                    href="/match"
                    className="bg-black text-white hover:bg-neutral-900 rounded-none px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-[1.02] shadow-lg"
                  >
                    SHOP NOW
                  </ButtonLink>

                  <ButtonLink
                    href="/collections"
                    variant="ghost"
                    className="text-neutral-900 underline underline-offset-4 decoration-2 px-4 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-black"
                  >
                    LEARN MORE
                  </ButtonLink>
                </div>
              </div>

              {/* Right Beauty Products Banner Image */}
              <div className="relative lg:col-span-7 flex justify-center items-center">
                <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero-banner-products.png"
                    alt="Lumière Luxury Complexion & Beauty Collection"
                    className="w-full h-auto object-cover object-center max-h-[520px] rounded-2xl"
                  />
                  {/* Subtle float badge overlay */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg border border-white/10 flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-amber-400" /> Find Your Shade Off Auto-Applied
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Save on Bestsellers Section (Inspired by Fenty Beauty Bestsellers Row) */}
        <section className="border-b bg-background px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-7xl">
            {/* Header row */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-sans text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
                  SAVE ON BESTSELLERS
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  Get &apos;em for 25% off while you can.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="size-9 rounded-full" aria-label="Previous">
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="outline" size="icon" className="size-9 rounded-full" aria-label="Next">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            {/* Bestseller Grid Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              <Card className="flex flex-col justify-between p-6 bg-secondary/50 border-2 border-dashed border-primary/30 hover:border-primary transition-all">
                <div className="space-y-3">
                  <Badge variant="accent" className="text-[10px] font-bold tracking-widest uppercase">
                    PROMO GIFT
                  </Badge>
                  <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-foreground leading-snug">
                    SHOP + UNLOCK FREE GIFTS
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Get a free 3-piece gift on $75+ orders or 5-piece gift on $125+ orders.
                  </p>
                </div>

                <ButtonLink
                  href="/collections"
                  variant="default"
                  size="sm"
                  className="mt-6 w-full rounded-none font-bold uppercase text-[11px] tracking-wider"
                >
                  LEARN MORE
                </ButtonLink>
              </Card>

              {products.slice(0, 4).map((product, idx) => {
                const discounts = ['30% OFF · NEW', '30% OFF · NEW', '25% OFF · BESTSELLER', '30% OFF · BESTSELLER']
                const shadeCounts = ['48 Shades', '48 Shades', '20 Shades', '8 Shades']

                return (
                  <Card
                    key={product.id}
                    className="group flex flex-col overflow-hidden border transition-all hover:shadow-lg"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-muted">
                      <span className="absolute top-2 left-2 z-10 bg-black text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-xs">
                        {discounts[idx]}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.title}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {shadeCounts[idx]}
                        </p>
                        <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {product.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t">
                        <span className="font-serif font-bold text-sm text-foreground">
                          {formatPrice(product.price * 0.75)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs font-semibold hover:bg-primary/10 hover:text-primary"
                          onClick={() => openProductDetails(product)}
                        >
                          Quick View
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
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

                      {/* Collection Actions: Shop & Add to Bag + Optional AI Match */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                        {product && (
                          <Button
                            type="button"
                            variant="default"
                            size="lg"
                            className="flex-1 gap-2 shadow-sm font-semibold"
                            onClick={() => openProductDetails(product)}
                          >
                            <ShoppingBag className="size-4" /> Shop & Select Shade
                          </Button>
                        )}
                        <ButtonLink
                          href="/match"
                          variant="outline"
                          size="lg"
                          className="shrink-0 gap-1.5 font-medium"
                        >
                          <Sparkles className="size-4 text-primary" /> Find Your Shade
                        </ButtonLink>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Final Shopping & AI Match Banner */}
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-16 text-center text-white md:px-16 shadow-2xl">
            <h2 className="mx-auto max-w-3xl font-serif text-4xl tracking-tight md:text-5xl">
              Shop Luxury Lumière Complexion Formulas
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-neutral-300">
              Browse our complete 48-shade spectrum directly and add to your bag, or try our optional precision AI shade matcher.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ButtonLink
                href="/collections"
                variant="secondary"
                size="lg"
                className="h-12 px-7 text-base font-semibold bg-white text-neutral-900 hover:bg-neutral-100 shadow-lg"
              >
                <ShoppingBag className="size-4" /> Shop All Collections
              </ButtonLink>
              <ButtonLink
                href="/match"
                size="lg"
                className="h-12 px-6 text-base font-semibold border border-white/40 bg-transparent text-white hover:bg-white/15 hover:text-white transition-colors gap-2"
              >
                <Sparkles className="size-4 text-amber-300" /> Find my shade
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
