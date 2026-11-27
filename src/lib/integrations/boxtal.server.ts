import 'server-only'

// ---------------------------------------------------------------------------
//  Boxtal — parcel shipping anywhere in France (API v3).
//
//  What the API v3 offers (developer.boxtal.com → v3 API, guide and OpenAPI
//  file 3.1.0, read on 26 Nov 2026):
//   - relay points ("proximity points") around an address       ← used here
//   - creating / cancelling a shipping order (billed by direct debit)
//   - shipping labels and tracking, pushed by webhooks
//   - NO price: "It is currently not possible to request a quote with the v3
//     API". The delivery price charged to the customer is therefore the
//     shop's own grid (FULFILMENT.parcel in lib/shop/config.ts).
//
//  Servers: https://api.boxtal.com (production, orders are billed) and
//  https://api.boxtal.build (test: a separate test account and its own keys;
//  production keys do not work there). Every request carries the application's
//  access key and secret key as HTTP Basic auth; both stay on the server.
//
//  Env: BOXTAL_ACCESS_KEY, BOXTAL_SECRET_KEY, and BOXTAL_API_URL to point at
//  the test server. Without the keys nothing is asked to Boxtal: the cart
//  offers relay delivery without a choice of relay, as before.
//
//  Not built yet, on purpose: creating shipping orders from the site. It
//  spends money and needs the real weight and size of each parcel, which the
//  catalogue does not give; labels are made by the shop for now.
// ---------------------------------------------------------------------------

import { FULFILMENT } from '../shop/config'
import { estimateParcel, type QuoteEstimate } from '../shop/fulfilment'

const PRODUCTION_URL = 'https://api.boxtal.com'

export class BoxtalError extends Error {
  constructor(
    message: string,
    public status?: number,
    /** Boxtal's own error code, e.g. "ValidationException.NotNull". */
    public code?: string,
  ) {
    super(message)
  }
}

export const isBoxtalConfigured = () => Boolean(process.env.BOXTAL_ACCESS_KEY && process.env.BOXTAL_SECRET_KEY)

/** The server to call. A host typed without "https://" ("api.boxtal.com") is accepted. */
const baseUrl = () => {
  const raw = (process.env.BOXTAL_API_URL ?? '').trim().replace(/\/+$/, '')
  if (!raw) return PRODUCTION_URL
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
}

/** Which Boxtal server the keys are for; null when Boxtal is not configured. */
export const boxtalEnvironment = (): 'production' | 'test' | null => (!isBoxtalConfigured() ? null : baseUrl() === PRODUCTION_URL ? 'production' : 'test')

