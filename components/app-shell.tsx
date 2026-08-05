'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Sparkles,
  Wand2,
  ShoppingBag,
  Layers,
  Heart,
  Package,
  User,
  GraduationCap,
  Settings,
  LifeBuoy,
  Search,
  ShoppingCart,
  Menu,
  X,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, ButtonLink } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/components/store-provider'
import { BrandLogo, GetMyShadeMark } from '@/components/brand-logo'

const nav = [
  { section: 'Discover', items: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/match', label: 'Beauty Match', icon: Wand2 },
    { href: '/recommendations', label: 'For You', icon: Sparkles },
  ]},
  { section: 'Shop', items: [
    { href: '/catalog', label: 'Catalog', icon: ShoppingBag },
    { href: '/collections', label: 'Collections', icon: Layers },
    { href: '/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/orders', label: 'Orders', icon: Package },
  ]},
  { section: 'Account', items: [
    { href: '/beauty-profile', label: 'Beauty Profile', icon: Sparkles },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/education', label: 'Beauty School', icon: GraduationCap },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/help', label: 'Help Center', icon: LifeBuoy },
  ]},
]

function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <BrandLogo />
      <span className="font-serif text-xl tracking-tight">Lumière</span>
    </Link>
  )
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {nav.map((group) => (
        <div key={group.section} className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {group.section}
          </p>
          {group.items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/70 hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}
      <Link
        href="/integration-guide"
        onClick={onNavigate}
        className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <GetMyShadeMark className="size-4" />
        Powered by GetMyShade
      </Link>
    </nav>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { cartCount } = useStore()

  return (
    <div className="min-h-svh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed top-0 bottom-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b px-5">
          <Logo />
        </div>
        <SidebarNav />
        <div className="border-t p-3">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
          >
            <Avatar>
              <AvatarFallback>SR</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Sofia Rivera</p>
              <p className="truncate text-xs text-muted-foreground">Warm · Combination</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-sidebar">
            <div className="flex h-16 items-center justify-between border-b px-5">
              <Logo />
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </Button>

          <Link
            href="/search"
            className="flex h-9 flex-1 items-center gap-2 rounded-full border bg-muted/50 px-4 text-sm text-muted-foreground transition-colors hover:bg-muted md:max-w-md"
          >
            <Search className="size-4" />
            Search products, shades, concerns…
          </Link>

          <div className="ml-auto flex items-center gap-1">
            <ButtonLink
              variant="ghost"
              size="icon"
              aria-label="Powered by GetMyShade"
              title="Powered by GetMyShade"
              href="/integration-guide"
              className="p-0"
            >
              <GetMyShadeMark className="size-6" />
            </ButtonLink>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="size-5" />
            </Button>
            <ButtonLink
              variant="ghost"
              size="icon"
              aria-label="Wishlist"
              href="/wishlist"
            >
              <Heart className="size-5" />
            </ButtonLink>
            <ButtonLink
              variant="ghost"
              size="icon"
              aria-label="Cart"
              className="relative"
              href="/cart"
            >
              <ShoppingCart className="size-5" />
              {cartCount > 0 && (
                <Badge className="absolute -right-1 -top-1 size-5 justify-center rounded-full p-0 text-[10px]">
                  {cartCount}
                </Badge>
              )}
            </ButtonLink>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  )
}
