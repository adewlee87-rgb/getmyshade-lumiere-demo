import * as React from 'react'
import { cn } from '@/lib/utils'

function Progress({
  value = 0,
  className,
  indicatorClassName,
  ...props
}: React.ComponentProps<'div'> & { value?: number; indicatorClassName?: string }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      data-slot="progress"
      className={cn('bg-muted relative h-2 w-full overflow-hidden rounded-full', className)}
      {...props}
    >
      <div
        className={cn('bg-primary h-full rounded-full transition-all', indicatorClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export { Progress }
