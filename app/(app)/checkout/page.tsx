'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ShoppingBag } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useStore, cartItemDisplay } from '@/components/store-provider'
import { formatPrice } from '@/lib/data'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartSubtotal, placeOrder } = useStore()
  const [submitting, setSubmitting] = useState(false)

  if (cart.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Checkout" title="Checkout" />
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out"
          description="Your bag is empty. Add a product before checking out."
          actionLabel="Browse catalog"
          actionHref="/catalog"
        />
      </>
    )
  }

  const shipping = cartSubtotal >= 50 ? 0 : 6
  const total = cartSubtotal + shipping

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const data = new FormData(e.currentTarget)
    const order = placeOrder({
      fullName: String(data.get('fullName') ?? ''),
      address: String(data.get('address') ?? ''),
      city: String(data.get('city') ?? ''),
      postalCode: String(data.get('postalCode') ?? ''),
      country: String(data.get('country') ?? ''),
    })
    router.push(`/orders/${order.id}?placed=1`)
  }

  return (
    <>
      <PageHeader eyebrow="Checkout" title="Checkout" description="Almost there — review and confirm your order." />

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="gap-4 p-6">
            <h3 className="font-medium">Shipping address</h3>
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" required defaultValue="Sofia Rivera" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" required defaultValue="221 Bloom Street" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required defaultValue="Austin" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="postalCode">Postal code</Label>
                <Input id="postalCode" name="postalCode" required defaultValue="73301" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" required defaultValue="United States" />
            </div>
          </Card>

          <Card className="gap-4 p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Payment</h3>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="size-3" /> Simulated — no charge
              </span>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cardNumber">Card number</Label>
              <Input id="cardNumber" name="cardNumber" defaultValue="4242 4242 4242 4242" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="expiry">Expiry</Label>
                <Input id="expiry" name="expiry" defaultValue="12/29" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" name="cvc" defaultValue="123" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="h-fit gap-4 p-6">
          <h3 className="font-medium">Order summary</h3>
          <div className="flex flex-col divide-y">
            {cart.map((item) => {
              const display = cartItemDisplay(item)
              return (
                <div key={`${item.productId}-${item.shade}`} className="flex items-center gap-3 py-3 first:pt-0">
                  <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={display.image}
                      alt={display.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{display.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.shade} · Qty {item.qty}
                    </p>
                  </div>
                  <span className="text-sm font-serif">{formatPrice(display.price * item.qty)}</span>
                </div>
              )
            })}
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span className="font-serif text-xl">{formatPrice(total)}</span>
          </div>
          <Button type="submit" size="lg" className="w-full justify-center" disabled={submitting}>
            {submitting ? 'Placing order…' : 'Place order'}
          </Button>
        </Card>
      </form>
    </>
  )
}
