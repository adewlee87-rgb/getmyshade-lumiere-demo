'use client'

import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/components/store-provider'
import { formatPrice } from '@/lib/data'

const statusVariant = {
  Delivered: 'success',
  Shipped: 'accent',
  Processing: 'secondary',
} as const

export default function OrdersPage() {
  const { orders } = useStore()

  return (
    <>
      <PageHeader eyebrow="Account" title="Order history" description="Track and review your past orders." />

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Once you place an order, it'll show up here with tracking status."
          actionLabel="Browse catalog"
          actionHref="/catalog"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card className="flex-row items-center justify-between gap-4 p-5 transition-colors hover:bg-accent/30">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">#{order.id}</p>
                    <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.date} · {order.items.length} item{order.items.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-serif text-lg">{formatPrice(order.total)}</span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
