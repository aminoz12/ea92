import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

// ---------------------------------------------------------------------------
//  Stripe — online payment with Stripe Checkout, server side only.
//
//  The customer pays on a page hosted by Stripe: no card data ever reaches
//  this site. We create a Checkout Session with the lines of the order, send
//  the customer to its URL, and learn the outcome two ways: the customer comes
//  back on our confirmation page (we re-read the session), and Stripe calls
//  our webhook (signed), which is what counts when the browser is closed.
//
//  Env: STRIPE_SECRET_KEY      sk_test_… to try, sk_live_… to really charge
//       STRIPE_WEBHOOK_SECRET  whsec_…, given when the webhook endpoint
//                              /api/stripe/webhook is created in the dashboard
//       STRIPE_API_BASE        tests only: another address for the API
//
//  Plain HTTPS calls (form-encoded, as the API expects) rather than the
//  "stripe" package: three calls do not justify a dependency.
// ---------------------------------------------------------------------------

export class StripeError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message)
  }
}

export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY)

/** 'test' = no real money moves. Told from the key itself. */
export function stripeKeyMode(): 'test' | 'live' | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return /^(sk|rk)_live_/.test(key) ? 'live' : 'test'
}

const apiBase = () => (process.env.STRIPE_API_BASE || 'https://api.stripe.com').replace(/\/$/, '')

/** { a: { b: [1, { c: 2 }] } } → a[b][0]=1&a[b][1][c]=2, the bracket syntax of the API. */
function encodeForm(value: unknown, prefix = '', out = new URLSearchParams()): URLSearchParams {
  if (value === undefined || value === null) return out
  if (Array.isArray(value)) value.forEach((v, i) => encodeForm(v, `${prefix}[${i}]`, out))
  else if (typeof value === 'object') for (const [k, v] of Object.entries(value)) encodeForm(v, prefix ? `${prefix}[${k}]` : k, out)
  else out.append(prefix, String(value))
  return out
}

async function call<T>(method: 'GET' | 'POST', path: string, body?: Record<string, unknown>, idempotencyKey?: string): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new StripeError('Stripe non configuré')

  let res: Response
  try {
    res = await fetch(apiBase() + path, {
      method,
      headers: {
        Authorization: `Bearer ${key}`,
        ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
        // Makes a retried POST safe: Stripe answers the first result again instead of creating a second session.
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
      body: body ? encodeForm(body).toString() : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
    })
  } catch (err) {
    throw new StripeError(`Stripe injoignable (${err instanceof Error ? err.message : 'erreur réseau'})`)
  }
  const json = (await res.json().catch(() => null)) as { error?: { message?: string; code?: string } } | null
  if (!res.ok) throw new StripeError(json?.error?.message ?? `Stripe : HTTP ${res.status}`, res.status, json?.error?.code)
  return json as T
}

/* ------------------------------------------------------------------ */
/*  Checkout Session                                                   */
/* ------------------------------------------------------------------ */

export interface CheckoutLine {
  name: string
  description?: string
  /** Public https picture shown on the payment page. */
  image?: string
  /** Unit price incl. VAT, in cents. */
  unitAmount: number
  quantity: number
}

export interface CheckoutSessionInput {
  /** Our order number: shown to the customer, kept by Stripe as `client_reference_id`. */
  orderRef: string
  lines: CheckoutLine[]
  /** Where Stripe sends the customer back. `{CHECKOUT_SESSION_ID}` is replaced by Stripe. */
  successUrl: string
  cancelUrl: string
  /** What the shop needs to prepare the order. At most 50 entries of 500 characters. */
  metadata: Record<string, string>
  /** Label of the payment in the dashboard and on bank statements' details. */
  description: string
}

/** The fields of a Checkout Session this site reads. */
export interface CheckoutSession {
  id: string
  url: string | null
  status: 'open' | 'complete' | 'expired' | null
  payment_status: 'paid' | 'unpaid' | 'no_payment_required'
  amount_total: number | null
  currency: string | null
  client_reference_id: string | null
  livemode: boolean
  metadata: Record<string, string> | null
  customer_details?: { email?: string | null; name?: string | null; phone?: string | null } | null
  payment_intent?: string | null
  /** Only with `expand[]=line_items`. */
  line_items?: { data: { description: string | null; quantity: number | null; amount_total: number }[] }
}

