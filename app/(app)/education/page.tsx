import Link from 'next/link'
import { Clock } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { articles } from '@/lib/data'

export default function EducationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title="Beauty school"
        description="Guides and tutorials to help you get the most out of your products."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/education/${a.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.image || '/placeholder.svg'}
                alt={a.title}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <Badge variant="secondary" className="w-fit">
                {a.category}
              </Badge>
              <h3 className="font-serif text-lg leading-snug">{a.title}</h3>
              <p className="text-sm text-muted-foreground">{a.excerpt}</p>
              <span className="mt-auto flex items-center gap-1 pt-3 text-xs text-muted-foreground">
                <Clock className="size-3" /> {a.readTime}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
