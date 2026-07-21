'use client'

import { Heart } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ProductCard } from '@/components/product-card'
import { EmptyState } from '@/components/empty-state'
import { useStore } from '@/components/store-provider'
import { getProduct } from '@/lib/data'

export default function WishlistPage() {
  const { wishlist } = useStore()
  const items = wishlist
    .map((id) => getProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <>
      <PageHeader
        eyebrow="Saved"
        title="Wishlist"
        description="Products you've saved for later — everything here is ready to add to your bag."
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here for later."
          actionLabel="Browse catalog"
          actionHref="/catalog"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  )
}
