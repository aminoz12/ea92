import 'server-only'

// ---------------------------------------------------------------------------
//  Boxtal — parcel shipping anywhere in France.
//
//  ⚠️ As of today Boxtal's REST API v3 does NOT offer quotes (their v3 quote
//  guide says it is planned); quotes go through the older v1 API, while v3
//  handles orders, labels and tracking (sandbox: https://api.boxtal.build).
//  See developer.boxtal.com → "quote api v1" / "order api v3".
//
//  Env (once you have an account): BOXTAL_V1_URL, BOXTAL_V1_LOGIN,
//  BOXTAL_V1_PASSWORD, BOXTAL_V1_KEY, BOXTAL_V3_KEY, BOXTAL_V3_SECRET
//  Until the adapter below is implemented, quotes use the fallback grid in
//  lib/shop/config.ts (FULFILMENT.parcel).
// ---------------------------------------------------------------------------

import { estimateParcel, type QuoteEstimate } from '../shop/fulfilment'

export interface ParcelQuote extends QuoteEstimate {
  source: 'boxtal' | 'estimate'
  carrier?: string
}

export const isBoxtalConfigured = () =>
  Boolean(process.env.BOXTAL_V1_URL && process.env.BOXTAL_V1_LOGIN && process.env.BOXTAL_V1_KEY)

async function quoteWithBoxtalV1(): Promise<ParcelQuote> {
  // TODO(integration): call the v1 quote endpoint with the store as shipper,
  // the customer's postcode as recipient and the parcel weight/dimensions,
  // then keep the cheapest relay and home offers (v1 answers in XML).
  throw new Error('Boxtal v1 quote adapter not implemented yet')
}

export async function quoteParcel(params: {
  postalCode: string
  weightKg: number
  cartTotalTTC: number
  option: 'relais' | 'domicile'
}): Promise<ParcelQuote> {
  const fallback = (): ParcelQuote => ({
    ...estimateParcel(params.weightKg, params.cartTotalTTC, params.option),
    source: 'estimate',
  })
  if (!isBoxtalConfigured()) return fallback()
  try {
    return await quoteWithBoxtalV1()
  } catch (err) {
    console.error('[boxtal] quote failed, using fallback grid', err)
    return fallback()
  }
}
