'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, Star, Sparkles, Minus, Plus, ShoppingBag, Check } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/product-card'
import { useStore } from '@/components/store-provider'
import { formatPrice, type Product } from '@/lib/data'
import { cn } from '@/lib/utils'

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore()
  const [selectedShade, setSelectedShade] = useState(product.shades[0]?.name ?? 'Default')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const wished = isWishlisted(product.id)

  function handleAddToBag() {
    addToCart(product.id, selectedShade, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <>
      <ButtonLink href="/catalog" variant="ghost" size="sm" className="mb-6">
        <ArrowLeft className="size-4" /> Back to catalog
      </ButtonLink>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            className="size-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.category}
            </p>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {product.rating} · {product.reviews.toLocaleString()} reviews
            </span>
          </div>

          <h1 className="text-balance font-serif text-3xl tracking-tight md:text-4xl">
            {product.name}
          </h1>

          {product.matched && product.matchReason && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-primary">
                <Sparkles className="size-3.5" /> Why it matches you
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{product.matchReason}</p>
            </div>
          )}

          <p className="font-serif text-2xl">{formatPrice(product.price)}</p>

          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          {product.shades.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Shade: <span className="text-muted-foreground">{selectedShade}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {product.shades.map((s) => {
                  const active = s.name === selectedShade
                  return (
                    <button
                      key={s.name}
                      type="button"
                      title={s.name}
                      onClick={() => setSelectedShade(s.name)}
                      className={cn(
                        'relative size-9 rounded-full ring-1 ring-black/10 transition-all',
                        active && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                      )}
                      style={{ backgroundColor: s.hex }}
                    >
                      {active && (
                        <Check className="absolute inset-0 m-auto size-4 text-white drop-shadow" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/[0.03] p-3.5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-primary">Not sure which shade is right for you?</p>
                  <p className="text-xs text-muted-foreground">Scan your skin to receive precision matches</p>
                </div>
                <ButtonLink href="/match" variant="default" size="sm" className="gap-1.5 shrink-0">
                  <Sparkles className="size-3.5" /> Find Your Shade
                </ButtonLink>
              </div>
            </div>
          )}

          {(product.finish || product.coverage) && (
            <div className="grid grid-cols-2 gap-3">
              {product.finish && (
                <div className="rounded-lg border bg-secondary/40 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Finish</p>
                  <p className="mt-0.5 font-medium">{product.finish}</p>
                </div>
              )}
              {product.coverage && (
                <div className="rounded-lg border bg-secondary/40 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Coverage</p>
                  <p className="mt-0.5 font-medium">{product.coverage}</p>
                </div>
              )}
            </div>
          )}

          {product.bestFor.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.bestFor.map((b) => (
                <Badge key={b} variant="outline">
                  {b}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center rounded-lg border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <Button size="lg" className="flex-1" onClick={handleAddToBag}>
              {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
              {added ? 'Added to Bag' : 'Add to Bag'}
            </Button>
            <Button
              size="icon-lg"
              variant="outline"
              onClick={() => toggleWishlist(product.id)}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('size-5', wished && 'fill-primary text-primary')} />
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 font-serif text-2xl tracking-tight">You may also like</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
