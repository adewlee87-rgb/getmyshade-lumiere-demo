export type Category =
  | 'Foundation'
  | 'Concealer'
  | 'Contour'
  | 'Highlighter'

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
]

// ---------- Shade generation ----------

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

function tintHex(hex: string, undertone: Shade['undertone'], strength = 1) {
  const { r, g, b } = hexToRgb(hex)
  if (undertone === 'Warm') return rgbToHex(r + 8 * strength, g + 3 * strength, b - 12 * strength)
  if (undertone === 'Cool') return rgbToHex(r - 6 * strength, g - 1 * strength, b + 10 * strength)
  return hex
}

function shiftLightness(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(r + amount, g + amount, b + amount)
}

function lerpHex(hexA: string, hexB: string, t: number) {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  return rgbToHex(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t)
}

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

function undertonesForDepth(depthT: number): Shade['undertone'][] {
  if (depthT > 0.1 && depthT < 0.9) return ['Cool', 'Neutral', 'Warm']
  return rng() > 0.5 ? ['Neutral', 'Warm'] : ['Neutral', 'Cool']
}

const foundationShades: Shade[] = depthStops.flatMap((stop, i) => {
  const depthT = i / (depthStops.length - 1)
  return undertonesForDepth(depthT).map((undertone) => ({
    name: `${stop.label} ${i + 1}${undertoneCode[undertone]}`,
    hex: tintHex(stop.hex, undertone, 0.75 + rng() * 0.5),
    undertone,
  }))
})

const concealerShades: Shade[] = depthStops.flatMap((stop, i) => {
  const depthT = i / (depthStops.length - 1)
  return undertonesForDepth(depthT).map((undertone) => ({
    name: `${stop.label} ${i + 1}${undertoneCode[undertone]}`,
    hex: shiftLightness(tintHex(stop.hex, undertone, 0.75 + rng() * 0.5), 9 + rng() * 6),
    undertone,
  }))
})

const contourShades: Shade[] = depthStops.map((stop, i) => ({
  name: `${stop.label} Sculpt ${i + 1}`,
  hex: tintHex(shiftLightness(stop.hex, -18 - rng() * 4), 'Cool', 0.85 + rng() * 0.3),
  undertone: 'Cool',
}))

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
    matched: false,
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
    matched: false,
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
    matched: false,
    tags: ['Bestseller'],
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
    matched: false,
    tags: ['Bestseller'],
  },
]

function skuPrefix(id: string) {
  return id
    .split('-')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

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

export function priceForProductType(gmsType: string): number | undefined {
  const category = (Object.keys(categoryToGmsType) as Category[]).find(
    (c) => categoryToGmsType[c] === gmsType,
  )
  if (!category) return undefined
  return products.find((p) => p.category === category)?.price
}

export const recommendedProducts = products.slice(0, 3)

// ---------- GetMyShade API catalog sync ----------
export type GmsProductType =
  | 'foundation'
  | 'concealer'
  | 'contour'
  | 'highlighter'

const categoryToGmsType: Record<Category, GmsProductType> = {
  Foundation: 'foundation',
  Concealer: 'concealer',
  Contour: 'contour',
  Highlighter: 'highlighter',
}

export const gmsMatchableCategories = new Set<Category>([
  'Foundation',
  'Concealer',
  'Highlighter',
  'Contour',
])

export function isGmsMatchable(category: Category) {
  return gmsMatchableCategories.has(category)
}

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
    description: 'A four-step routine for effortless, radiant complexion matching.',
    image: '/images/hero-editorial.png',
    productIds: [
      'lumiere-silk-foundation',
      'lumiere-radiant-concealer',
      'lumiere-sculpt-contour',
      'lumiere-glow-highlighter',
    ],
  },
  {
    id: 'soft-sculpt',
    title: 'Soft Sculpt Edit',
    description: 'Dimensional definition for a sculpted, editorial finish.',
    image: '/images/product-contour.png',
    productIds: ['lumiere-sculpt-contour', 'lumiere-glow-highlighter'],
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
    total: 109,
    items: [
      { productId: 'lumiere-silk-foundation', qty: 1, shade: 'Light Medium 9W' },
      { productId: 'lumiere-radiant-concealer', qty: 1, shade: 'Light Medium 9N' },
      { productId: 'lumiere-glow-highlighter', qty: 1, shade: 'Champagne' },
    ],
  },
  {
    id: 'LUM-10312',
    date: 'Jan 18, 2026',
    status: 'Shipped',
    total: 62,
    items: [
      { productId: 'lumiere-sculpt-contour', qty: 1, shade: 'Light Sculpt 5' },
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
