'use client'

import { useState } from 'react'
import { Sparkles, Check, ArrowRight, RotateCcw, Video, Upload, ListChecks } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ProductCard } from '@/components/product-card'
import { BeautyScanPanel } from '@/components/beauty-scan-panel'
import { LiveScanPanel } from '@/components/live-scan-panel'
import { products, matchQuestions } from '@/lib/data'
import { cn } from '@/lib/utils'

type Phase = 'quiz' | 'analyzing' | 'results'

export function BeautyMatchWorkspace() {
  return (
    <Tabs defaultValue="live">
      <TabsList>
        <TabsTrigger value="live">
          <Video className="size-4" /> Live Camera Scan
        </TabsTrigger>
        <TabsTrigger value="upload">
          <Upload className="size-4" /> Upload Photo
        </TabsTrigger>
        <TabsTrigger value="quiz">
          <ListChecks className="size-4" /> Guided Quiz
        </TabsTrigger>
      </TabsList>
      <TabsContent value="live">
        <LiveScanPanel />
      </TabsContent>
      <TabsContent value="upload">
        <BeautyScanPanel />
      </TabsContent>
      <TabsContent value="quiz">
        <QuizWorkspace />
      </TabsContent>
    </Tabs>
  )
}

function QuizWorkspace() {
  const [phase, setPhase] = useState<Phase>('quiz')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [progress, setProgress] = useState(0)

  const question = matchQuestions[step]
  const isLast = step === matchQuestions.length - 1
  const selected = answers[question?.id]

  function choose(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  function next() {
    if (isLast) {
      runAnalysis()
      return
    }
    setStep((s) => s + 1)
  }

  function runAnalysis() {
    setPhase('analyzing')
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setPhase('results')
          return 100
        }
        return p + 4
      })
    }, 60)
  }

  function restart() {
    setPhase('quiz')
    setStep(0)
    setAnswers({})
    setProgress(0)
  }

  if (phase === 'analyzing') {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center gap-6 py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="size-7 animate-pulse text-primary" />
          </span>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl">Analyzing your profile</h2>
            <p className="text-sm text-muted-foreground">
              Matching your undertone, skin type, and finish preferences against 240+ shades.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <Progress value={progress} />
            <p className="mt-2 text-xs text-muted-foreground">{progress}%</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (phase === 'results') {
    const recommended = products.filter((p) => p.matched).slice(0, 3)
    return (
      <div className="space-y-8">
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-6 text-primary" />
              </span>
              <div>
                <h2 className="font-serif text-2xl">Your match is ready</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Based on a {answers.undertone ?? 'neutral'} undertone with a preference for a{' '}
                  {answers.finish ?? 'natural'} finish.
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={restart}>
              <RotateCcw className="size-4" />
              Retake
            </Button>
          </CardContent>
        </Card>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl">Top matches for you</h3>
            <ButtonLink variant="ghost" size="sm" href="/recommendations">
              View all
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="space-y-8 py-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Question {step + 1} of {matchQuestions.length}
            </span>
            <Badge variant="secondary">{question.category}</Badge>
          </div>
          <Progress value={((step + 1) / matchQuestions.length) * 100} />
        </div>

        <div className="space-y-1">
          <h2 className="font-serif text-2xl text-balance">{question.title}</h2>
          <p className="text-sm text-muted-foreground">{question.description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {question.options.map((option) => {
            const active = selected === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => choose(option.value)}
                className={cn(
                  'flex items-start gap-3 rounded-lg border p-4 text-left transition-colors',
                  active
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40 hover:bg-muted',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
                    active ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                  )}
                >
                  {active && <Check className="size-3" />}
                </span>
                <span>
                  <span className="block text-sm font-medium">{option.label}</span>
                  {option.hint && (
                    <span className="mt-0.5 block text-xs text-muted-foreground">{option.hint}</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button onClick={next} disabled={!selected}>
            {isLast ? 'See my matches' : 'Continue'}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
