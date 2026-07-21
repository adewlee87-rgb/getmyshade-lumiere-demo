import { Compass } from 'lucide-react'
import { MarketingNav } from '@/components/marketing-nav'
import { MarketingFooter } from '@/components/marketing-footer'
import { EmptyState } from '@/components/empty-state'

export default function RootNotFound() {
  return (
    <>
      <MarketingNav />
      <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4 py-20 md:px-8">
        <EmptyState
          icon={Compass}
          title="Page not found"
          description="This page doesn't exist or may have moved. Let's get you back on track."
          actionLabel="Back home"
          actionHref="/"
        />
      </div>
      <MarketingFooter />
    </>
  )
}
