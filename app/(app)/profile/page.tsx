import { MapPin, CreditCard, Sparkles, Package, Heart, Settings as SettingsIcon } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const addresses = [
  { label: 'Home', default: true, line: '221 Bloom Street, Austin, TX 73301, United States' },
  { label: 'Office', default: false, line: '900 Congress Ave, Suite 400, Austin, TX 78701, United States' },
]

const paymentMethods = [
  { brand: 'Visa', last4: '4242', expiry: '12/29', default: true },
]

const quickLinks = [
  { href: '/beauty-profile', label: 'Beauty Profile', icon: Sparkles },
  { href: '/orders', label: 'Order History', icon: Package },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function ProfilePage() {
  return (
    <>
      <PageHeader eyebrow="Account" title="Profile" description="Your account details, addresses, and payment methods." />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit items-center gap-4 p-6 text-center">
          <Avatar className="size-20">
            <AvatarFallback className="text-xl">SR</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-serif text-xl">Sofia Rivera</p>
            <p className="text-sm text-muted-foreground">sofia.rivera@example.com</p>
          </div>
          <Badge variant="secondary">Member since Jan 2025</Badge>
          <ButtonLink href="/settings" variant="outline" size="sm" className="w-full justify-center">
            Edit profile
          </ButtonLink>
        </Card>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickLinks.map((l) => {
              const Icon = l.icon
              return (
                <ButtonLink
                  key={l.href}
                  href={l.href}
                  variant="outline"
                  className="h-auto flex-col gap-2 py-4"
                >
                  <Icon className="size-5" />
                  <span className="text-xs">{l.label}</span>
                </ButtonLink>
              )
            })}
          </div>

          <Card className="gap-4 p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-medium">
                <MapPin className="size-4" /> Saved addresses
              </h3>
            </div>
            <div className="flex flex-col divide-y">
              {addresses.map((a) => (
                <div key={a.label} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{a.label}</p>
                      {a.default && <Badge variant="muted">Default</Badge>}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{a.line}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="gap-4 p-6">
            <h3 className="flex items-center gap-2 font-medium">
              <CreditCard className="size-4" /> Payment methods
            </h3>
            <div className="flex flex-col divide-y">
              {paymentMethods.map((p) => (
                <div key={p.last4} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{p.brand} •••• {p.last4}</p>
                      {p.default && <Badge variant="muted">Default</Badge>}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">Expires {p.expiry}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
