'use client'

import React, { useState } from 'react'
import { X, Star, Sparkles, Minus, Plus, ShoppingBag, Check } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/components/store-provider'
import { formatPrice, type Product } from '@/lib/data'
import { cn } from '@/lib/utils'

export function ProductModal({
  product,
  open,
  onClose,
}: {
  product: Product | null
  open: boolean
  onClose: () => void
}) {
  const { addToCart } = useStore()
  const [selectedShade, setSelectedShade] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  React.useEffect(() => {
    if (product && product.shades.length > 0) {
      setSelectedShade(product.shades[0].name)
    }
  }, [product])

  if (!open || !product) return null

  function handleAddToBag() {
    if (!product) return
    addToCart(product.id, selectedShade || 'Default', qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-background border shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 z-10 grid size-9 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Image */}
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              className="size-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {product.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {product.rating} · {product.reviews.toLocaleString()} reviews
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl tracking-tight font-bold">
                {product.name}
              </h2>

              <p className="font-serif text-2xl font-bold text-foreground">
                {formatPrice(product.price)}
              </p>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Shades selector */}
            {product.shades.length > 0 && (
              <div className="space-y-2.5 rounded-xl border bg-secondary/30 p-4">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span>Selected Shade:</span>
                  <span className="font-semibold text-primary">{selectedShade || 'Default'}</span>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                  {product.shades.map((s) => {
                    const active = s.name === selectedShade
                    return (
                      <button
                        key={s.name}
                        type="button"
                        title={s.name}
                        onClick={() => setSelectedShade(s.name)}
                        className={cn(
                          'relative size-8 rounded-full ring-1 ring-black/10 transition-all hover:scale-110',
                          active && 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110',
                        )}
                        style={{ backgroundColor: s.hex }}
                      >
                        {active && (
                          <Check className="absolute inset-0 m-auto size-3.5 text-white drop-shadow" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border bg-background">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>

                <Button size="lg" className="flex-1 gap-2 h-11 text-sm font-semibold" onClick={handleAddToBag}>
                  {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
                  {added ? 'Added to Bag' : 'Add to Bag'}
                </Button>
              </div>

              <ButtonLink
                href="/match"
                variant="outline"
                size="sm"
                className="w-full gap-2 text-xs font-semibold py-2.5"
                onClick={onClose}
              >
                <Sparkles className="size-3.5 text-primary" /> Scan Skin to Find Your Exact Shade
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
