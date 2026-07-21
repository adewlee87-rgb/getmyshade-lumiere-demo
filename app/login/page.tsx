'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthShell } from '@/components/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  return (
    <AuthShell>
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to see your beauty profile and matches.
        </p>
      </div>

      <form
        className="mt-8 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          router.push('/dashboard')
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" defaultValue="sofia@example.com" required />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" defaultValue="password" required />
        </div>
        <Button type="submit" size="lg" className="mt-2 h-11 text-base">
          Sign in
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" size="lg" className="mt-6 h-11 w-full text-base">
        Continue with Apple
      </Button>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        New to Lumière?{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}