async function get<T>(path: string, query: Record<string, string | undefined>): Promise<T> {
  const access = process.env.BOXTAL_ACCESS_KEY
  const secret = process.env.BOXTAL_SECRET_KEY
  if (!access || !secret) throw new BoxtalError('Boxtal non configuré')

  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) if (value) qs.set(key, value)

  let res: Response
  try {
    res = await fetch(`${baseUrl()}${path}?${qs}`, {
      headers: { Authorization: `Basic ${Buffer.from(`${access}:${secret}`).toString('base64')}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    })
  } catch (err) {
    throw new BoxtalError(`Boxtal injoignable (${err instanceof Error ? err.message : 'erreur réseau'})`)
  }
  const body = (await res.json().catch(() => null)) as { errors?: { code?: string }[] } | null
  if (!res.ok) {
    const code = body?.errors?.[0]?.code
    throw new BoxtalError(`Boxtal : HTTP ${res.status}${code ? ` (${code})` : ''}`, res.status, code)
  }
  return body as T
}

/* ------------------------------------------------------------------ */
/*  Relay points                                                       */
/* ------------------------------------------------------------------ */

/** A relay point the customer can have the parcel delivered to. Safe to send to the browser. */
export interface RelayPoint {
  /** The carrier's code of the point: what the shipping order needs (`pickupPointCode`). */
  code: string
  name: string
  street: string
  postalCode: string
  city: string
  /** Metres from the address searched. */
  distanceM?: number
  /** Monday first. No period = closed that day. */
  hours: { day: string; periods: string[] }[]
}

interface RawPeriod {
  openingTime?: string
  closingTime?: string
}
interface RawNearbyPoint {
  distanceFromSearchLocation?: number
  parcelPoint?: {
    code?: string | number
    name?: string
    location?: { number?: string | number; street?: string; postalCode?: string | number; city?: string }
    openingDays?: Record<string, RawPeriod[] | null | undefined>
  }
}

const DAYS = [
  ['MONDAY', 'Lun'],
  ['TUESDAY', 'Mar'],
  ['WEDNESDAY', 'Mer'],
  ['THURSDAY', 'Jeu'],
  ['FRIDAY', 'Ven'],
  ['SATURDAY', 'Sam'],
  ['SUNDAY', 'Dim'],
] as const

const hhmm = (time?: string) => (time ?? '').slice(0, 5)

function relayPoint(raw: RawNearbyPoint): RelayPoint | null {
  const p = raw.parcelPoint
  const code = p?.code === undefined ? '' : String(p.code).trim()
  if (!p || !code || !p.name) return null
  const loc = p.location ?? {}
  return {
    code,
    name: p.name.trim(),
    street: [loc.number, loc.street].filter((x) => x !== undefined && x !== '').join(' ').trim(),
    postalCode: loc.postalCode === undefined ? '' : String(loc.postalCode),
    city: (loc.city ?? '').trim(),
    distanceM: typeof raw.distanceFromSearchLocation === 'number' ? raw.distanceFromSearchLocation : undefined,
    hours: DAYS.map(([key, day]) => ({
      day,
      periods: (p.openingDays?.[key] ?? []).filter((x) => x.openingTime && x.closingTime).map((x) => `${hhmm(x.openingTime)}–${hhmm(x.closingTime)}`),
    })),
  }
}

/**
 * Relay points of the shop's relay offer around an address in France, nearest
 * first. Throws BoxtalError when Boxtal cannot be asked.
 */
export async function listRelayPoints(near: { street?: string; postalCode: string; city?: string }): Promise<RelayPoint[]> {
  const raw = await get<{ content?: RawNearbyPoint[] }>('/shipping/v3.2/parcel-point-by-shipping-offer', {
    countryIsoCode: 'FR',
    postalCode: near.postalCode,
    city: near.city?.trim() || undefined,
    street: near.street?.trim() || undefined,
    // where the recipient collects the parcel, for the offer the shop ships relay parcels with
    operationType: 'ARRIVAL',
    shippingOfferCode: FULFILMENT.parcel.relayOfferCode,
  })
  return (raw.content ?? [])
    .map(relayPoint)
    .filter((p): p is RelayPoint => p !== null)
    .sort((a, b) => (a.distanceM ?? Infinity) - (b.distanceM ?? Infinity))
}

/** The relay point with this code among those offered around the address, or null. */
export async function findRelayPoint(code: string, near: { street?: string; postalCode: string; city?: string }): Promise<RelayPoint | null> {
  return (await listRelayPoints(near)).find((p) => p.code === code) ?? null
}

/* ------------------------------------------------------------------ */
/*  Delivery price                                                     */
/* ------------------------------------------------------------------ */

export interface ParcelQuote extends QuoteEstimate {
  /** 'grid' = the shop's own price list: it is the price charged, not an estimate. */
  source: 'grid'
}

/**
 * Price of a parcel for the customer. Boxtal's API v3 gives no price: the
 * shop's grid applies, by weight (parts + packaging, see lib/shop/weight.ts).
 */
export async function quoteParcel(params: { postalCode: string; weightKg: number; cartTotalTTC: number; option: 'relais' | 'domicile' }): Promise<ParcelQuote> {
  if (params.weightKg > FULFILMENT.parcel.maxKg) {
    return {
      available: false,
      feeTTC: 0,
      etaLabel: '',
      reason: `Commande trop lourde pour un seul colis (${params.weightKg.toFixed(1).replace('.', ',')} kg, maximum ${FULFILMENT.parcel.maxKg} kg) : choisissez le retrait ou le coursier, ou écrivez-nous.`,
      source: 'grid',
    }
  }
  return { ...estimateParcel(params.weightKg, params.cartTotalTTC, params.option), source: 'grid' }
}
