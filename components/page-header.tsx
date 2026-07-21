export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-1.5">
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-wider text-primary">{eyebrow}</p>
        )}
        <h1 className="text-balance font-serif text-3xl tracking-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  )
}
