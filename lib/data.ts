export type Category =
  | 'Foundation'
  | 'Concealer'
  | 'Contour'
  | 'Highlighter'
  | 'Blush'
  | 'Powder'
  | 'Primer'
  | 'Setting Spray'
  | 'Lipstick'
  | 'Tools'

export type Shade = {
  name: string
  hex: string
  undertone: 'Warm' | 'Cool' | 'Neutral'
  /** Stable catalog SKU. Assigned automatically below if omitted — used to sync
   * this catalog with the GetMyShade API and to map its match results back to
   * local products. */
  sku?: string
}

export type Product = {
  id: string
  name: string
  category: Category
  price: number
  rating: number
  reviews: number
  image: string
  description: string
  shades: Shade[]
  finish?: string
  coverage?: string
  bestFor: string[]
  matched?: boolean
  matchReason?: string
  tags?: string[]
}

export const categories: { name: Category; blurb: string }[] = [
  { name: 'Foundation', blurb: 'Complexion base' },
  { name: 'Concealer', blurb: 'Targeted coverage' },
  { name: 'Contour', blurb: 'Sculpt & define' },
  { name: 'Highlighter', blurb: 'Luminous glow' },
  { name: 'Blush', blurb: 'Flush of color' },
  { name: 'Powder', blurb: 'Set & smooth' },
  { name: 'Primer', blurb: 'Perfect canvas' },
  { name: 'Setting Spray', blurb: 'Lock it in' },
  { name: 'Lipstick', blurb: 'Statement lips' },
  { name: 'Tools', blurb: 'Application' },
]

// ---------- Shade generation ----------
// A real inclusive brand needs deep enough shade coverage that GetMyShade's
// CIEDE2000 matching can find a genuinely close variant for any detected skin
// tone/undertone/depth — not just a handful of demo swatches. Foundation,
// concealer, contour, and powder are generated across a fair→deep depth
// spectrum in all three undertones instead of hand-authored one-offs.

function clampChannel(v: number) {
  return Math.max(0, Math.min(255, Math.round(v)))
}

