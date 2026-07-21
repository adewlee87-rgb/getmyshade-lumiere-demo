import { NextResponse, type NextRequest } from 'next/server'
import { setDefaultResultOrder } from 'node:dns'
import { setDefaultAutoSelectFamily } from 'node:net'

// Server-only proxy for the GetMyShade API. Keeps GMS_API_KEY out of the
// browser bundle per the integration guide's security rules: the browser
// calls /api/gms/<path>, this route attaches the Authorization header and
// forwards to GMS_API_BASE, and the response is streamed back unchanged.
export const runtime = 'nodejs'

// This environment's IPv6 routes are unreachable, and Node's Happy Eyeballs
// connection racing (autoSelectFamily) stalls out on the IPv6 candidates
// instead of failing over quickly the way curl does. Disabling the race and
// preferring IPv4 avoids the multi-second ETIMEDOUT.
setDefaultResultOrder('ipv4first')
setDefaultAutoSelectFamily(false)

const GMS_API_BASE = process.env.GMS_API_BASE ?? 'https://api.getmyshade.com/functions/v1'
const GMS_API_KEY = process.env.GMS_API_KEY

async function proxy(req: NextRequest, path: string[]) {
  if (!GMS_API_KEY) {
    return NextResponse.json(
      {
        status: 'error',
        error: {
          code: 'MISSING_API_KEY',
          message:
            'GMS_API_KEY is not configured on the server. Add it to .env.local and restart the dev server.',
        },
      },
      { status: 401 },
    )
  }

  const upstreamUrl = `${GMS_API_BASE}/${path.join('/')}${req.nextUrl.search}`

  const init: RequestInit = {
    method: req.method,
    headers: {
      Authorization: `Bearer ${GMS_API_KEY}`,
      'Content-Type': 'application/json',
    },
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.text()
  }

  const attempts = 4
  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25_000)
    try {
      const upstreamRes = await fetch(upstreamUrl, { ...init, signal: controller.signal })
      clearTimeout(timeout)
      const body = await upstreamRes.text()
      return new NextResponse(body, {
        status: upstreamRes.status,
        headers: {
          'Content-Type': upstreamRes.headers.get('content-type') ?? 'application/json',
        },
      })
    } catch (err) {
      clearTimeout(timeout)
      lastError = err
      console.error(`[gms proxy] attempt ${attempt}/${attempts} failed for ${upstreamUrl}:`, err)
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
      }
    }
  }

  return NextResponse.json(
    {
      status: 'error',
      error: {
        code: 'UPSTREAM_UNREACHABLE',
        message: 'Could not reach the GetMyShade API.',
        detail: lastError instanceof Error ? lastError.message : String(lastError),
      },
    },
    { status: 502 },
  )
}

type RouteContext = { params: Promise<{ path: string[] }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  return proxy(req, (await params).path)
}
export async function POST(req: NextRequest, { params }: RouteContext) {
  return proxy(req, (await params).path)
}
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  return proxy(req, (await params).path)
}
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  return proxy(req, (await params).path)
}
