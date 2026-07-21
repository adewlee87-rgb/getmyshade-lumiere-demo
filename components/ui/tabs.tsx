'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type TabsContextValue = {
  value: string
  setValue: (v: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<'div'>, 'onChange'> & {
  defaultValue?: string
  value?: string
  onValueChange?: (v: string) => void
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? '')
  const value = controlledValue ?? uncontrolled
  const setValue = React.useCallback(
    (v: string) => {
      setUncontrolled(v)
      onValueChange?.(v)
    },
    [onValueChange],
  )

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn('flex flex-col gap-4', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-muted p-1 text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  value,
  className,
  ...props
}: React.ComponentProps<'button'> & { value: string }) {
  const ctx = React.useContext(TabsContext)
  const active = ctx?.value === value
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => ctx?.setValue(value)}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all',
        active
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:text-foreground',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  value,
  className,
  ...props
}: React.ComponentProps<'div'> & { value: string }) {
  const ctx = React.useContext(TabsContext)
  if (ctx?.value !== value) return null
  return <div role="tabpanel" className={cn('outline-none', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
