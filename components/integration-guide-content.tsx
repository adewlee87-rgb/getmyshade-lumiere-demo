import React from 'react'
import {
  ChevronDown,
  ShieldCheck,
  ServerCog,
  UploadCloud,
  ImageIcon,
  AlertTriangle,
  KeyRound,
  Ban,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const steps = [
  {
    title: 'Get your API key',
    body: 'Create a GetMyShade account and generate an sk_live_… key from your dashboard. This key identifies your brand and is billed against your plan — treat it like a password.',
  },
  {
    title: 'Store it server-side only',
    body: 'Save the key as a server-only environment variable (e.g. GMS_API_KEY). Never prefix it with NEXT_PUBLIC_, VITE_, or any convention that ships it to the browser bundle, and never commit it to source control.',
  },
  {
    title: 'Build a thin proxy route',
    body: 'Add one server-side route in your own app that attaches the Authorization header and forwards requests to the GetMyShade API. Your frontend calls your own route, never the API directly.',
  },
  {
    title: 'Upload your product catalog',
    body: 'Before any scan can recommend products, GetMyShade needs to know what you sell. Upload your products and shade variants via the dashboard or the bulk-create endpoint.',
  },
  {
    title: 'Call analyze or match',
    body: 'From your frontend, submit a selfie (upload or live camera capture) through your own proxy route to /api-v1-analyze or /api-v1-match.',
  },
  {
    title: 'Render the ranked results',
    body: 'Display the returned matches using the image_url provided per match, and handle the case where a category has no qualifying match.',
  },
  {
    title: 'Log events and watch usage',
    body: 'Call /api-v1-log for key events (view, add_to_cart) for your own analytics, and periodically check /api-v1-usage against your plan quota.',
  },
]

const commonIssues = [
  {
    q: 'I\'m getting MISSING_API_KEY or INVALID_API_KEY',
    a: 'Confirm your key is actually set as a server-side environment variable and hasn\'t been truncated when copied. Send it as either an Authorization: Bearer sk_live_… header or an x-api-key header — not as a query parameter, and never from client-side code.',
  },
  {
    q: 'My scan completes successfully, but no products are recommended',
    a: 'This almost always means your product catalog is empty or hasn\'t finished uploading. The AI analysis can succeed perfectly while still returning zero matches if there\'s nothing in your catalog to rank. Check GET /api-v1-brand and confirm catalog.total_products and catalog.total_variants are both greater than zero.',
  },
  {
    q: 'I\'m getting CORS errors calling the API',
    a: 'You\'re likely calling the API directly from browser JavaScript. Route the request through your own backend instead — the browser should only ever talk to your server, and your server talks to GetMyShade.',
  },
  {
    q: 'Some product categories never return a match',
    a: 'This is a catalog coverage gap, not a bug — it means none of your uploaded shades for that category are close enough to the scanned skin tone. Check the response\'s meta.no_match_product_types array and show users a clear message rather than nothing.',
  },
  {
    q: 'I\'m being rate-limited (429 responses)',
    a: 'Implement exponential backoff with jitter, and only retry on 429 or 5xx responses — cap retries at a small number (e.g. 4 attempts).',
  },
  {
    q: 'Product images aren\'t loading in my match results',
    a: 'Use the image_url field returned directly on each match object. Don\'t try to cross-reference matches back to your own local catalog by SKU.',
  },
]

export function IntegrationGuideContent() {
  return (
    <div className="space-y-8 pt-4">
      <Card className="gap-3 border-primary/30 bg-primary/5 p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          <h2 className="font-serif text-xl">Developer Integration & Security Standards</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Your API key authenticates and bills every request to your brand — treat it exactly
          like a password. It must only ever live in a server-side environment variable, never
          in client-side code, never in a public repository, and never in a URL query string.
        </p>
      </Card>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <ServerCog className="size-5 text-primary" />
          <h3 className="font-serif text-2xl">The Core Architecture: Proxy Pattern</h3>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          This storefront never calls the GetMyShade API from the browser. Every request flows
          browser $\rightarrow$ your own backend route $\rightarrow$ GetMyShade. Your backend attaches the API key,
          forwards the request, and streams the response back.
        </p>
        <pre className="mt-4 max-w-3xl overflow-auto rounded-lg border bg-muted/50 p-4 text-xs leading-relaxed">
{`// app/api/gms/[...path]/route.ts  (server-side proxy)
const GMS_API_KEY = process.env.GMS_API_KEY // never NEXT_PUBLIC_GMS_API_KEY
const GMS_API_BASE = 'https://api.getmyshade.com/functions/v1'

export async function GET(req: Request, { params }) {
  const upstream = await fetch(\`\${GMS_API_BASE}/\${params.path.join('/')}\`, {
    headers: { Authorization: \`Bearer \${GMS_API_KEY}\` },
  })
  return new Response(await upstream.text(), { status: upstream.status })
}`}
        </pre>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="accent">Step-by-step Implementation Flow</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={s.title} className="gap-2 p-5">
              <div className="flex items-center gap-2">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 font-serif text-sm text-primary">
                  {i + 1}
                </span>
                <h4 className="font-medium text-sm">{s.title}</h4>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{s.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="gap-3 p-6">
          <div className="flex items-center gap-2">
            <UploadCloud className="size-5 text-primary" />
            <h3 className="font-serif text-lg">Catalog Upload Best Practices</h3>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            GetMyShade's AI analyzes skin tones and returns hex values — but it can only match against products in your catalog. If your catalog is empty, scans will return zero matches.
          </p>
        </Card>

        <Card className="gap-3 p-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="size-5 text-primary" />
            <h3 className="font-serif text-lg">Response Handling</h3>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Use the <code className="rounded bg-muted px-1 py-0.5 text-xs">image_url</code> field directly from returned matches. Always check <code className="rounded bg-muted px-1 py-0.5 text-xs">meta.no_match_product_types</code> to render fallback messaging gracefully.
          </p>
        </Card>
      </div>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="size-5 text-primary" />
          <h3 className="font-serif text-xl">Troubleshooting & Edge Cases</h3>
        </div>
        <div className="flex flex-col divide-y rounded-xl border bg-card">
          {commonIssues.map((item) => (
            <details key={item.q} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium">
                {item.q}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Card className="gap-3 border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-center gap-2">
          <KeyRound className="size-5 text-destructive" />
          <h3 className="font-serif text-lg">API Security Checklist</h3>
        </div>
        <ul className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
          <li className="flex items-start gap-2">
            <Ban className="mt-0.5 size-3.5 shrink-0 text-destructive" />
            Never commit sk_live_ keys to git repositories.
          </li>
          <li className="flex items-start gap-2">
            <Ban className="mt-0.5 size-3.5 shrink-0 text-destructive" />
            Never call API endpoints directly from browser JS without the server proxy.
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
            Rotate keys immediately from your GMS portal if exposure occurs.
          </li>
        </ul>
      </Card>
    </div>
  )
}
