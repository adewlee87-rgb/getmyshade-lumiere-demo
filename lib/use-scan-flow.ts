'use client'

import { useCallback, useState } from 'react'
import { useStore } from '@/components/store-provider'
import { getProductByShadeSku, priceForProductType, gmsMatchableProductTypes } from '@/lib/data'
import { gms, GmsError, newSessionId, type MatchResponse, type GmsMatch } from '@/lib/gms-client'

export type ScanPhase = 'idle' | 'scanning' | 'success' | 'error'

/**
 * Keeps a raw /api-v1-match response from ever surfacing a product type the
 * brand doesn't shade-match. The live catalog may still hold legacy products
 * (lipstick, primer, etc.) until it's re-seeded, so we also filter here rather
 * than trusting the server to only return matchable types. See
 * gmsMatchableProductTypes in lib/data.ts.
 */
function sanitizeMatchResponse(res: MatchResponse): MatchResponse {
  const matches = res.data.matches.filter((m) => gmsMatchableProductTypes.has(m.product_type as never))
  const no_match_product_types = res.meta.no_match_product_types?.filter((t) =>
    gmsMatchableProductTypes.has(t as never),
  )
  return {
    ...res,
    data: { ...res.data, matches },
    meta: { ...res.meta, no_match_product_types },
  }
}

/**
 * Shared state machine for anything that submits a face image to
 * POST /api-v1-match. Both the file-upload panel and the live-camera panel
 * feed it a base64 image and render the same scanning/error/success UI
 * (see components/scan-outcome.tsx) so the API-calling logic only exists once.
 */
export function useScanFlow() {
  const { addToCart } = useStore()
  const [phase, setPhase] = useState<ScanPhase>('idle')
  const [result, setResult] = useState<MatchResponse | null>(null)
  const [error, setError] = useState<GmsError | Error | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [addedSkus, setAddedSkus] = useState<Set<string>>(new Set())
  const [lastImage, setLastImage] = useState<string | null>(null)

  const runScan = useCallback(async (image: string) => {
    setLastImage(image)
    setPhase('scanning')
    setError(null)
    try {
      const sid = newSessionId()
      setSessionId(sid)
      const res = await gms.match(image, sid)
      setResult(sanitizeMatchResponse(res))
      setPhase('success')
    } catch (e) {
      setError(e instanceof GmsError ? e : e instanceof Error ? e : new Error(String(e)))
      setPhase('error')
    }
  }, [])

  const retry = useCallback(() => {
    if (lastImage) runScan(lastImage)
  }, [lastImage, runScan])

  const logEvent = useCallback(
    (type: 'view' | 'add_to_cart', sku: string) => {
      if (!sessionId) return
      gms.log(type, sessionId, sku, { source: 'beauty_match_workspace' }).catch(() => {})
    },
    [sessionId],
  )

  const handleAddToBag = useCallback(
    (match: GmsMatch, qty = 1) => {
      const local = getProductByShadeSku(match.sku)
      const productId = local ? local.product.id : `api-${match.sku}`
      const shadeName = local ? local.shade.name : match.shade_name
      addToCart(productId, shadeName, qty, {
        name: local?.product.name ?? match.product_name,
        image: match.image_url ?? local?.product.image,
        price: local?.product.price ?? priceForProductType(match.product_type),
        hex: match.hex_value,
      })
      setAddedSkus((prev) => new Set(prev).add(match.sku))
      logEvent('add_to_cart', match.sku)
    },
    [addToCart, logEvent],
  )

  const reset = useCallback(() => {
    setPhase('idle')
    setResult(null)
    setError(null)
    setSessionId(null)
    setAddedSkus(new Set())
    setLastImage(null)
  }, [])

  return {
    phase,
    result,
    error,
    sessionId,
    addedSkus,
    runScan,
    retry,
    logEvent,
    handleAddToBag,
    reset,
  }
}

export type ScanFlow = ReturnType<typeof useScanFlow>
