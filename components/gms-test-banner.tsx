import { FlaskConical } from 'lucide-react'

// Fixed at a constant h-9 height so every other fixed/sticky element in the
// app (sidebar, header, marketing nav) can reliably offset below it — see
// the top-9 offsets in app-shell.tsx and marketing-nav.tsx.
export function GmsTestBanner() {
  return (
    <div className="fixed inset-x-0 top-0 z-40 flex h-9 items-center justify-center gap-2 overflow-hidden bg-foreground px-4 text-background">
      <FlaskConical className="size-3.5 shrink-0" />
      <p className="truncate text-xs font-medium sm:text-sm">
        <span className="font-bold tracking-wide">GETMYSHADE API TEST WEBSITE</span>
        <span className="hidden md:inline">
          {' '}
          — a dummy storefront built to test the real GetMyShade facial-analysis API. No real
          products are sold here.
        </span>
      </p>
    </div>
  )
}
