import { cn } from '@/lib/utils'

export function BrandLogo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/getmyshade-logo.png"
      alt="GetMyShade"
      className={cn('size-8 shrink-0 rounded-full object-cover', className)}
    />
  )
}
