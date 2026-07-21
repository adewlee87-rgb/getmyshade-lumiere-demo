'use client'

// Typed browser-side client for the GetMyShade API. Every call goes to
// /api/gms/<path>, which is a same-origin Next.js route handler that holds
// the real API key server-side (see app/api/gms/[...path]/route.ts). This
// file never sees the key.
import type { GmsCatalogProduct } from '@/lib/data'

export type GmsErrorCode =
  | 'MISSING_API_KEY'
  | 'INVALID_KEY_FORMAT'
  | 'INVALID_API_KEY'
  | 'KEY_REVOKED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'BRAND_NOT_FOUND'
  | 'BRAND_INACTIVE'
  | 'NO_SUBSCRIPTION'
  | 'ORIGIN_NOT_ALLOWED'
  | 'CATALOG_LIMIT'
  | 'RATE_LIMIT_EXCEEDED'
  | 'RATE_LIMIT_BURST'
  | 'INVALID_JSON'
  | 'VALIDATION_ERROR'
  | 'INVALID_INPUT'
  | 'METHOD_NOT_ALLOWED'
  | 'CONFIG_ERROR'
  | 'INTERNAL_ERROR'
  | 'CREATE_FAILED'
  | 'UPDATE_FAILED'
  | 'FETCH_FAILED'
  | 'AI_QUOTA_EXCEEDED'
  | 'UPSTREAM_UNREACHABLE'
  | 'UNKNOWN'

// Section 8 of the integration guide, condensed to what the UI should tell a user.
export const GMS_ERROR_MESSAGES: Record<GmsErrorCode, string> = {
  MISSING_API_KEY: 'No GetMyShade API key is configured yet. Add GMS_API_KEY to .env.local and restart the server.',
  INVALID_KEY_FORMAT: "That key isn't in the sk_live_… format. Copy it again from the dashboard.",
  INVALID_API_KEY: 'That API key was not recognized. Verify it or generate a new one.',
  KEY_REVOKED: 'This API key has been revoked. Generate a new one in the dashboard.',
  UNAUTHORIZED: 'This endpoint requires a dashboard session, not an API key.',
  FORBIDDEN: "This resource doesn't belong to your brand.",
  BRAND_NOT_FOUND: 'This key is not attached to a brand. Contact support.',
  BRAND_INACTIVE: 'This brand is suspended. Contact support.',
  NO_SUBSCRIPTION: 'There is no active plan on this account. Activate one in the dashboard.',
  ORIGIN_NOT_ALLOWED: 'This origin is not on the allow-list in Dashboard → API → Settings.',
  CATALOG_LIMIT: "Your plan's catalog limit has been reached. Upgrade or remove inactive products.",
  RATE_LIMIT_EXCEEDED: 'Scan quota exhausted for this period. Try again next period or upgrade your plan.',
  RATE_LIMIT_BURST: 'Too many requests in a short window. Retrying automatically.',
  INVALID_JSON: 'The request body could not be parsed.',
  VALIDATION_ERROR: 'The request was rejected — check the field mentioned in the error message.',
  INVALID_INPUT: 'One of the submitted values was rejected.',
  METHOD_NOT_ALLOWED: 'Wrong HTTP method for this endpoint.',
  CONFIG_ERROR: 'The API is misconfigured upstream. Retrying, then contact support if this persists.',
  INTERNAL_ERROR: 'An unexpected error occurred upstream. Retrying automatically.',
  CREATE_FAILED: 'The upstream database insert failed. Retrying.',
  UPDATE_FAILED: 'The upstream database update failed. Retrying.',
  FETCH_FAILED: 'The upstream database read failed. Retrying.',
  AI_QUOTA_EXCEEDED: 'The upstream AI provider is temporarily out of capacity. Retrying shortly.',
  UPSTREAM_UNREACHABLE: 'Could not reach the GetMyShade API. Check your connection and try again.',
  UNKNOWN: 'Something unexpected happened talking to the GetMyShade API.',
}

