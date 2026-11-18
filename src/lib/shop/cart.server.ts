import 'server-only'

// Re-prices cart items from the catalogue. Anything coming from the browser
// or from a link (slug + reference + qty) goes through here: prices, names
// and deposits are always taken from the catalogue, never from the client.

import { getPublicProduct } from './catalog.server'
import type { CartItemRef } from '../loyalty/cartRecovery'
import type { CartLine } from './types'

export function priceCartItems(items: CartItemRef[]): CartLine[] {
  const lines: CartLine[] = []
  for (const item of items) {
    const product = getPublicProduct(item.slug)
    const offer = product?.offers.find((o) => o.reference === item.reference)
    if (!product || !offer) continue // product or brand no longer sold
    lines.push({
      slug: product.slug,
      brand: offer.brand,
      reference: offer.reference,
      name: product.name,
      image: product.image,
      priceTTC: offer.priceTTC,
      qty: Math.min(99, Math.max(1, Math.trunc(item.qty))),
      fittingJob: product.fittingJob,
      wearPart: product.wearPart,
      weightKg: product.weightKg,
      parcelForbidden: product.parcelForbidden,
      depositTTC: product.depositTTC,
    })
  }
  return lines
}

/** Validates an untrusted list of { slug, reference, qty }. */
export function parseCartItems(value: unknown): CartItemRef[] {
  if (!Array.isArray(value)) return []
  return value
    .slice(0, 30)
    .filter(
      (v): v is CartItemRef =>
        !!v &&
        typeof v === 'object' &&
        typeof (v as CartItemRef).slug === 'string' &&
        typeof (v as CartItemRef).reference === 'string' &&
        Number.isFinite((v as CartItemRef).qty),
    )
}
