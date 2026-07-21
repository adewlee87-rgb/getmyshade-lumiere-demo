import type { LucideIcon } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-6" />
      </span>
      <div className="space-y-1">
        <h3 className="font-serif text-xl">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <ButtonLink href={actionHref} className="mt-2">
          {actionLabel}
        </ButtonLink>
      )}
    </div>
  )
}
