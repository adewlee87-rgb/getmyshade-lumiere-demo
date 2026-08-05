import { PageHeader } from '@/components/page-header'
import { BeautyMatchWorkspace } from '@/components/beauty-match-workspace'

export default function MatchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Beauty Match"
        title="Find your perfect match"
        description="Upload a selfie for a real skin analysis, or answer five quick questions — either way we'll curate products made for you."
      />
      <BeautyMatchWorkspace />
    </>
  )
}
