'use client'

import * as React from 'react'
import { products, orders as seedOrders, type Product, type Order } from '@/lib/data'

export type CartItem = {
  productId: string
  shade: string
  qty: number
  /** Self-contained display data for items that didn't come from the local
   * catalog (e.g. a real GetMyShade API match) — falls back to a local
   * product lookup by productId when these are omitted. */
  name?: string
  image?: string
  price?: number
  hex?: string
}

export type ShippingDetails = {
  fullName: string
  address: string
  city: string
  postalCode: string
  country: string
}

type StoreContextValue = {
  cart: CartItem[]
  wishlist: string[]
  orders: Order[]
  addToCart: (
    productId: string,
    shade: string,
    qty?: number,
    details?: { name?: string; image?: string; price?: number; hex?: string },
  ) => void
  removeFromCart: (productId: string, shade: string) => void
  updateQty: (productId: string, shade: string, qty: number) => void
  clearCart: () => void
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  placeOrder: (shipping: ShippingDetails) => Order
  cartCount: number
  cartSubtotal: number
}

const StoreContext = React.createContext<StoreContextValue | null>(null)

const priceOf = (id: string) => products.find((p) => p.id === id)?.price ?? 0

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [wishlist, setWishlist] = React.useState<string[]>([
    'lumiere-satin-lipstick',
    'lumiere-cheek-blush',
  ])
  const [orders, setOrders] = React.useState<Order[]>(seedOrders)

  const addToCart = React.useCallback(
    (
      productId: string,
      shade: string,
      qty = 1,
      details?: { name?: string; image?: string; price?: number; hex?: string },
    ) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.productId === productId && i.shade === shade)
        if (existing) {
          return prev.map((i) =>
            i.productId === productId && i.shade === shade ? { ...i, qty: i.qty + qty } : i,
          )
        }
        return [...prev, { productId, shade, qty, ...details }]
      })
    },
    [],
  )

  const removeFromCart = React.useCallback((productId: string, shade: string) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.shade === shade)))
  }, [])

  const updateQty = React.useCallback((productId: string, shade: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.shade === shade ? { ...i, qty: Math.max(0, qty) } : i,
        )
        .filter((i) => i.qty > 0),
    )
  }, [])

  const clearCart = React.useCallback(() => setCart([]), [])

  const toggleWishlist = React.useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }, [])

  const isWishlisted = React.useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  )

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const cartSubtotal = cart.reduce((sum, i) => sum + (i.price ?? priceOf(i.productId)) * i.qty, 0)

  const placeOrder = React.useCallback(
    (_shipping: ShippingDetails) => {
      const newOrder: Order = {
        id: `LUM-${Math.floor(10000 + Math.random() * 89999)}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        status: 'Processing',
        total: cartSubtotal,
        items: cart.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          shade: i.shade,
          name: i.name,
          image: i.image,
          price: i.price,
          hex: i.hex,
        })),
      }
      setOrders((prev) => [newOrder, ...prev])
      setCart([])
      return newOrder
    },
    [cart, cartSubtotal],
  )

  const value: StoreContextValue = {
    cart,
    wishlist,
    orders,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    toggleWishlist,
    isWishlisted,
    placeOrder,
    cartCount,
    cartSubtotal,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

type DisplayableItem = {
  productId: string
  shade: string
  name?: string
  image?: string
  price?: number
  hex?: string
}

export function cartItemProduct(item: DisplayableItem): Product | undefined {
  return products.find((p) => p.id === item.productId)
}

/** Resolves what to actually render for a cart or order item — its own
 * embedded name/image/price/hex if present (items added from a real API
 * match), falling back to a local catalog lookup otherwise. */
export function cartItemDisplay(item: DisplayableItem) {
  const product = cartItemProduct(item)
  const shade = product?.shades.find((s) => s.name === item.shade)
  return {
    name: item.name ?? product?.name ?? item.shade,
    image: item.image ?? product?.image ?? '/placeholder.svg',
    price: item.price ?? product?.price ?? 0,
    hex: item.hex ?? shade?.hex,
    href: product ? `/product/${product.id}` : undefined,
  }
}
