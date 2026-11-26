import 'server-only'
import { unstable_cache } from 'next/cache'

// ---------------------------------------------------------------------------
//  Uber Direct — courier delivery from the Nanterre store.
//
//  From developer.uber.com/docs/deliveries (guides and "Direct API" reference
//  1.0.1, read on 26 Nov 2026):
//   1. Token   POST https://auth.uber.com/oauth/v2/token   (form body:
//      client_id, client_secret, grant_type=client_credentials,
//      scope=eats.deliveries). Valid 30 days, to be re-used: at most 100 token
//      requests an hour.
//   2. Quote   POST /v1/customers/{customer_id}/delivery_quotes
//      → { id "dqt_…", fee (cents), currency_type, duration (min), expires }.
//      A quote is valid 15 minutes.
//   3. Create  POST /v1/customers/{customer_id}/deliveries
//      → { id "del_…", status, tracking_url, fee, live_mode }. This sends a
//      real courier and is billed (unless the keys are test keys).
//  The same host serves test and production: the keys decide (the dashboard
//  direct.uber.com gives test keys first; `live_mode` is false with them).
//
//  Env: UBER_DIRECT_CLIENT_ID, UBER_DIRECT_CLIENT_SECRET,
//  UBER_DIRECT_CUSTOMER_ID. Without them the courier price is the zone grid
//  of lib/shop/config.ts (FULFILMENT.courier). Booking a courier also needs
//  UBER_DIRECT_DELIVERIES_ENABLED=true: it is off by default.
//
//  ⚠️ Not verified against the real service yet (no keys at the time of
//  writing): the detailed error codes of a refused quote are not listed on the
//  reference page, and the documentation does not say whether `fee` includes
//  VAT (see FULFILMENT.courier.uberFeeSurcharge).
// ---------------------------------------------------------------------------

import { SITE } from '../site'
import { FULFILMENT } from '../shop/config'
import { estimateCourier, type QuoteEstimate } from '../shop/fulfilment'
import { round2 } from '../shop/ranking'

const AUTH_URL = 'https://auth.uber.com/oauth/v2/token'
const API_URL = 'https://api.uber.com/v1'
// Overridden by the test suites only (local stand-in).
const authUrl = () => process.env.UBER_DIRECT_AUTH_URL || AUTH_URL
const apiUrl = () => (process.env.UBER_DIRECT_API_URL || API_URL).replace(/\/+$/, '')

/** The cart may show a price and the checkout charge it a few minutes later: one quote is re-used that long. */
const QUOTE_REUSE_SECONDS = 600

export class UberDirectError extends Error {
  constructor(
    message: string,
    public status?: number,
    /** Uber's own error code, e.g. "customer_not_found". */
    public code?: string,
  ) {
    super(message)
  }
}

export interface DeliveryAddress {
  street: string
  postalCode: string
  city: string
}

export interface CourierQuote extends QuoteEstimate {
  /** 'uber-direct' = Uber's price for this address; 'estimate' = the shop's zone grid. */
  source: 'uber-direct' | 'estimate'
  quoteId?: string
  expiresAt?: string
}

const env = () => ({
  clientId: process.env.UBER_DIRECT_CLIENT_ID,
  clientSecret: process.env.UBER_DIRECT_CLIENT_SECRET,
  customerId: process.env.UBER_DIRECT_CUSTOMER_ID,
})

export const isUberDirectConfigured = () => {
  const e = env()
  return Boolean(e.clientId && e.clientSecret && e.customerId)
}

/** Booking a courier spends money: it stays off unless this is exactly "true". */
export const areCourierBookingsEnabled = () => process.env.UBER_DIRECT_DELIVERIES_ENABLED === 'true'

/* ------------------------------------------------------------------ */
/*  Token and calls                                                    */
/* ------------------------------------------------------------------ */

let cachedToken: { forClient: string; value: string; expiresAt: number } | null = null

async function getToken(): Promise<string> {
  const { clientId, clientSecret } = env()
  if (!clientId || !clientSecret) throw new UberDirectError('Uber Direct non configuré')
  if (cachedToken && cachedToken.forClient === clientId && cachedToken.expiresAt > Date.now()) return cachedToken.value

  let res: Response
  try {
    res = await fetch(authUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'eats.deliveries' }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    })
  } catch (err) {
    throw new UberDirectError(`Uber injoignable (${err instanceof Error ? err.message : 'erreur réseau'})`)
  }
  const json = (await res.json().catch(() => null)) as { access_token?: string; expires_in?: number; error?: string } | null
  if (!res.ok || !json?.access_token) throw new UberDirectError(`Uber : jeton refusé (HTTP ${res.status}${json?.error ? `, ${json.error}` : ''})`, res.status, json?.error)
  // Kept a little less than its life (30 days), never asked per request.
  cachedToken = { forClient: clientId, value: json.access_token, expiresAt: Date.now() + Math.max(60, (json.expires_in ?? 3600) - 300) * 1000 }
  return cachedToken.value
}

