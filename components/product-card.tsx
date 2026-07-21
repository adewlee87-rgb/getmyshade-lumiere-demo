'use client'

import Link from 'next/link'
import { Heart, Star, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/components/store-provider'
import { formatPrice, type Product } from '@/lib/data'

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted, addToCart } = useStore()
  const wished = isWishlisted(product.id)

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/product/${product.id}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.matched && (
            <Badge className="gap-1">
              <Sparkles className="size-3" /> Matched
            </Badge>
          )}
          {product.tags?.includes('Bestseller') && (
            <Badge variant="secondary">Bestseller</Badge>
          )}
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
        >
          <Heart className={cn('size-4', wished && 'fill-primary text-primary')} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {product.category}
          </p>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {product.rating}
          </span>
        </div>
        <Link href={`/product/${product.id}`} className="font-medium leading-snug hover:underline">
          {product.name}
        </Link>

        <div className="mt-1 flex items-center gap-1.5">
          {product.shades.slice(0, 6).map((s) => (
            <span
              key={s.name}
              title={s.name}
              className="size-4 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: s.hex }}
            />
          ))}
          {product.shades.length > 6 && (
            <span className="text-xs text-muted-foreground">+{product.shades.length - 6}</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="font-serif text-lg">{formatPrice(product.price)}</span>
          <Button
            size="sm"
            onClick={() => addToCart(product.id, product.shades[0]?.name ?? 'Default')}
          >
            Add to Bag
          </Button>
        </div>
      </div>
    </div>
  )
}
