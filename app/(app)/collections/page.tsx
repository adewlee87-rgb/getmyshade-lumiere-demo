import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { collections } from '@/lib/data'

export default function CollectionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Curated collections"
        description="Complete routines and edits, put together by our team."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {collections.map((c) => (
          <Link
            key={c.id}
            href={`/collections/${c.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
          >
            <div className="aspect-[16/9] overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image || '/placeholder.svg'}
                alt={c.title}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <h3 className="font-serif text-xl">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-auto flex items-center justify-between pt-3 text-sm">
                <span className="text-muted-foreground">{c.productIds.length} products</span>
                <span className="flex items-center gap-1 font-medium text-primary">
                  Explore <ArrowRight className="size-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
