import Link from 'next/link'
import { Sparkles, ShieldCheck, Star } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'

export function AuthShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-editorial.png"
          alt="Radiant matched complexion"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-primary-foreground">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo className="ring-2 ring-primary-foreground/60" />
            <span className="font-serif text-xl tracking-tight">Lumière</span>
          </Link>
          <div className="max-w-sm">
            <Sparkles className="size-6" />
            <p className="mt-4 text-balance font-serif text-3xl leading-tight">
              “I finally found my exact foundation shade on the first try.”
            </p>
            <p className="mt-3 text-sm text-primary-foreground/80">
              Maya T. · matched to Light Medium 9N
            </p>
            <div className="mt-6 flex items-center gap-6 text-sm text-primary-foreground/90">
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-current" /> 4.9 rating
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4" /> 94% accuracy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <BrandLogo />
            <span className="font-serif text-xl tracking-tight">Lumière</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
