import { notFound } from 'next/navigation'
import { ArrowLeft, Clock } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { articles } from '@/lib/data'

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = articles.find((a) => a.id === id)
  if (!article) notFound()

  return (
    <>
      <ButtonLink href="/education" variant="ghost" size="sm" className="mb-6">
        <ArrowLeft className="size-4" /> Back to beauty school
      </ButtonLink>

      <div className="mx-auto max-w-2xl">
        <div className="mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.image || '/placeholder.svg'} alt={article.title} className="size-full object-cover" />
        </div>

        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary">{article.category}</Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" /> {article.readTime}
          </span>
        </div>

        <h1 className="text-balance font-serif text-3xl tracking-tight md:text-4xl">
          {article.title}
        </h1>

        <div className="prose prose-neutral mt-6 max-w-none space-y-4 leading-relaxed text-foreground/90">
          <p className="text-lg text-muted-foreground">{article.excerpt}</p>
          <p>
            Getting this right starts with observation, not guesswork. Take your time in natural,
            indirect light — midday near a window works best — and avoid comparing swatches under
            warm indoor bulbs, which can skew every shade toward gold.
          </p>
          <p>
            If you're using your Beauty Match results as a starting point, treat the recommended
            shade as your center point rather than a single fixed answer: skin can shift slightly
            with the seasons, so it's worth re-scanning every few months, especially after a summer
            tan fades or in the depths of winter.
          </p>
          <p>
            When in doubt, our Beauty Match workspace can re-analyze your profile in under a
            minute — head back to your Beauty Profile any time for an updated read.
          </p>
        </div>
      </div>
    </>
  )
}
