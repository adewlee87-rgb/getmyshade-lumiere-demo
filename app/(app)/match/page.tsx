import { PageHeader } from '@/components/page-header'
import { BeautyMatchWorkspace } from '@/components/beauty-match-workspace'

export default function MatchPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Beauty Match"
        title="Find your perfect match"
        description="Upload a selfie for a real AI skin analysis, or answer five quick questions — either way we'll curate products made for you."
      >
        <div className="flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/getmyshade-logo.png"
            alt="GetMyShade"
            className="size-7 rounded-full object-cover"
          />
          <span className="text-xs font-medium text-muted-foreground">
            Powered by <span className="text-foreground">GetMyShade</span>
          </span>
        </div>
      </PageHeader>
      <BeautyMatchWorkspace />
    </>
  )
}
