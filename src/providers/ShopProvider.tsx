'use client'

// Cart + selected vehicle, kept in the browser (localStorage, wrapped in
// try/catch: private mode or blocked storage must never break the page).
// NB: prices here are for display only — the server must re-price the cart
// from the catalogue when the order is actually placed.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import type { CartLine, Vehicle } from '@/lib/shop/types'
import { Icon } from '@/components/ui/Icon'
import { formatEUR } from '@/lib/shop/format'

const STORAGE_KEY = 'ea92-shop-v1'

interface StoredState {
  cart: CartLine[]
  vehicle: Vehicle | null
}

interface ShopContextValue {
  cart: CartLine[]
  count: number
  subtotalTTC: number
  depositsTTC: number // refundable "consignes", kept apart from the subtotal
  vehicle: Vehicle | null
  hydrated: boolean
  addToCart: (line: Omit<CartLine, 'qty'>, qty?: number) => void
  restoreCart: (lines: CartLine[]) => void
  setQty: (slug: string, reference: string, qty: number) => void
  removeLine: (slug: string, reference: string) => void
  clearCart: () => void
  setVehicle: (v: Vehicle | null) => void
}

const ShopContext = createContext<ShopContextValue | null>(null)

const sameLine = (a: Pick<CartLine, 'slug' | 'reference'>, slug: string, reference: string) =>
  a.slug === slug && a.reference === reference

function readStorage(): StoredState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredState) : null
  } catch {
    return null
  }
}

function writeStorage(state: StoredState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* storage unavailable — the cart simply won't persist */
  }
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([])
  const [vehicle, setVehicleState] = useState<Vehicle | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<CartLine | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load once on mount (client only).
  useEffect(() => {
    const stored = readStorage()
    if (stored) {
      // Lines saved by an earlier version of the site carried the part's
      // reference ("tecdoc-…"): they can no longer be paid for and must not be shown.
      setCart(Array.isArray(stored.cart) ? stored.cart.filter((l) => typeof l?.slug === 'string' && !l.slug.startsWith('tecdoc-')) : [])
      setVehicleState(stored.vehicle ?? null)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) writeStorage({ cart, vehicle })
  }, [cart, vehicle, hydrated])

  const addToCart = useCallback((line: Omit<CartLine, 'qty'>, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((l) => sameLine(l, line.slug, line.reference))
      if (existing) {
        return prev.map((l) => (l === existing ? { ...l, qty: Math.min(99, l.qty + qty) } : l))
      }
      return [...prev, { ...line, qty }]
    })
    setToast({ ...line, qty })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }, [])

  const setQty = useCallback((slug: string, reference: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => !sameLine(l, slug, reference))
        : prev.map((l) => (sameLine(l, slug, reference) ? { ...l, qty: Math.min(99, qty) } : l)),
    )
  }, [])

  const removeLine = useCallback((slug: string, reference: string) => {
    setCart((prev) => prev.filter((l) => !sameLine(l, slug, reference)))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])
  const setVehicle = useCallback((v: Vehicle | null) => setVehicleState(v), [])

  // Cart recovery link: re-priced lines from the server replace the matching
  // lines (current price wins) and are added when missing. No toast.
  const restoreCart = useCallback((lines: CartLine[]) => {
    setCart((prev) => {
      const kept = prev.filter((p) => !lines.some((l) => sameLine(p, l.slug, l.reference)))
      return [...kept, ...lines]
    })
  }, [])

  const value = useMemo<ShopContextValue>(() => {
    const count = cart.reduce((n, l) => n + l.qty, 0)
    const subtotalTTC = Math.round(cart.reduce((s, l) => s + l.priceTTC * l.qty, 0) * 100) / 100
    const depositsTTC = Math.round(cart.reduce((s, l) => s + (l.depositTTC ?? 0) * l.qty, 0) * 100) / 100
    return { cart, count, subtotalTTC, depositsTTC, vehicle, hydrated, addToCart, restoreCart, setQty, removeLine, clearCart, setVehicle }
  }, [cart, vehicle, hydrated, addToCart, restoreCart, setQty, removeLine, clearCart, setVehicle])

  return (
    <ShopContext.Provider value={value}>
      {children}
      {toast && (
        <div
          role="status"
          className="fixed z-[60] left-4 right-4 bottom-24 sm:left-auto sm:right-6 sm:bottom-28 sm:w-96 rounded-2xl bg-gray-900 text-white shadow-2xl ring-1 ring-white/10 p-4 flex items-center gap-3"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500">
            <Icon name="check" className="w-5 h-5" strokeWidth={3} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{toast.name}</p>
            <p className="text-xs text-white/70">
              {toast.brand} · {formatEUR(toast.priceTTC)} — ajouté au panier
            </p>
          </div>
          <Link
            href="/panier"
            className="shrink-0 rounded-lg bg-secondary-600 hover:bg-secondary-700 px-3 py-2 text-xs font-bold"
          >
            Voir le panier
          </Link>
        </div>
      )}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>')
  return ctx
}
