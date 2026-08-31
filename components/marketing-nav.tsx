'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingBag, Sparkles } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/button'
import { BrandLogo } from '@/components/brand-logo'
import { useStore } from '@/components/store-provider'

const links = [
  { href: '/collections', label: 'Collections' },
  { href: '/match', label: 'Find Your Shade' },
]

export function MarketingNav() {
  const [open, setOpen] = React.useState(false)
  const { cartCount } = useStore()

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <BrandLogo />
          <span className="font-serif text-xl tracking-tight">Lumière</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-foreground/70 transition-colors hover:text-foreground font-medium flex items-center gap-1.5"
            >
              {l.label === 'Find Your Shade' && <Sparkles className="size-3.5 text-primary" />}
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Shopping Cart Button with Count Badge */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center size-10 rounded-full hover:bg-accent transition-colors"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="size-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-sm animate-in zoom-in-50">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <ButtonLink href="/match" size="sm" variant="default" className="gap-1.5 font-medium shadow-sm">
              <Sparkles className="size-3.5" />
              <span>Find Your Shade</span>
            </ButtonLink>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm hover:bg-muted font-medium flex items-center justify-between"
              >
                <span>{l.label}</span>
                {l.label === 'Find Your Shade' && <Sparkles className="size-4 text-primary" />}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm hover:bg-muted font-medium flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {cartCount} items
              </span>
            </Link>
            <div className="mt-2 flex flex-col gap-2">
              <ButtonLink href="/collections" variant="outline" size="lg">
                Browse All Collections
              </ButtonLink>
              <ButtonLink href="/match" size="lg">
                <Sparkles className="size-4" /> Find Your Shadeer
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
