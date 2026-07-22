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
import { PageHeader } from '@/components/page-header'
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
    body: 'Before any scan can recommend products, GetMyShade needs to know what you sell. Upload your products and shade variants via the dashboard or the bulk-create endpoint — see the dedicated section below.',
  },
  {
    title: 'Call analyze or match',
    body: 'From your frontend, submit a selfie (upload or live camera capture) through your own proxy route to /api-v1-analyze or /api-v1-match.',
  },
  {
    title: 'Render the ranked results',
    body: 'Display the returned matches using the image_url provided per match, and handle the case where a category has no qualifying match (see "Handling the response" below).',
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
    a: 'This is a catalog coverage gap, not a bug — it means none of your uploaded shades for that category are close enough to the scanned skin tone. Check the response\'s meta.no_match_product_types array and show users a clear message rather than nothing; consider broadening your shade range for that category over time.',
  },
  {
    q: 'I\'m being rate-limited (429 responses)',
    a: 'Implement exponential backoff with jitter, and only retry on 429 or 5xx responses — cap retries at a small number (e.g. 4 attempts). Don\'t retry on 4xx errors like invalid input or auth failures, since retrying won\'t change the outcome.',
  },
  {
    q: 'Product images aren\'t loading in my match results',
    a: 'Use the image_url field returned directly on each match object. Don\'t try to cross-reference matches back to your own local catalog by SKU — your internal SKU scheme has no guaranteed relationship to how you named things when uploading, so that kind of lookup is fragile and will silently fail.',
  },
  {
    q: 'Duplicate-looking entries or React key warnings when rendering matches',
    a: 'Treat the matches array defensively: don\'t assume sku is unique for rendering-list purposes. Combine it with the array index for your list keys (e.g. `${match.sku}-${index}`) so a rendering hiccup never causes items to visually disappear or merge.',
  },
]

export default function IntegrationGuidePage() {
  return (
    <>
      <PageHeader
        eyebrow="For Developers"
        title="Integrating the GetMyShade API"
        description="How this storefront connects to the real GetMyShade API — the pattern to follow, the one setup step people skip, and the issues you're most likely to run into."
      />

      <div className="space-y-10">
        <Card className="gap-3 border-primary/30 bg-primary/5 p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h2 className="font-serif text-xl">Security comes first</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your API key authenticates and bills every request to your brand — treat it exactly
            like a password. It must only ever live in a server-side environment variable, never
            in client-side code, never in a public repository, and never in a URL query string.
            If a key is ever accidentally exposed, revoke it and generate a new one immediately.
            Every example on this page uses an obviously fake placeholder key for that reason.
          </p>
        </Card>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <ServerCog className="size-5 text-primary" />
            <h2 className="font-serif text-2xl">The core pattern: proxy, never call directly</h2>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            This storefront never calls the GetMyShade API from the browser. Every request flows
            browser → your own backend route → GetMyShade. Your backend attaches the API key,
            forwards the request, and streams the response back. This keeps your key out of the
            browser's network tab entirely, and it's exactly the shape this site uses:
          </p>
          <pre className="mt-4 max-w-3xl overflow-auto rounded-lg border bg-muted/50 p-4 text-xs leading-relaxed">
{`// app/api/gms/[...path]/route.ts  (server-side only)
const GMS_API_KEY = process.env.GMS_API_KEY // never NEXT_PUBLIC_GMS_API_KEY
const GMS_API_BASE = 'https://api.getmyshade.com/functions/v1'

export async function GET(req: Request, { params }) {
  const upstream = await fetch(\`\${GMS_API_BASE}/\${params.path.join('/')}\`, {
    headers: { Authorization: \`Bearer \${GMS_API_KEY}\` },
  })
  return new Response(await upstream.text(), { status: upstream.status })
}

// Your frontend then calls YOUR route, never the API directly:
// fetch('/api/gms/api-v1-match', { method: 'POST', body: ... })`}
          </pre>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="accent">Integration flow</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <Card key={s.title} className="gap-2 p-5">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 font-serif text-sm text-primary">
                    {i + 1}
                  </span>
                  <h3 className="font-medium">{s.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <Card className="gap-3 p-6">
          <div className="flex items-center gap-2">
            <UploadCloud className="size-5 text-primary" />
            <h2 className="font-serif text-xl">Why uploading your catalog matters</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            GetMyShade's AI analyzes a face and returns a skin tone, undertone, and confidence
            score — but it can only recommend products that actually exist in your catalog. If
            you haven't uploaded any products yet, a scan will complete successfully and still
            return zero matches. This is the single most common source of "the API isn't
            working" confusion, and it isn't a bug — there's simply nothing to rank against.
          </p>
          <ul className="mt-1 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Upload products before testing your integration end to end.</li>
            <li>
              Aim for a broad shade range per product — enough depth and undertone coverage that
              a real range of customers can get a genuine match, not just a narrow subset.
            </li>
            <li>
              After uploading, confirm it landed by checking{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">GET /api-v1-brand</code> —{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">catalog.total_products</code>{' '}
              and{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                catalog.total_variants
              </code>{' '}
              should both be greater than zero.
            </li>
          </ul>
        </Card>

        <Card className="gap-3 p-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="size-5 text-primary" />
            <h2 className="font-serif text-xl">Handling the response safely</h2>
          </div>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              Use the <code className="rounded bg-muted px-1 py-0.5 text-xs">image_url</code>{' '}
              field on each match for product photos — don't try to re-derive it from your own
              local catalog.
            </li>
            <li>
              Check{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                meta.no_match_product_types
              </code>{' '}
              and show users a clear message for any category with no qualifying match, instead
              of silently showing nothing.
            </li>
            <li>
              The API doesn't return pricing — that stays entirely your own data, attached
              client-side after matching.
            </li>
            <li>
              Don't assume list uniqueness guarantees beyond what the API documents; render
              defensively (e.g. combine SKU with array index for list keys).
            </li>
          </ul>
        </Card>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="size-5 text-primary" />
            <h2 className="font-serif text-2xl">Common issues and how to solve them</h2>
          </div>
          <div className="flex flex-col divide-y rounded-xl border">
            {commonIssues.map((item) => (
              <details key={item.q} className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium">
                  {item.q}
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <Card className="gap-3 border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-center gap-2">
            <KeyRound className="size-5 text-destructive" />
            <h2 className="font-serif text-xl">Key hygiene checklist</h2>
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            <li className="flex items-start gap-2">
              <Ban className="mt-0.5 size-3.5 shrink-0 text-destructive" />
              Never commit an API key to git, even in a private repository.
            </li>
            <li className="flex items-start gap-2">
              <Ban className="mt-0.5 size-3.5 shrink-0 text-destructive" />
              Never send it from browser-side JavaScript or embed it in a mobile app binary.
            </li>
            <li className="flex items-start gap-2">
              <Ban className="mt-0.5 size-3.5 shrink-0 text-destructive" />
              Never paste it into chat tools, tickets, or logs that outlive the moment you needed
              it.
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
              Do rotate it immediately from your dashboard if you suspect any exposure.
            </li>
          </ul>
        </Card>
      </div>
    </>
  )
}
