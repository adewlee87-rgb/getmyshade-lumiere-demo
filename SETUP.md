# Running this site against the real GetMyShade API

This storefront's "AI Photo Scan" (in AI Beauty Match) and the Developer tab in
Settings call the real GetMyShade API through a server-side proxy — no mock
data involved once your key is in place.

## 1. Install dependencies

```bash
npm install
```

## 2. Add your API key

Open `.env.local` (already created, git-ignored) and fill in:

```
GMS_API_KEY=sk_live_your_real_key
GMS_API_BASE=https://api.getmyshade.com/functions/v1
```

The key is read only by `app/api/gms/[...path]/route.ts`, a server-side route
handler — it is never sent to the browser. Restart the dev server after
editing this file (env vars are only read at process start).

## 3. Run it

```bash
npm run dev
```

Open http://localhost:3000.

## 4. Verify the connection

Go to **Settings → Developer**. It calls `GET /api-v1-brand` on load — a green
"active" badge means the key is valid and the brand is active. If you see a
red "Not connected" box instead, the message tells you the exact error code
(e.g. `MISSING_API_KEY`, `INVALID_API_KEY`, `NO_SUBSCRIPTION`) and what to do
about it.

## 5. Seed your catalog

Still on **Settings → Developer**, click **Seed catalog from this
storefront**. This pushes every product/shade in `lib/data.ts` into your
GetMyShade brand catalog (via `POST /api-v1-products/bulk`) with stable SKUs,
so `/api-v1-match` has something to rank against.

## 6. Run a real scan

Go to **AI Beauty Match** (`/match`) → **AI Photo Scan** tab. Upload a selfie
(JPEG/PNG/WebP/HEIC, one centered evenly-lit face, ≤10MB). It calls
`POST /api-v1-match` with a fresh session ID and renders:

- The detected skin tone, undertone, depth, skin type, and confidence score
- A raw-JSON toggle showing the exact API response (useful for debugging)
- Ranked shade matches from your seeded catalog, with match score and ΔE
- "Add to Bag" / view buttons that fire `POST /api-v1-log` funnel events tied
  to that scan's session ID

## Where things live

| Concern | File |
|---|---|
| Server-side key + proxy | `app/api/gms/[...path]/route.ts` |
| Typed client + error handling/retry | `lib/gms-client.ts` |
| Catalog → GetMyShade payload mapping | `lib/data.ts` (`toGmsCatalogPayload`, SKU assignment) |
| Selfie upload + scan UI | `components/beauty-scan-panel.tsx` |
| Brand/usage/seed UI | `components/gms-developer-panel.tsx`, `app/(app)/settings/page.tsx` |

## Troubleshooting

- **`MISSING_API_KEY` / `INVALID_API_KEY`**: check `.env.local`, restart `npm run dev`.
- **`data.matches` is empty on a successful scan**: your GetMyShade catalog is
  empty — run the seed step above.
- **`RATE_LIMIT_EXCEEDED` / `AI_QUOTA_EXCEEDED`**: scan quota exhausted for the
  period, or the upstream AI provider is temporarily out of capacity — the
  client already retries these automatically with backoff before surfacing
  the error.
- **npm install fails with `ETIMEDOUT` reaching `registry.npmjs.org`**: that's
  your network, not this code — retry once connectivity is stable, or install
  from a machine/connection that isn't rate-limited or blocking the npm
  registry.
