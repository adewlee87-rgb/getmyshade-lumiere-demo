'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/button'
import { BrandLogo } from '@/components/brand-logo'

const links = [
  { href: '/collections', label: 'Collections' },
  { href: '/match', label: 'Find Your Shade' },
  { href: '/admin', label: 'Brand Admin Portal' },
]

export function MarketingNav() {
  const [open, setOpen] = React.useState(false)
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
              className="text-sm text-foreground/70 transition-colors hover:text-foreground font-medium"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href="/admin" variant="outline" size="sm">
            Brand Admin
          </ButtonLink>
          <ButtonLink href="/match" size="sm" className="gap-1.5 font-medium shadow-sm">
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

      {open && (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <ButtonLink href="/login" variant="outline" size="lg">
                Sign in
              </ButtonLink>
              <ButtonLink href="/signup" size="lg">
                Get your match
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
