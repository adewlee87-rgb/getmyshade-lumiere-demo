import { notFound } from 'next/navigation'
import { ButtonLink } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { ArrowLeft } from 'lucide-react'
import { collections, getProduct } from '@/lib/data'

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const collection = collections.find((c) => c.id === id)
  if (!collection) notFound()

  const items = collection.productIds
    .map((pid) => getProduct(pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <>
      <ButtonLink href="/collections" variant="ghost" size="sm" className="mb-6">
        <ArrowLeft className="size-4" /> Back to collections
      </ButtonLink>

      <div className="mb-10 overflow-hidden rounded-2xl">
        <div className="aspect-[21/9] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collection.image || '/placeholder.svg'}
            alt={collection.title}
            className="size-full object-cover"
          />
        </div>
      </div>

      <div className="mb-8 max-w-2xl space-y-2">
        <h1 className="text-balance font-serif text-3xl tracking-tight md:text-4xl">
          {collection.title}
        </h1>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          {collection.description}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  )
}
