'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Package, Truck, Home, ArrowLeft } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useStore, cartItemDisplay } from '@/components/store-provider'
import { formatPrice } from '@/lib/data'
import { cn } from '@/lib/utils'

const steps = [
  { key: 'Processing', label: 'Order placed', icon: CheckCircle2 },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: Home },
] as const

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const justPlaced = searchParams.get('placed') === '1'
  const { orders } = useStore()

  const order = orders.find((o) => o.id === params.id)
  if (!order) {
    notFound()
  }

  const stepIndex = steps.findIndex((s) => s.key === order.status)

  return (
    <>
      <ButtonLink href="/orders" variant="ghost" size="sm" className="mb-6">
        <ArrowLeft className="size-4" /> Back to orders
      </ButtonLink>

      {justPlaced && (
        <Card className="mb-8 flex-row items-center gap-3 border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm text-emerald-800 dark:text-emerald-300">
            Order confirmed! We've sent a confirmation to your email.
          </p>
        </Card>
      )}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">Order #{order.id}</h1>
          <p className="text-sm text-muted-foreground">Placed {order.date}</p>
        </div>
        <Badge variant="success">{order.status}</Badge>
      </div>

      <Card className="mb-8 gap-6 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => {
            const Icon = step.icon
            const complete = i <= stepIndex
            return (
              <div
                key={step.key}
                className="relative flex flex-1 flex-col items-center gap-2 text-center"
              >
                <span
                  className={cn(
                    'grid size-10 place-items-center rounded-full border-2',
                    complete
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground',
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span
                  className={cn(
                    'text-xs font-medium',
                    complete ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      'absolute mt-5 h-0.5 w-full max-w-24 translate-x-16',
                      i < stepIndex ? 'bg-primary' : 'bg-border',
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="gap-4 p-6">
        <h3 className="font-medium">Items</h3>
        <div className="flex flex-col divide-y">
          {order.items.map((item) => {
            const display = cartItemDisplay(item)
            const content = (
              <>
                <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={display.image}
                    alt={display.name}
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{display.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.shade} · Qty {item.qty}
                  </p>
                </div>
                <span className="font-serif text-lg">{formatPrice(display.price * item.qty)}</span>
              </>
            )
            return display.href ? (
              <Link
                key={`${item.productId}-${item.shade}`}
                href={display.href}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                {content}
              </Link>
            ) : (
              <div
                key={`${item.productId}-${item.shade}`}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                {content}
              </div>
            )
          })}
        </div>
        <Separator />
        <div className="flex items-center justify-between font-medium">
          <span>Total</span>
          <span className="font-serif text-xl">{formatPrice(order.total)}</span>
        </div>
      </Card>
    </>
  )
}
