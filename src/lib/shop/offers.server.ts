import 'server-only'

// ---------------------------------------------------------------------------
//  Price and availability of real catalogue articles (TecDoc reference +
//  manufacturer code), asked live to the supplier gateway.
//
//  What leaves this module is safe for the browser: a public price incl. VAT
//  and a lead time. Purchase prices and supplier names stay on the server.
//
//  Without a live gateway (SUPPLIER_GATEWAY other than "autoprecision", or
//  EasyOrder not configured) there is no offer at all: the catalogue pages
//  then show "Prix et disponibilité sur demande".
//
//  The suppliers are given a few seconds to answer (see suppliers.server.ts);
//  a part only the slow ones have comes back without an offer.
// ---------------------------------------------------------------------------

import { CATALOG_PRICING, VAT_RATE } from './config'
import { getSupplierGateway, isSupplierGatewayLive, type SupplierAvailability } from '../integrations/suppliers.server'
import type { Availability } from './types'

export interface ArticleRef {
  artNr: string
  dlNr: number
}

export interface ArticleOffer extends ArticleRef {
  priceTTC: number
  availability: Availability
  /** Units the supplier has right now. */
  quantity?: number
  /** Refundable deposit on an exchange part, incl. VAT. */
  depositTTC?: number
}

const withVat = (ht: number) => Math.round(ht * (1 + VAT_RATE) * 100) / 100

export const areOffersLive = isSupplierGatewayLive

/**
 * The retail mark-up on the purchase price. CATALOG_MARKUP_ON_PURCHASE (for
 * example "0.6" for cost × 1.6) lets the owner set or change it on the host
 * without a new version of the site; otherwise the value of the config applies.
 */
function retailMarkup(): number | null {
  const raw = process.env.CATALOG_MARKUP_ON_PURCHASE?.trim().replace(',', '.')
  if (raw) {
    const n = Number(raw)
    if (Number.isFinite(n) && n >= 0 && n <= 5) return n
    console.error(`[offers] CATALOG_MARKUP_ON_PURCHASE="${raw}" is not a number between 0 and 5: ignored`)
  }
  return CATALOG_PRICING.markupOnPurchase
}

/** Public price excl. VAT, or null when the part cannot be priced safely. */
function publicPriceHT(a: SupplierAvailability): number | null {
  const { fallbackToPublicPrice, minMarkupOnPurchase } = CATALOG_PRICING
  const markupOnPurchase = retailMarkup()
  // A selling price computed by the platform for our account wins when there is one (none today).
  let price = a.saleHT
  if (!price && markupOnPurchase !== null && a.purchaseHT) {
    price = a.purchaseHT * (1 + markupOnPurchase)
    if (a.publicHT && price > a.publicHT) price = a.publicHT
  }
  if (!price && fallbackToPublicPrice) price = a.publicHT
  if (!price || price <= 0) return null
  // Never show a price under what the part costs us: better "sur demande" than a loss.
  if (a.purchaseHT !== undefined && price < a.purchaseHT * (1 + minMarkupOnPurchase)) return null
  return price
}

/** Offers for the given articles, in the same order; null where the part cannot be sold online right now. */
export async function getArticleOffers(refs: ArticleRef[]): Promise<(ArticleOffer | null)[]> {
  if (!refs.length || !isSupplierGatewayLive()) return refs.map(() => null)
  const answers = await getSupplierGateway().checkAvailability(refs.map((r) => ({ brand: '', reference: r.artNr, dlNr: r.dlNr })))
  return refs.map((ref, i) => {
    const a = answers[i]
    if (!a || a.availability === 'indisponible') return null
    const priceHT = publicPriceHT(a)
    if (priceHT === null) return null
    return {
      artNr: ref.artNr,
      dlNr: ref.dlNr,
      priceTTC: withVat(priceHT),
      availability: a.availability,
      quantity: a.quantity,
      depositTTC: a.depositHT ? withVat(a.depositHT) : undefined,
    }
  })
}
