'use client'

import { useMemo, useState } from 'react'
import { Search as SearchIcon, PackageSearch } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ProductCard } from '@/components/product-card'
import { EmptyState } from '@/components/empty-state'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { products, categories, type Category } from '@/lib/data'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

export default function CatalogPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'All'>('All')
  const [sort, setSort] = useState<SortKey>('featured')

  const visible = useMemo(() => {
    let list = products.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category
      const matchesQuery =
        query.trim() === '' || p.name.toLowerCase().includes(query.trim().toLowerCase())
      return matchesCategory && matchesQuery
    })

    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      return Number(b.matched) - Number(a.matched)
    })

    return list
  }, [query, category, sort])

  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Product catalog"
        description="Every foundation, shade, and finish — filter down to what fits your routine."
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="pl-9"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('All')}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm transition-colors',
              category === 'All'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background hover:bg-muted',
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setCategory(c.name)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                category === c.name
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:bg-muted',
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          {visible.length} {visible.length === 1 ? 'product' : 'products'}
        </p>

        {visible.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No products found"
            description="Try a different search term or clear your filters."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
