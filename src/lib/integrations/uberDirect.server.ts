import 'server-only'

// ---------------------------------------------------------------------------
//  Uber Direct — courier delivery from the Nanterre store.
//
//  Flow (developer.uber.com/docs/deliveries):
//   1. OAuth client-credentials token  POST https://auth.uber.com/oauth/v2/token
//      scope "eats.deliveries"
//   2. Quote   POST /v1/customers/{customer_id}/delivery_quotes
//      → { id, fee (cents), currency, duration (min), dropoff_eta, expires }
//   3. Create  POST /v1/customers/{customer_id}/deliveries  (with quote_id)
//      → includes `tracking_url` (live courier map) — send it on WhatsApp.
//
//  Env: UBER_DIRECT_CLIENT_ID, UBER_DIRECT_CLIENT_SECRET, UBER_DIRECT_CUSTOMER_ID
//  Without them, quoteCourier() falls back to the zone estimate.
//  NB: Uber notes some regions need pickup/dropoff latitude & longitude in
//  the quote — check with your Uber technical contact for France.
// ---------------------------------------------------------------------------

import { SITE } from '../site'
import { estimateCourier, type QuoteEstimate } from '../shop/fulfilment'
import { round2 } from '../shop/ranking'

const TOKEN_URL = 'https://auth.uber.com/oauth/v2/token'
const API_URL = 'https://api.uber.com/v1'

export interface DeliveryAddress {
  street: string
  postalCode: string
  city: string
}

export interface CourierQuote extends QuoteEstimate {
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

// Uber expects each address as a JSON-encoded string.
const toUberAddress = (a: DeliveryAddress) =>
  JSON.stringify({
    street_address: [a.street],
    city: a.city,
    state: 'Île-de-France',
    zip_code: a.postalCode,
    country: 'FR',
  })

const STORE_ADDRESS: DeliveryAddress = {
  street: SITE.street,
  postalCode: SITE.postalCode,
  city: SITE.city,
}

let cachedToken: { value: string; expiresAt: number } | null = null

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value
  const { clientId, clientSecret } = env()
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      grant_type: 'client_credentials',
      scope: 'eats.deliveries',
    }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Uber token HTTP ${res.status}`)
  const json = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = { value: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 }
  return cachedToken.value
}

async function uberFetch<T>(path: string, body: unknown): Promise<T> {
  const token = await getToken()
  const res = await fetch(`${API_URL}/customers/${env().customerId}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Uber ${path} HTTP ${res.status}: ${await res.text()}`)
  return (await res.json()) as T
}

/** Price + ETA for a courier delivery from the store to `dropoff`. */
export async function quoteCourier(dropoff: DeliveryAddress): Promise<CourierQuote> {
  if (!isUberDirectConfigured()) {
    return { ...estimateCourier(dropoff.postalCode), source: 'estimate' }
  }
  try {
    const q = await uberFetch<{
      id: string
      fee: number
      currency: string
      duration: number
      expires: string
    }>('/delivery_quotes', {
      pickup_address: toUberAddress(STORE_ADDRESS),
      dropoff_address: toUberAddress(dropoff),
    })
    return {
      available: true,
      // Pass-through pricing: the customer pays Uber's fee. Add a margin or a
      // subsidy here if you decide otherwise.
      feeTTC: round2(q.fee / 100),
      etaLabel: `~${q.duration} min`,
      source: 'uber-direct',
      quoteId: q.id,
      expiresAt: q.expires,
    }
  } catch (err) {
    console.error('[uber-direct] quote failed, using estimate', err)
    return { ...estimateCourier(dropoff.postalCode), source: 'estimate' }
  }
}

export interface CourierDeliveryRequest {
  quoteId: string
  dropoff: DeliveryAddress
  customerName: string
  customerPhone: string // E.164, e.g. +33612345678
  items: { name: string; quantity: number }[]
}

/**
 * Book the courier once the order is ready at the counter (status
 * "arrivée magasin"). Returns Uber's tracking_url for the WhatsApp message.
 * Check the manifest item fields against the Create Delivery reference.
 */
export async function createCourierDelivery(req: CourierDeliveryRequest) {
  if (!isUberDirectConfigured()) throw new Error('Uber Direct non configuré')
  const d = await uberFetch<{ id: string; status: string; tracking_url: string }>('/deliveries', {
    quote_id: req.quoteId,
    pickup_address: toUberAddress(STORE_ADDRESS),
    pickup_name: SITE.name,
    pickup_phone_number: SITE.phone,
    dropoff_address: toUberAddress(req.dropoff),
    dropoff_name: req.customerName,
    dropoff_phone_number: req.customerPhone,
    manifest_items: req.items.map((i) => ({ name: i.name, quantity: i.quantity, size: 'small' })),
  })
  return { deliveryId: d.id, status: d.status, trackingUrl: d.tracking_url }
}
