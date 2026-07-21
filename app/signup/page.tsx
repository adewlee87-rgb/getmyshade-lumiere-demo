'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { AuthShell } from '@/components/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const perks = [
  'Free AI beauty analysis',
  'Personalized shade matching',
  'Save your wishlist & looks',
]

export default function SignupPage() {
  const router = useRouter()
  return (
    <AuthShell>
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Start with a free beauty match — no card required.
        </p>
      </div>

      <ul className="mt-6 flex flex-col gap-2">
        {perks.map((p) => (
          <li key={p} className="flex items-center gap-2 text-sm">
            <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
              <Check className="size-3" />
            </span>
            {p}
          </li>
        ))}
      </ul>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          router.push('/match')
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Sofia Rivera" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Create a password" required />
        </div>
        <Button type="submit" size="lg" className="mt-2 h-11 text-base">
          Create account & analyze
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms & Privacy Policy.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