async function post<T>(path: string, body: unknown, retried = false): Promise<T> {
  const { customerId } = env()
  const token = await getToken()
  let res: Response
  try {
    res = await fetch(`${apiUrl()}/customers/${customerId}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
  } catch (err) {
    throw new UberDirectError(`Uber injoignable (${err instanceof Error ? err.message : 'erreur réseau'})`)
  }
  // A token Uber no longer accepts: ask a new one, once.
  if (res.status === 401 && !retried) {
    cachedToken = null
    return post<T>(path, body, true)
  }
  const json = (await res.json().catch(() => null)) as ({ code?: string; message?: string } & T) | null
  if (!res.ok || !json) throw new UberDirectError(`Uber ${path} : HTTP ${res.status}${json?.code ? ` (${json.code})` : ''}${json?.message ? ` ${json.message}` : ''}`, res.status, json?.code)
  return json
}

/* ------------------------------------------------------------------ */
/*  Addresses                                                          */
/* ------------------------------------------------------------------ */

const ILE_DE_FRANCE = /^(75|77|78|91|92|93|94|95)/

// Uber expects each address as a JSON-encoded string.
const toUberAddress = (a: DeliveryAddress) =>
  JSON.stringify({
    street_address: [a.street.trim()],
    city: a.city.trim(),
    state: ILE_DE_FRANCE.test(a.postalCode) ? 'Île-de-France' : '',
    zip_code: a.postalCode,
    country: 'FR',
  })

const STORE_ADDRESS: DeliveryAddress = { street: SITE.street, postalCode: SITE.postalCode, city: SITE.city }

/** The store, as every request names it. Coordinates are added when the config has them. */
const pickup = () => ({
  pickup_address: toUberAddress(STORE_ADDRESS),
  ...(FULFILMENT.courier.storePosition ? { pickup_latitude: FULFILMENT.courier.storePosition.latitude, pickup_longitude: FULFILMENT.courier.storePosition.longitude } : {}),
})

/* ------------------------------------------------------------------ */
/*  Quote                                                              */
/* ------------------------------------------------------------------ */

interface RawQuote {
  id: string
  fee: number
  currency?: string
  currency_type?: string
  duration?: number
  expires?: string
}

type QuoteAnswer = { deliverable: true; quote: RawQuote } | { deliverable: false; code: string }

/**
 * Uber answers 400 both for an address it does not serve and for a request it
 * does not understand. These words in its code mean the former: the customer
 * must choose another way. Anything else is our problem, not theirs.
 */
const ADDRESS_REFUSED = /address|location|undeliverable|deliver|area|distance|geocod/i

async function askQuote(street: string, postalCode: string, city: string): Promise<QuoteAnswer> {
  try {
    const quote = await post<RawQuote>('/delivery_quotes', {
      ...pickup(),
      pickup_phone_number: SITE.phone,
      dropoff_address: toUberAddress({ street, postalCode, city }),
    })
    return { deliverable: true, quote }
  } catch (err) {
    if (err instanceof UberDirectError && err.status === 400 && ADDRESS_REFUSED.test(`${err.code ?? ''} ${err.message}`)) {
      return { deliverable: false, code: err.code ?? 'refused' }
    }
    throw err
  }
}

// Same address within a few minutes = same quote, on every server instance:
// the price the customer saw in the cart is the price the checkout computes.
const cachedQuote = unstable_cache(askQuote, ['uber-direct-quote'], { revalidate: QUOTE_REUSE_SECONDS })

const tidy = (s: string) => s.replace(/\s+/g, ' ').trim()

/** Price + ETA for a courier delivery from the store to `dropoff`. */
export async function quoteCourier(dropoff: DeliveryAddress): Promise<CourierQuote> {
  const estimate = (): CourierQuote => ({ ...estimateCourier(dropoff.postalCode), source: 'estimate' })
  if (!isUberDirectConfigured()) return estimate()

  // Uber prices the exact address: without the street there is nothing to ask.
  if (tidy(dropoff.street).length <= 3 || !tidy(dropoff.city)) {
    return { available: false, feeTTC: 0, etaLabel: '', reason: 'Indiquez votre adresse complète (n° et rue, ville) pour calculer la livraison.', source: 'uber-direct' }
  }

  try {
    const answer = await cachedQuote(tidy(dropoff.street), dropoff.postalCode, tidy(dropoff.city))
    if (!answer.deliverable) {
      return {
        available: false,
        feeTTC: 0,
        etaLabel: '',
        reason: 'La livraison par coursier n’est pas possible à cette adresse. Choisissez l’expédition colis ou le retrait au magasin.',
        source: 'uber-direct',
      }
    }
    const q = answer.quote
    // Never read cents of another currency as euros (a test account may not be in euros).
    if (typeof q.fee !== 'number' || q.fee < 0 || (q.currency_type ?? q.currency ?? 'EUR').toUpperCase() !== 'EUR') {
      throw new UberDirectError(`Uber quote unusable: fee ${q.fee} ${q.currency_type ?? q.currency ?? '?'}`)
    }
    return {
      available: true,
      // Uber's fee, plus the surcharge of the config (0 = pass-through).
      feeTTC: round2((q.fee / 100) * (1 + FULFILMENT.courier.uberFeeSurcharge)),
      // The courier leaves once the order is ready at the counter.
      etaLabel: typeof q.duration === 'number' ? `~${q.duration} min après préparation` : 'Dans l’heure après préparation',
      source: 'uber-direct',
      quoteId: q.id,
      expiresAt: q.expires,
    }
  } catch (err) {
    // Uber down, keys refused, account limited: the shop still sells, at its own grid.
    console.error('[uber-direct] quote failed, using the zone grid', err)
    return estimate()
  }
}

/* ------------------------------------------------------------------ */
/*  Booking a courier                                                  */
/* ------------------------------------------------------------------ */

export interface CourierDeliveryRequest {
  /** The shop's order number (EA92-…): Uber shows it to the courier and refuses a second booking with it. */
  orderRef: string
  dropoff: DeliveryAddress
  customerName: string
  /** International format, e.g. +33612345678. */
  customerPhone: string
  items: { name: string; quantity: number }[]
  /** Value of the goods incl. VAT. */
  totalValueTTC?: number
  /** For the courier at the door (digicode, floor…). 280 characters at most. */
  notes?: string
}

export interface CourierDelivery {
  deliveryId: string
  status: string
  /** Live map of the courier, to send to the customer. */
  trackingUrl: string
  feeTTC?: number
  /** False with test keys: no real courier, nothing billed. */
  live: boolean
}

/**
 * Books the courier for an order that is ready at the counter. It sends a real
 * courier and is billed, so it only runs when UBER_DIRECT_DELIVERIES_ENABLED
 * is "true". Nothing calls it automatically.
 */
export async function createCourierDelivery(req: CourierDeliveryRequest): Promise<CourierDelivery> {
  if (!isUberDirectConfigured()) throw new UberDirectError('Uber Direct non configuré')
  if (!areCourierBookingsEnabled()) throw new UberDirectError('Courier bookings are disabled: UBER_DIRECT_DELIVERIES_ENABLED is not "true"')
  if (!/^\+[0-9]{8,15}$/.test(req.customerPhone)) throw new UberDirectError('Customer phone must be in international format (+33…)')
  if (!req.items.length) throw new UberDirectError('Nothing to deliver')

  const d = await post<{ id: string; status: string; tracking_url: string; fee?: number; live_mode?: boolean }>('/deliveries', {
    ...pickup(),
    pickup_name: SITE.name,
    pickup_business_name: SITE.name,
    pickup_phone_number: SITE.phone,
    dropoff_address: toUberAddress(req.dropoff),
    dropoff_name: req.customerName,
    dropoff_phone_number: req.customerPhone,
    ...(req.notes ? { dropoff_notes: req.notes.slice(0, 280) } : {}),
    manifest_items: req.items.map((i) => ({ name: i.name.slice(0, 120), quantity: i.quantity, size: 'small' })),
    manifest_reference: req.orderRef,
    external_id: req.orderRef,
    // The same order booked twice by mistake gives one delivery, not two.
    idempotency_key: req.orderRef,
    ...(req.totalValueTTC !== undefined ? { manifest_total_value: Math.round(req.totalValueTTC * 100) } : {}),
    deliverable_action: 'deliverable_action_meet_at_door',
    // Nobody at the address: the part comes back to the store.
    undeliverable_action: 'return',
  })
  return { deliveryId: d.id, status: d.status, trackingUrl: d.tracking_url, feeTTC: typeof d.fee === 'number' ? d.fee / 100 : undefined, live: d.live_mode !== false }
}