function hexToRgb(hex: string) {
  const num = parseInt(hex.slice(1), 16)
  return { r: (num >> 16) & 0xff, g: (num >> 8) & 0xff, b: num & 0xff }
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => clampChannel(v).toString(16).padStart(2, '0')).join('')}`
}

/** Shifts a base tone warmer (more red/yellow) or cooler (more pink/blue).
 * `strength` varies per generated shade so neighboring shades aren't spaced
 * with mathematically perfect, unrealistic evenness. */
function tintHex(hex: string, undertone: Shade['undertone'], strength = 1) {
  const { r, g, b } = hexToRgb(hex)
  if (undertone === 'Warm') return rgbToHex(r + 8 * strength, g + 3 * strength, b - 12 * strength)
  if (undertone === 'Cool') return rgbToHex(r - 6 * strength, g - 1 * strength, b + 10 * strength)
  return hex
}

/** Positive amount lightens, negative darkens, all channels evenly. */
function shiftLightness(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(r + amount, g + amount, b + amount)
}

function lerpHex(hexA: string, hexB: string, t: number) {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  return rgbToHex(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t)
}

// Deterministic PRNG (fixed seed) so the "organic" irregularity below is
// stable across builds — this data gets synced to the live GetMyShade
// catalog by SKU, so it can't reshuffle every time the site rebuilds.
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rng = mulberry32(20260714)

const undertoneCode: Record<Shade['undertone'], string> = { Cool: 'C', Neutral: 'N', Warm: 'W' }

// 12 anchor tones from fairest to deepest.
const depthAnchors: { label: string; hex: string }[] = [
  { label: 'Porcelain', hex: '#fbe3d0' },
  { label: 'Ivory', hex: '#f6d8bb' },
  { label: 'Alabaster', hex: '#f0cca8' },
  { label: 'Fair', hex: '#e9bd92' },
  { label: 'Light', hex: '#deac7d' },
  { label: 'Light Medium', hex: '#cf9968' },
  { label: 'Medium', hex: '#bd8657' },
  { label: 'Medium Tan', hex: '#a86f45' },
  { label: 'Tan', hex: '#8f5a36' },
  { label: 'Deep', hex: '#74472a' },
  { label: 'Rich', hex: '#5a3620' },
  { label: 'Deep Ebony', hex: '#3f2416' },
]

// Real shade fans aren't a perfectly even grid — interpolate to a finer,
// slightly jittered 20-stop scale so matching gets tested against realistic
// density and noise instead of a mathematically uniform gradient.
const depthStops: { label: string; hex: string }[] = Array.from({ length: 20 }, (_, i) => {
  const segment = (i / 19) * (depthAnchors.length - 1)
  const lo = Math.floor(segment)
  const hi = Math.min(lo + 1, depthAnchors.length - 1)
  const localT = segment - lo
  const base = lerpHex(depthAnchors[lo].hex, depthAnchors[hi].hex, localT)
  const { r, g, b } = hexToRgb(base)
  const jitter = () => Math.round((rng() - 0.5) * 6)
  return {
    label: (localT < 0.5 ? depthAnchors[lo] : depthAnchors[hi]).label,
    hex: rgbToHex(r + jitter(), g + jitter(), b + jitter()),
  }
})

/** Real ranges don't offer all 3 undertones at every depth — the most
 * common mid-range depths get full Cool/Neutral/Warm coverage, while the
 * lightest and deepest few stops (lower real-world demand, historically
 * under-invested in by most brands) get a narrower 2-undertone selection. */
function undertonesForDepth(depthT: number): Shade['undertone'][] {
  if (depthT > 0.1 && depthT < 0.9) return ['Cool', 'Neutral', 'Warm']
  return rng() > 0.5 ? ['Neutral', 'Warm'] : ['Neutral', 'Cool']
}

// Foundation and concealer are the products GetMyShade actually shade-matches
// most heavily, so they need real breadth — roughly 45-50 shades each,
// unevenly spaced like an actual inclusive range rather than a clean grid.
const foundationShades: Shade[] = depthStops.flatMap((stop, i) => {
  const depthT = i / (depthStops.length - 1)
  return undertonesForDepth(depthT).map((undertone) => ({
    name: `${stop.label} ${i + 1}${undertoneCode[undertone]}`,
    hex: tintHex(stop.hex, undertone, 0.75 + rng() * 0.5),
    undertone,
  }))
})

// Concealer mirrors the foundation range, lightened a touch (the classic
// "one shade lighter, for a lifted look" formulation), with its own jitter.
const concealerShades: Shade[] = depthStops.flatMap((stop, i) => {
  const depthT = i / (depthStops.length - 1)
  return undertonesForDepth(depthT).map((undertone) => ({
    name: `${stop.label} ${i + 1}${undertoneCode[undertone]}`,
    hex: shiftLightness(tintHex(stop.hex, undertone, 0.75 + rng() * 0.5), 9 + rng() * 6),
    undertone,
  }))
})

// Contour needs to read as a believable shadow on the wearer's own depth, so
// it spans the same 20 stops, cooled and darkened rather than warmed.
const contourShades: Shade[] = depthStops.map((stop, i) => ({
  name: `${stop.label} Sculpt ${i + 1}`,
  hex: tintHex(shiftLightness(stop.hex, -18 - rng() * 4), 'Cool', 0.85 + rng() * 0.3),
  undertone: 'Cool',
}))

const powderShades: Shade[] = [
  { name: 'Translucent', hex: '#efe2d3', undertone: 'Neutral' },
  { name: 'Fair', hex: '#f0cda8', undertone: 'Neutral' },
  { name: 'Light', hex: '#e6bd90', undertone: 'Warm' },
  { name: 'Light Medium', hex: '#d9aa78', undertone: 'Neutral' },
  { name: 'Medium', hex: '#c4925f', undertone: 'Warm' },
  { name: 'Medium Tan', hex: '#a97a4a', undertone: 'Neutral' },
  { name: 'Tan', hex: '#8f6238', undertone: 'Warm' },
  { name: 'Deep', hex: '#6f4a29', undertone: 'Neutral' },
  { name: 'Rich Deep', hex: '#4f331b', undertone: 'Warm' },
]

// Widened to cover deep skin tones too (the original 5 skewed light-medium
// and left no genuine match for deeper complexions during live testing).
const highlighterShades: Shade[] = [
  { name: 'Champagne', hex: '#e8c98f', undertone: 'Warm' },
  { name: 'Rose Gold', hex: '#e0a98f', undertone: 'Warm' },
  { name: 'Pearl', hex: '#edd7c4', undertone: 'Cool' },
  { name: 'Bronze Glow', hex: '#c98f5c', undertone: 'Warm' },
  { name: 'Moonlight', hex: '#e6e0d6', undertone: 'Neutral' },
  { name: 'Golden Bronze', hex: '#a97544', undertone: 'Warm' },
  { name: 'Copper Glow', hex: '#8a5636', undertone: 'Warm' },
  { name: 'Amber Lit', hex: '#6b4128', undertone: 'Neutral' },
]

const lipShades: Shade[] = [
  { name: 'Bare Rose', hex: '#c98a80', undertone: 'Neutral' },
  { name: 'Terracotta', hex: '#b5654a', undertone: 'Warm' },
  { name: 'Mauve Muse', hex: '#a35f66', undertone: 'Cool' },
  { name: 'Classic Red', hex: '#9e2b25', undertone: 'Warm' },
  { name: 'Berry Kiss', hex: '#8c3a52', undertone: 'Cool' },
  { name: 'Nude Blush', hex: '#c99a86', undertone: 'Neutral' },
  { name: 'Deep Plum', hex: '#5e2f42', undertone: 'Cool' },
  { name: 'Coral Pop', hex: '#e2694f', undertone: 'Warm' },
]

const blushShades: Shade[] = [
  { name: 'Peach Bloom', hex: '#e0967a', undertone: 'Warm' },
  { name: 'Rose Petal', hex: '#d78a90', undertone: 'Cool' },
  { name: 'Soft Coral', hex: '#e29685', undertone: 'Neutral' },
  { name: 'Berry Flush', hex: '#c05f6d', undertone: 'Cool' },
  { name: 'Terracotta Glow', hex: '#c97452', undertone: 'Warm' },
  { name: 'Mauve Muse', hex: '#b07184', undertone: 'Cool' },
]

export const products: Product[] = [
  {
    id: 'lumiere-silk-foundation',
    name: 'Silk Veil Serum Foundation',
    category: 'Foundation',
    price: 48,
    rating: 4.8,
    reviews: 2140,
    image: '/images/product-foundation.png',
    description:
      'A weightless, skin-perfecting serum foundation with buildable medium coverage and a natural satin finish. Infused with hyaluronic acid for all-day comfort.',
    shades: foundationShades,
    finish: 'Natural Satin',
    coverage: 'Medium, buildable',
    bestFor: ['Normal to dry skin', 'Redness', 'Uneven tone'],
    matched: true,
    matchReason:
      'Matched to your Warm undertone and Combination skin type. Shade Light Medium 9W aligns with your analyzed skin tone.',
    tags: ['Bestseller', 'Vegan'],
  },
  {
    id: 'lumiere-radiant-concealer',
    name: 'Luminous Lift Concealer',
    category: 'Concealer',
    price: 29,
    rating: 4.7,
    reviews: 1580,
    image: '/images/product-concealer.png',
    description:
      'A crease-proof, brightening concealer that covers dark circles and blemishes while hydrating delicate under-eye skin.',
    shades: concealerShades,
    finish: 'Radiant',
    coverage: 'Medium to full',
    bestFor: ['Dark circles', 'Blemishes', 'Brightening'],
    matched: true,
    matchReason:
      'Recommended to target the under-eye concern flagged in your analysis. One shade lighter than your foundation for a lifted look.',
    tags: ['Bestseller'],
  },
  {
    id: 'lumiere-sculpt-contour',
    name: 'Soft Sculpt Cream Contour',
    category: 'Contour',
    price: 32,
    rating: 4.6,
    reviews: 890,
    image: '/images/product-contour.png',
    description:
      'A blendable cream contour stick that adds natural dimension. Cool-toned taupe mimics a true shadow for believable structure.',
    shades: contourShades,
    finish: 'Matte',
    coverage: 'Sheer, buildable',
    bestFor: ['Oval face shape', 'Sculpting', 'Definition'],
    matched: true,
    matchReason:
      'Chosen for your Oval face shape to gently enhance cheekbones without harsh lines.',
  },
  {
    id: 'lumiere-glow-highlighter',
    name: 'Liquid Aura Highlighter',
    category: 'Highlighter',
    price: 30,
    rating: 4.9,
    reviews: 3020,
    image: '/images/product-highlighter.png',
    description:
      'A champagne-gold liquid highlighter that melts into skin for a lit-from-within glow. Wear alone or mix with foundation.',
    shades: highlighterShades,
    finish: 'Dewy',
    coverage: 'Sheer',
    bestFor: ['Glow', 'Warm undertones', 'Dry skin'],
    matched: true,
    matchReason:
      'Champagne complements your warm undertone for a harmonious, radiant highlight.',
    tags: ['Bestseller'],
  },
  {
    id: 'lumiere-cheek-blush',
    name: 'Velvet Cheek Powder Blush',
    category: 'Blush',
    price: 26,
    rating: 4.7,
    reviews: 1210,
    image: '/images/product-blush.png',
    description:
      'A silky, pigment-rich powder blush that blends seamlessly for a soft, healthy flush that lasts.',
    shades: blushShades,
    finish: 'Soft Matte',
    coverage: 'Buildable',
    bestFor: ['Flush of color', 'All skin tones'],
    matched: true,
    matchReason: 'Peach Bloom flatters your warm undertone for a lit, natural flush.',
  },
  {
    id: 'lumiere-set-powder',
    name: 'Blur & Set Loose Powder',
    category: 'Powder',
    price: 34,
    rating: 4.6,
    reviews: 760,
    image: '/images/product-powder.png',
    description:
      'A finely-milled translucent powder that blurs pores and controls shine without a cakey finish.',
    shades: powderShades,
    finish: 'Soft Focus',
    coverage: 'Sheer',
    bestFor: ['Combination skin', 'Shine control', 'Setting'],
    matched: true,
    matchReason:
      'Recommended for your Combination skin to control shine in the T-zone identified in your analysis.',
  },
  {
    id: 'lumiere-prime-primer',
    name: 'Smooth Canvas Blurring Primer',
    category: 'Primer',
    price: 38,
    rating: 4.8,
    reviews: 1440,
    image: '/images/product-primer.png',
    description:
      'A silky primer that smooths texture, blurs pores, and extends makeup wear for a flawless base.',
    shades: [{ name: 'Universal', hex: '#f3e7db', undertone: 'Neutral' }],
    finish: 'Natural',
    coverage: 'n/a',
    bestFor: ['Large pores', 'Combination skin', 'Longwear'],
    matched: false,
  },
  {
    id: 'lumiere-lock-spray',
    name: 'All-Day Lock Setting Spray',
    category: 'Setting Spray',
    price: 28,
    rating: 4.7,
    reviews: 980,
    image: '/images/product-powder.png',
    description:
      'A weightless mist that locks makeup in place for up to 16 hours with a natural finish.',
    shades: [{ name: 'Universal', hex: '#e9ddd0', undertone: 'Neutral' }],
    finish: 'Natural',
    coverage: 'n/a',
    bestFor: ['Longwear', 'All skin types'],
    matched: false,
  },
  {
    id: 'lumiere-satin-lipstick',
    name: 'Satin Muse Lipstick',
    category: 'Lipstick',
    price: 27,
    rating: 4.8,
    reviews: 2560,
    image: '/images/product-lipstick.png',
    description:
      'A creamy, comfortable lipstick with satin finish and full color payoff in curated flattering shades.',
    shades: lipShades,
    finish: 'Satin',
    coverage: 'Full',
    bestFor: ['Statement lips', 'Everyday wear'],
    matched: true,
    matchReason: 'Terracotta harmonizes with your warm undertone for a signature everyday lip.',
    tags: ['Bestseller'],
  },
  {
    id: 'lumiere-brush-set',
    name: 'Essential Face Brush Set',
    category: 'Tools',
    price: 64,
    rating: 4.9,
    reviews: 640,
    image: '/images/product-tool.png',
    description:
      'A five-piece set of ultra-soft vegan brushes for foundation, concealer, blush, contour, and powder.',
    shades: [{ name: 'Cream / Rose Gold', hex: '#e3c6a8', undertone: 'Neutral' }],
    bestFor: ['Application', 'Blending'],
    matched: false,
    tags: ['Vegan'],
  },
]

function skuPrefix(id: string) {
  return id
    .split('-')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

// Assign a stable, deterministic SKU to every shade that doesn't already have one.
for (const p of products) {
  p.shades.forEach((s, i) => {
    if (!s.sku) s.sku = `${skuPrefix(p.id)}-${(i + 1) * 10}`
  })
}

export function getProduct(id: string) {
  return products.find((p) => p.id === id)
}

export function getProductByShadeSku(sku: string) {
  for (const p of products) {
    const shade = p.shades.find((s) => s.sku === sku)
    if (shade) return { product: p, shade }
  }
  return undefined
}

/** Best-effort price for a GetMyShade API match whose SKU has no local
 * counterpart — the API itself doesn't return pricing, so this borrows the
 * price of a local product in the same category as a stand-in. */
export function priceForProductType(gmsType: string): number | undefined {
  const category = (Object.keys(categoryToGmsType) as Category[]).find(
    (c) => categoryToGmsType[c] === gmsType,
  )
  if (!category) return undefined
  return products.find((p) => p.category === category)?.price
}

export const recommendedProducts = products.filter((p) => p.matched)

// ---------- GetMyShade API catalog sync ----------
// Maps this storefront's categories to the product_type enum the GetMyShade
// API expects (foundation | concealer | powder | blush | bronzer | contour |
// lipstick | other), and serializes shades into its bulk-create payload shape.
export type GmsProductType =
  | 'foundation'
  | 'concealer'
  | 'powder'
  | 'blush'
  | 'bronzer'
  | 'contour'
  | 'lipstick'
  | 'other'

const categoryToGmsType: Record<Category, GmsProductType> = {
  Foundation: 'foundation',
  Concealer: 'concealer',
  Contour: 'contour',
  Highlighter: 'other',
  Blush: 'blush',
  Powder: 'powder',
  Primer: 'other',
  'Setting Spray': 'other',
  Lipstick: 'lipstick',
  Tools: 'other',
}

// GetMyShade only shade-matches true complexion products. Everything else
// (lipstick, primer, setting spray, powder, blush, tools) still lives in the
// brand's own catalog and storefront — it just never gets pushed to the match
// API, so a scan can't come back recommending a lipstick or a primer as a
// "shade match". Scope confirmed with the client, Aug 2026.
export const gmsMatchableCategories = new Set<Category>([
  'Foundation',
  'Concealer',
  'Highlighter',
  'Contour',
])

export function isGmsMatchable(category: Category) {
  return gmsMatchableCategories.has(category)
}

// The GetMyShade product_type values that correspond to the matchable
// categories above. Note 'Highlighter' maps to 'other', so 'other' is allowed
// here — the category-level filter on the sync payload is what keeps primer /
// setting spray / tools (also 'other') out of the match catalog.
export const gmsMatchableProductTypes = new Set<GmsProductType>(
  [...gmsMatchableCategories].map((c) => categoryToGmsType[c]),
)

export type GmsCatalogProduct = {
  product_name: string
  product_type: GmsProductType
  variants: {
    shade_name: string
    sku: string
    hex_value: string
    undertone: 'cool' | 'neutral' | 'warm'
  }[]
}

export function toGmsCatalogPayload(): GmsCatalogProduct[] {
  return products
    .filter((p) => p.shades.length > 0 && gmsMatchableCategories.has(p.category))
    .map((p) => ({
      product_name: p.name,
      product_type: categoryToGmsType[p.category],
      variants: p.shades.map((s) => ({
        shade_name: s.name,
        sku: s.sku!,
        hex_value: s.hex,
        undertone: s.undertone.toLowerCase() as 'cool' | 'neutral' | 'warm',
      })),
    }))
}

// ---------- Beauty Analysis (mock API result) ----------
export type BeautyProfile = {
  skinTone: string
  undertone: string
  skinType: string
  faceShape: string
  concerns: string[]
  confidence: number
  recommendedShade: string
  lastAnalyzed: string
}

export const beautyProfile: BeautyProfile = {
  skinTone: 'Medium (Sand)',
  undertone: 'Warm',
  skinType: 'Combination',
  faceShape: 'Oval',
  concerns: ['Under-eye circles', 'T-zone shine', 'Uneven tone'],
  confidence: 94,
  recommendedShade: 'Light Medium 9W',
  lastAnalyzed: 'Feb 14, 2026',
}

// ---------- Collections ----------
export type Collection = {
  id: string
  title: string
  description: string
  image: string
  productIds: string[]
}

export const collections: Collection[] = [
  {
    id: 'everyday-glow',
    title: 'The Everyday Glow',
    description: 'A five-step routine for effortless, radiant no-makeup makeup.',
    image: '/images/hero-editorial.png',
    productIds: [
      'lumiere-prime-primer',
      'lumiere-silk-foundation',
      'lumiere-radiant-concealer',
      'lumiere-cheek-blush',
      'lumiere-glow-highlighter',
    ],
  },
  {
    id: 'soft-sculpt',
    title: 'Soft Sculpt Edit',
    description: 'Dimensional definition for a sculpted, editorial finish.',
    image: '/images/product-contour.png',
    productIds: ['lumiere-sculpt-contour', 'lumiere-glow-highlighter', 'lumiere-set-powder'],
  },
  {
    id: 'warm-lip-story',
    title: 'Warm Lip Story',
    description: 'Terracotta and rose tones curated for warm undertones.',
    image: '/images/product-lipstick.png',
    productIds: ['lumiere-satin-lipstick', 'lumiere-cheek-blush'],
  },
]

// ---------- Orders ----------
export type OrderItem = {
  productId: string
  qty: number
  shade: string
  name?: string
  image?: string
  price?: number
  hex?: string
}

export type Order = {
  id: string
  date: string
  status: 'Delivered' | 'Shipped' | 'Processing'
  total: number
  items: OrderItem[]
}

export const orders: Order[] = [
  {
    id: 'LUM-10428',
    date: 'Feb 2, 2026',
    status: 'Delivered',
    total: 104,
    items: [
      { productId: 'lumiere-silk-foundation', qty: 1, shade: 'Light Medium 9W' },
      { productId: 'lumiere-radiant-concealer', qty: 1, shade: 'Light Medium 9N' },
      { productId: 'lumiere-cheek-blush', qty: 1, shade: 'Peach Bloom' },
    ],
  },
  {
    id: 'LUM-10312',
    date: 'Jan 18, 2026',
    status: 'Shipped',
    total: 57,
    items: [
      { productId: 'lumiere-satin-lipstick', qty: 1, shade: 'Terracotta' },
      { productId: 'lumiere-glow-highlighter', qty: 1, shade: 'Champagne' },
    ],
  },
]

// ---------- Education ----------
export type Article = {
  id: string
  title: string
  category: string
  excerpt: string
  readTime: string
  image: string
}

export const articles: Article[] = [
  {
    id: 'find-your-undertone',
    title: 'How to Find Your Undertone',
    category: 'Skin Basics',
    excerpt:
      'Warm, cool, or neutral? Learn the simple tests that decode your undertone and unlock perfect shade matching.',
    readTime: '4 min read',
    image: '/images/hero-editorial.png',
  },
  {
    id: 'foundation-finish-guide',
    title: 'Matte vs. Dewy: Choosing Your Finish',
    category: 'Complexion',
    excerpt: 'Match your foundation finish to your skin type for a base that looks like skin.',
    readTime: '5 min read',
    image: '/images/product-foundation.png',
  },
  {
    id: 'contour-by-face-shape',
    title: 'Contouring by Face Shape',
    category: 'Technique',
    excerpt: 'Oval, round, or heart? Placement is everything. A guide to sculpting your features.',
    readTime: '6 min read',
    image: '/images/product-contour.png',
  },
]

export function formatPrice(n: number) {
  return `$${n.toFixed(0)}`
}

// ---------- AI Match Quiz ----------
export type MatchQuestion = {
  id: string
  category: string
  title: string
  description: string
  options: { value: string; label: string; hint?: string }[]
}

export const matchQuestions: MatchQuestion[] = [
  {
    id: 'skinType',
    category: 'Skin',
    title: 'How would you describe your skin?',
    description: 'This helps us tune finish and longevity for your base.',
    options: [
      { value: 'dry', label: 'Dry', hint: 'Feels tight, flaky patches' },
      { value: 'combination', label: 'Combination', hint: 'Oily T-zone, dry cheeks' },
      { value: 'oily', label: 'Oily', hint: 'Shine throughout the day' },
      { value: 'normal', label: 'Balanced', hint: 'Rarely oily or dry' },
    ],
  },
  {
    id: 'undertone',
    category: 'Undertone',
    title: 'What is your undertone?',
    description: 'Check the veins on your wrist, or the metal that flatters you most.',
    options: [
      { value: 'warm', label: 'Warm', hint: 'Golden, gold jewelry suits you' },
      { value: 'cool', label: 'Cool', hint: 'Pink/blue, silver suits you' },
      { value: 'neutral', label: 'Neutral', hint: 'A mix of both' },
      { value: 'unsure', label: 'Not sure', hint: "We'll estimate for you" },
    ],
  },
  {
    id: 'coverage',
    category: 'Coverage',
    title: 'How much coverage do you prefer?',
    description: 'From your-skin-but-better to full glam.',
    options: [
      { value: 'sheer', label: 'Sheer', hint: 'Natural, barely there' },
      { value: 'medium', label: 'Medium', hint: 'Evens tone, buildable' },
      { value: 'full', label: 'Full', hint: 'Complete coverage' },
    ],
  },
  {
    id: 'finish',
    category: 'Finish',
    title: 'Which finish do you love?',
    description: 'The final look of your complexion.',
    options: [
      { value: 'matte', label: 'Matte', hint: 'Shine-free, velvety' },
      { value: 'natural', label: 'Natural', hint: 'Skin-like satin' },
      { value: 'dewy', label: 'Dewy', hint: 'Luminous, glowy' },
    ],
  },
  {
    id: 'concern',
    category: 'Concerns',
    title: 'What would you most like to address?',
    description: "We'll prioritize products that target this.",
    options: [
      { value: 'redness', label: 'Redness', hint: 'Even out tone' },
      { value: 'darkCircles', label: 'Dark circles', hint: 'Brighten under-eyes' },
      { value: 'pores', label: 'Pores & texture', hint: 'Smooth & blur' },
      { value: 'glow', label: 'Dullness', hint: 'Add radiance' },
    ],
  },
]
