import Link from 'next/link'
import { BrandLogo } from '@/components/brand-logo'

const cols = [
  {
    title: 'Shop',
    links: [
      { href: '/catalog', label: 'All Products' },
      { href: '/collections', label: 'Collections' },
      { href: '/recommendations', label: 'For You' },
      { href: '/match', label: 'Find My Shade' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { href: '/education', label: 'Beauty School' },
      { href: '/help', label: 'Help Center' },
      { href: '/beauty-profile', label: 'Beauty Profile' },
      { href: '/integration-guide', label: 'API Integration Guide' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/', label: 'About' },
      { href: '/', label: 'Sustainability' },
      { href: '/', label: 'Careers' },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <BrandLogo />
            <span className="font-serif text-xl tracking-tight">Lumière</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Beauty in a shade for every skin. Discover complexion products crafted for your
            unique tone.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-medium">{c.title}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {c.links.map((l, i) => (
                <li key={`${c.title}-${i}`}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:px-8">
          <p>© 2026 Lumière Beauty. All rights reserved.</p>
          <p>Frontend demo · Analysis powered by an external Beauty Analysis API.</p>
        </div>
      </div>
    </footer>
  )
}