/** Prices are live supplier prices: the payment page does not stay open longer than it has to (Stripe's minimum is 30 min). */
const SESSION_MINUTES = 35

export function createCheckoutSession(input: CheckoutSessionInput): Promise<CheckoutSession> {
  return call<CheckoutSession>(
    'POST',
    '/v1/checkout/sessions',
    {
      mode: 'payment',
      locale: 'fr',
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      client_reference_id: input.orderRef,
      expires_at: Math.floor(Date.now() / 1000) + SESSION_MINUTES * 60,
      line_items: input.lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: l.unitAmount,
          product_data: {
            name: l.name,
            ...(l.description ? { description: l.description } : {}),
            ...(l.image ? { images: [l.image] } : {}),
          },
        },
      })),
      metadata: input.metadata,
      // The same reference on the payment itself, which is what refunds and exports show.
      payment_intent_data: { description: input.description, metadata: { order_ref: input.orderRef } },
    },
    `checkout-${input.orderRef}`,
  )
}

/** Session ids come back in a URL: only well-formed ones are sent to Stripe. */
export const isCheckoutSessionId = (value: string) => /^cs_(test|live)_[A-Za-z0-9]{10,250}$/.test(value)

export const getCheckoutSession = (id: string) =>
  call<CheckoutSession>('GET', `/v1/checkout/sessions/${encodeURIComponent(id)}?expand[]=line_items`)

/** A session is paid when it is complete and nothing is left to collect. */
export const isPaid = (s: Pick<CheckoutSession, 'status' | 'payment_status'>) => s.status === 'complete' && s.payment_status !== 'unpaid'

/* ------------------------------------------------------------------ */
/*  Webhook                                                            */
/* ------------------------------------------------------------------ */

export interface StripeEvent {
  id: string
  type: string
  livemode: boolean
  data: { object: CheckoutSession }
}

/** Events older or newer than this are refused: it blocks the replay of a captured request. */
const SIGNATURE_TOLERANCE_SEC = 300

/**
 * Checks that a webhook request really comes from Stripe and returns its event.
 * `rawBody` must be the request body exactly as received (not re-serialised).
 *
 * Header: `t=<unix time>,v1=<hex>[,v1=<hex>…]`. The signature is the
 * HMAC-SHA256 of "<t>.<rawBody>" with the endpoint's signing secret.
 */
export function verifyWebhook(rawBody: string, signatureHeader: string | null, nowMs = Date.now()): StripeEvent {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) throw new StripeError('Webhook Stripe non configuré (STRIPE_WEBHOOK_SECRET)', 503)
  if (!signatureHeader) throw new StripeError('Signature absente', 400)

  let timestamp = ''
  const signatures: string[] = []
  for (const part of signatureHeader.split(',')) {
    const at = part.indexOf('=')
    if (at < 0) continue
    const key = part.slice(0, at).trim()
    const value = part.slice(at + 1).trim()
    if (key === 't') timestamp = value
    else if (key === 'v1') signatures.push(value)
  }
  if (!/^\d{1,12}$/.test(timestamp) || !signatures.length) throw new StripeError('Signature illisible', 400)
  if (Math.abs(nowMs / 1000 - Number(timestamp)) > SIGNATURE_TOLERANCE_SEC) throw new StripeError('Signature périmée', 400)

  const expected = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`, 'utf8').digest()
  const genuine = signatures.some((s) => {
    if (!/^[0-9a-f]+$/i.test(s)) return false
    const given = Buffer.from(s, 'hex')
    return given.length === expected.length && timingSafeEqual(given, expected)
  })
  if (!genuine) throw new StripeError('Signature invalide', 400)

  try {
    return JSON.parse(rawBody) as StripeEvent
  } catch {
    throw new StripeError('Événement illisible', 400)
  }
}
