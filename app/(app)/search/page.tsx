import Link from 'next/link'
import { Search as SearchIcon } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ProductCard } from '@/components/product-card'
import { EmptyState } from '@/components/empty-state'
import { Input } from '@/components/ui/input'
import { products, articles } from '@/lib/data'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const query = q.trim().toLowerCase()

  const productResults = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.bestFor.some((b) => b.toLowerCase().includes(query)) ||
          p.tags?.some((t) => t.toLowerCase().includes(query)),
      )
    : []

  const articleResults = query
    ? articles.filter(
        (a) => a.title.toLowerCase().includes(query) || a.category.toLowerCase().includes(query),
      )
    : []

  return (
    <>
      <PageHeader eyebrow="Search" title="Search" />

      <form action="/search" className="relative mb-8 max-w-xl">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search products, shades, concerns…"
          className="pl-9"
          autoFocus
        />
      </form>

      {!query ? (
        <EmptyState
          icon={SearchIcon}
          title="Search Lumière"
          description="Find products, shades, and beauty guides by name, category, or concern."
        />
      ) : productResults.length === 0 && articleResults.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title={`No results for "${q}"`}
          description="Try a different term, or browse the full catalog."
          actionLabel="Browse catalog"
          actionHref="/catalog"
        />
      ) : (
        <div className="space-y-10">
          {productResults.length > 0 && (
            <section>
              <h2 className="mb-4 font-serif text-xl">
                Products <span className="text-muted-foreground">({productResults.length})</span>
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productResults.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
          {articleResults.length > 0 && (
            <section>
              <h2 className="mb-4 font-serif text-xl">
                Beauty school <span className="text-muted-foreground">({articleResults.length})</span>
              </h2>
              <div className="flex flex-col divide-y rounded-xl border">
                {articleResults.map((a) => (
                  <Link
                    key={a.id}
                    href={`/education/${a.id}`}
                    className="flex items-center justify-between gap-3 p-4 hover:bg-accent/30"
                  >
                    <div>
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  )
}
