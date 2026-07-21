import { Compass } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'

export default function AppNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="This page doesn't exist or may have moved. Let's get you back on track."
        actionLabel="Back to dashboard"
        actionHref="/dashboard"
      />
    </div>
  )
}
