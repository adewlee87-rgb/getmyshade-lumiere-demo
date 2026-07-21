'use client'

import Link from 'next/link'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { Card } from '@/components/ui/card'
import { Button, ButtonLink } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useStore, cartItemDisplay } from '@/components/store-provider'
import { formatPrice } from '@/lib/data'

export default function CartPage() {
  const { cart, updateQty, removeFromCart, cartSubtotal } = useStore()

  if (cart.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Shopping" title="Your bag" />
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Add products from your recommendations or the catalog to see them here."
          actionLabel="Browse catalog"
          actionHref="/catalog"
        />
      </>
    )
  }

  const shipping = cartSubtotal >= 50 ? 0 : 6
  const total = cartSubtotal + shipping

  return (
    <>
      <PageHeader eyebrow="Shopping" title="Your bag" description={`${cart.length} item${cart.length === 1 ? '' : 's'} in your bag.`} />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col divide-y rounded-xl border">
          {cart.map((item) => {
            const display = cartItemDisplay(item)
            const image = (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={display.image} alt={display.name} className="size-full object-cover" />
              </>
            )
            return (
              <div key={`${item.productId}-${item.shade}`} className="flex gap-4 p-4 sm:p-5">
                {display.href ? (
                  <Link
                    href={display.href}
                    className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24"
                  >
                    {image}
                  </Link>
                ) : (
                  <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24">
                    {image}
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {display.href ? (
                        <Link href={display.href} className="font-medium hover:underline">
                          {display.name}
                        </Link>
                      ) : (
                        <span className="font-medium">{display.name}</span>
                      )}
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        {display.hex && (
                          <span
                            className="size-3.5 rounded-full ring-1 ring-black/10"
                            style={{ backgroundColor: display.hex }}
                          />
                        )}
                        {item.shade}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId, item.shade)}
                      aria-label="Remove item"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-lg border">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => updateQty(item.productId, item.shade, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => updateQty(item.productId, item.shade, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                    <span className="font-serif text-lg">
                      {formatPrice(display.price * item.qty)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <Card className="h-fit gap-4 p-6">
          <h3 className="font-medium">Order summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted-foreground">
                Free shipping on orders over {formatPrice(50)}.
              </p>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span className="font-serif text-xl">{formatPrice(total)}</span>
          </div>
          <ButtonLink href="/checkout" size="lg" className="w-full justify-center">
            Checkout
          </ButtonLink>
        </Card>
      </div>
    </>
  )
}
