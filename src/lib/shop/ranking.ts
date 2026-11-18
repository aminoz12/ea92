// ---------------------------------------------------------------------------
//  Brand ranking — "push the brand that earns us the most (RFA included)
//  while staying the cheapest".
//
//  For one part sold under several brands:
//   1. cheapest    = lowest public price (TTC) among the offers
//   2. ceiling     = cheapest + max(relativeTolerance × cheapest, absoluteTolerance)
//                    capped by the competitor price when we know it
//   3. eligible    = offers priced at or under the ceiling ("cheapest band")
//   4. recommended = eligible offer with the highest NET margin, where
//                    net margin = price HT − purchase HT × (1 − RFA rate)
//                    ties → better availability, then lower price
//   5. the other offers follow by price, so the customer can still choose.
//
//  Pure function, no I/O: easy to unit-test and to reuse server-side when the
//  real supplier prices arrive (TecCom / AutoPrécision).
// ---------------------------------------------------------------------------

import { RANKING, VAT_RATE } from './config'
import type { Availability, InternalOffer } from './types'

export const AVAILABILITY_RANK: Record<Availability, number> = {
  magasin: 0,
  fournisseur_4h: 1,
  fournisseur_24h: 2,
}

export const round2 = (n: number) => Math.round(n * 100) / 100

/** Margin in € HT once the supplier's year-end rebate (RFA) is counted. */
export function netMarginHT(offer: InternalOffer, vatRate: number = VAT_RATE) {
  const sellHT = offer.priceTTC / (1 + vatRate)
  const netCostHT = offer.purchaseHT * (1 - offer.rfaRate)
  return round2(sellHT - netCostHT)
}

export interface RankingOptions {
  relativeTolerance?: number
  absoluteToleranceTTC?: number
  marketPriceTTC?: number
  vatRate?: number
}

export interface RankedOffer extends InternalOffer {
  recommended: boolean
  eligible: boolean
  netMarginHT: number
}

export interface RankingResult {
  offers: RankedOffer[] // recommended first, then by price
  cheapestTTC: number
  ceilingTTC: number
}

export function rankOffers(offers: InternalOffer[], opts: RankingOptions = {}): RankingResult {
  if (offers.length === 0) return { offers: [], cheapestTTC: 0, ceilingTTC: 0 }

  const rel = opts.relativeTolerance ?? RANKING.relativeTolerance
  const abs = opts.absoluteToleranceTTC ?? RANKING.absoluteToleranceTTC
  const vat = opts.vatRate ?? VAT_RATE

  const cheapestTTC = Math.min(...offers.map((o) => o.priceTTC))
  let ceilingTTC = cheapestTTC + Math.max(cheapestTTC * rel, abs)
  // Never push something pricier than the market when we know the market
  // price — unless even our cheapest offer is above it.
  if (opts.marketPriceTTC !== undefined) {
    ceilingTTC = Math.max(cheapestTTC, Math.min(ceilingTTC, opts.marketPriceTTC))
  }
  ceilingTTC = round2(ceilingTTC)

  const enriched: RankedOffer[] = offers.map((o) => ({
    ...o,
    recommended: false,
    eligible: o.priceTTC <= ceilingTTC + 1e-9,
    netMarginHT: netMarginHT(o, vat),
  }))

  // The cheapest offer is always eligible, so `best` always exists.
  const best = enriched
    .filter((o) => o.eligible)
    .sort(
      (a, b) =>
        b.netMarginHT - a.netMarginHT ||
        AVAILABILITY_RANK[a.availability] - AVAILABILITY_RANK[b.availability] ||
        a.priceTTC - b.priceTTC,
    )[0]
  best.recommended = true

  const rest = enriched
    .filter((o) => o !== best)
    .sort(
      (a, b) =>
        a.priceTTC - b.priceTTC ||
        AVAILABILITY_RANK[a.availability] - AVAILABILITY_RANK[b.availability],
    )

  return { offers: [best, ...rest], cheapestTTC, ceilingTTC }
}