export class GmsError extends Error {
  code: GmsErrorCode
  status: number
  constructor(code: string, status: number, message: string) {
    super(message)
    this.name = 'GmsError'
    this.code = (code in GMS_ERROR_MESSAGES ? code : 'UNKNOWN') as GmsErrorCode
    this.status = status
  }
  get friendlyMessage() {
    return GMS_ERROR_MESSAGES[this.code]
  }
}

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504])

async function request<T>(path: string, init: RequestInit = {}, attempt = 0): Promise<T> {
  const res = await fetch(`/api/gms/${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  })
  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = (json as { error?: { code?: string; message?: string } }).error ?? {}
    const code = err.code ?? 'UNKNOWN'
    const retryable = RETRYABLE_STATUSES.has(res.status) || code === 'AI_QUOTA_EXCEEDED'
    // Exponential backoff with jitter, per the guide's retry policy — max 4 attempts.
    if (retryable && attempt < 3) {
      const delay = Math.min(300 * 2 ** attempt, 30_000) + Math.random() * 500
      await new Promise((r) => setTimeout(r, delay))
      return request<T>(path, init, attempt + 1)
    }
    throw new GmsError(code, res.status, err.message ?? res.statusText)
  }
  return json as T
}

export type GmsAnalysis = {
  skin_tone: 'fair' | 'light' | 'medium' | 'tan' | 'deep' | 'rich'
  undertone: 'cool' | 'neutral' | 'warm'
  depth?: 'fair' | 'light' | 'medium' | 'tan' | 'deep'
  skin_type: 'dry' | 'normal' | 'combination' | 'oily'
  hex_color: string
  confidence_score: number
}

export type GmsMeta = {
  session_id?: string
  processing_time_ms: number
  api_version: string
  total_matches?: number
  matched_product_types?: string[]
  no_match_product_types?: string[]
}

export type AnalyzeResponse = { status: 'success'; data: GmsAnalysis; meta: GmsMeta }

export type GmsMatch = {
  product_name: string
  product_type: string
  shade_name: string
  sku: string
  hex_value: string
  image_url?: string
  match_score: number
  delta_e: number
}

export type MatchResponse = {
  status: 'success'
  data: { analysis: GmsAnalysis; matches: GmsMatch[] }
  meta: GmsMeta
}

export type BrandResponse = {
  brand: { id: string; name: string; website: string; status: string; created_at: string }
  subscription: {
    plan_tier: string
    billing_cycle: string
    status: string
    included_scans: number
    overage_rate: number
    current_period_start: string
    current_period_end: string
  }
  catalog: { total_products: number; total_variants: number }
}

export type UsageResponse = {
  plan_tier: string
  billing_period: { start: string; end: string }
  usage: {
    included_scans: number
    used_scans: number
    remaining_scans: number
    overage_scans: number
    overage_rate: number
    estimated_overage_cost: number
  }
  breakdown: Record<string, number>
}

export type GmsEventType = 'view' | 'add_to_cart' | 'purchase' | 'try_on' | 'share' | 'other'

export const gms = {
  brand: () => request<BrandResponse>('api-v1-brand'),
  usage: () => request<UsageResponse>('api-v1-usage'),
  listProducts: () => request<{ products: unknown[] }>('api-v1-products'),
  bulkCreate: (products: GmsCatalogProduct[]) =>
    request<{ results: { product_name: string; id: string; variants_count: number }[] }>(
      'api-v1-products/bulk',
      { method: 'POST', body: JSON.stringify({ products }) },
    ),
  analyze: (image: string, session_id?: string) =>
    request<AnalyzeResponse>('api-v1-analyze', {
      method: 'POST',
      body: JSON.stringify({ image, session_id }),
    }),
  match: (image: string, session_id?: string) =>
    request<MatchResponse>('api-v1-match', {
      method: 'POST',
      body: JSON.stringify({ image, session_id }),
    }),
  log: (event_type: GmsEventType, session_id: string, product_sku?: string, metadata?: object) =>
    request<{ status: string }>('api-v1-log', {
      method: 'POST',
      body: JSON.stringify({ event_type, session_id, product_sku, metadata }),
    }),
}

export function newSessionId() {
  return crypto.randomUUID()
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
