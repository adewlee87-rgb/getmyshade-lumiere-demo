import { notFound } from 'next/navigation'
import { getProduct, products } from '@/lib/data'
import { ProductDetail } from '@/components/product-detail'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = getProduct(id)
  if (!product) notFound()

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return <ProductDetail product={product} related={related} />
}
