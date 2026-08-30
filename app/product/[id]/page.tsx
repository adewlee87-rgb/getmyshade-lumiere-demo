import { notFound } from 'next/navigation'
import { getProduct, products } from '@/lib/data'
import { ProductDetail } from '@/components/product-detail'
import { MarketingNav } from '@/components/marketing-nav'
import { MarketingFooter } from '@/components/marketing-footer'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = getProduct(id)
  if (!product) notFound()

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <MarketingNav />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <ProductDetail product={product} related={related} />
      </main>
      <MarketingFooter />
    </div>
  )
}
