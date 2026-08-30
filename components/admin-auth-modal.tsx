'use client'

import React, { useState } from 'react'
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const HARDCODED_PIN = 'Nana26'
const AUTH_KEY = 'lumiere_admin_auth'

export function isAlreadyAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(AUTH_KEY) === 'true'
}

export function setAuthenticated(val: boolean) {
  if (typeof window === 'undefined') return
  if (val) {
    sessionStorage.setItem(AUTH_KEY, 'true')
  } else {
    sessionStorage.removeItem(AUTH_KEY)
  }
}

export function AdminAuthModal({
  open,
  onSuccess,
  onClose,
}: {
  open: boolean
  onSuccess: () => void
  onClose: () => void
}) {
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState(false)

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pin === HARDCODED_PIN) {
      setAuthenticated(true)
      setError(false)
      setPin('')
      onSuccess()
    } else {
      setError(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-card p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 grid size-8 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Lock className="size-7" />
          </div>
          <Badge variant="accent" className="px-3 py-1 text-[11px] uppercase tracking-wider gap-1">
            <ShieldCheck className="size-3.5" /> Restricted Access
          </Badge>
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            Brand Admin Access
          </h2>
          <p className="text-xs text-muted-foreground max-w-xs">
            Please enter your authorization PIN password to access the Lumière Brand Admin Portal.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Input Password / PIN
            </label>
            <div className="relative">
              <Input
                type={showPin ? 'text' : 'password'}
                placeholder="Enter Admin PIN password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value)
                  if (error) setError(false)
                }}
                className={`h-11 pr-10 text-sm font-mono tracking-wider ${
                  error ? 'border-destructive focus-visible:ring-destructive' : ''
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Toggle password visibility"
              >
                {showPin ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {error && (
              <p className="flex items-center gap-1 text-xs text-destructive font-medium pt-1">
                <AlertCircle className="size-3.5" /> Incorrect PIN password. Please try again.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 text-xs font-semibold gap-1.5 shadow-md"
            >
              Authenticate <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </form>

        <div className="border-t pt-4 text-center">
          <p className="text-[11px] text-muted-foreground">
            Lumière × GetMyShade Protected Administrative Terminal
          </p>
        </div>
      </div>
    </div>
  )
}
