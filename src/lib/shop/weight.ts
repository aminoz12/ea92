// ---------------------------------------------------------------------------
//  Shipping weight of a cart, and what each carrier makes of it.
//  Client-safe: the cart shows the same figures the server charges.
// ---------------------------------------------------------------------------

import { FULFILMENT, PARCEL_FORBIDDEN_PART_TYPES, SHIPPING_WEIGHT } from './config'

/** Weight of one article: what the catalogue says, else the typical weight of its part type, else the default. */
export function articleWeightKg(catalogueKg: number | undefined, partType: number | undefined): number {
  if (catalogueKg !== undefined && Number.isFinite(catalogueKg) && catalogueKg > 0) return catalogueKg
  if (partType !== undefined && SHIPPING_WEIGHT.byPartType[partType]) return SHIPPING_WEIGHT.byPartType[partType]
  return SHIPPING_WEIGHT.defaultKg
}

export const isParcelForbidden = (partType: number | undefined) => partType !== undefined && PARCEL_FORBIDDEN_PART_TYPES.includes(partType)

/** Weight of a parcel: the articles plus the packaging, rounded up to 100 g. */
export function parcelWeightKg(lines: { weightKg?: number; qty: number }[]): number {
  const goods = lines.reduce((w, l) => w + (l.weightKg ?? SHIPPING_WEIGHT.defaultKg) * l.qty, 0)
  return Math.ceil((goods + SHIPPING_WEIGHT.packagingKg) * 10) / 10
}

export type CourierSize = 'small' | 'medium' | 'large' | 'xlarge'

/** Uber's size for a cart line, from what it weighs in all. */
export function courierSize(lineKg: number): CourierSize {
  const s = FULFILMENT.courier.sizeByWeightKg
  return lineKg <= s.small ? 'small' : lineKg <= s.medium ? 'medium' : lineKg <= s.large ? 'large' : 'xlarge'
}
