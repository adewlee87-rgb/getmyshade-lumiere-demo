'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/button'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-6 text-destructive" />
      </span>
      <div className="space-y-1">
        <h2 className="font-serif text-2xl">Something went wrong</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          An unexpected error occurred while loading this page. You can try again, or head back to
          your dashboard.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
        <ButtonLink href="/dashboard">Back to dashboard</ButtonLink>
      </div>
    </div>
  )
}
