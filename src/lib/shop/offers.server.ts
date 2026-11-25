import 'server-only'

// ---------------------------------------------------------------------------
//  Price and availability of real catalogue articles, asked live to the
//  supplier gateway.
//
//  Two levels:
//   - `priceArticles` works with references, for the server (checkout).
//   - `getArticleOffers` works with the opaque article tokens and is what the
//     browser gets: a public price incl. VAT and a lead time, under the token.
//     No reference, no purchase price, no supplier name.
//
//  Without a live gateway (SUPPLIER_GATEWAY other than "autoprecision", or
//  EasyOrder not configured) there is no offer at all: the catalogue pages
//  then show "Prix et disponibilité sur demande".
//
//  The suppliers are given a few seconds to answer (see suppliers.server.ts);
//  a part only the slow ones have comes back without an offer.
// ---------------------------------------------------------------------------

import { CATALOG_PRICING, VAT_RATE } from './config'
import { readArticleToken } from './articleToken.server'
import { getSupplierGateway, isSupplierGatewayLive, type SupplierAvailability } from '../integrations/suppliers.server'
import type { Availability } from './types'

/** A part as the suppliers know it. Server side only. */
export interface ArticleRef {
  artNr: string
  dlNr: number
}

interface Pricing {
  priceTTC: number
  availability: Availability
  /** Units the supplier has right now. */
  quantity?: number
  /** Refundable deposit on an exchange part, incl. VAT. */
  depositTTC?: number
}

/** Server side only: carries the reference. */
export type PricedArticle = ArticleRef & Pricing

/** What the browser may know about an article's offer. `id` is the article token. */
export type ArticleOffer = { id: string } & Pricing

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

/** Prices for the given references, in the same order; null where the part cannot be sold online right now. */
export async function priceArticles(refs: ArticleRef[]): Promise<(PricedArticle | null)[]> {
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

/**
 * Offers for the given article tokens: only the articles that can be sold
 * online right now, each under its token. Tokens that are not ours are ignored.
 */
export async function getArticleOffers(tokens: string[]): Promise<ArticleOffer[]> {
  const known = tokens.flatMap((token) => {
    const ref = readArticleToken(token)
    return ref ? [{ token, ref }] : []
  })
  const priced = await priceArticles(known.map((k) => k.ref))
  return known.flatMap((k, i) => {
    const p = priced[i]
    return p ? [{ id: k.token, priceTTC: p.priceTTC, availability: p.availability, quantity: p.quantity, depositTTC: p.depositTTC }] : []
  })
}
