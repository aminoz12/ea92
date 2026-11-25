import { NextResponse } from 'next/server'
import { CheckoutError, parseCheckoutRequest, startCheckout } from '@/lib/shop/checkout.server'
import { clientAddress, takeHit } from '@/lib/rateLimit.server'

// Each call asks the suppliers and Stripe: a real customer needs a handful at most.
const PER_VISITOR = [{ limit: 10, windowMs: 10 * 60_000 }]

// The suppliers get about 6 s to answer, then Stripe is called.
export const maxDuration = 30

// POST { items, mode, pickup, parcelOption, relayCode, address, contact, whatsappOptIn, vehicle, totalTTC }
//   → 200 { url, orderRef }              go to `url` to pay
//   → 409 { message, lines, removed, quote? }  the cart changed: update it, the customer confirms the new total
//   → 4xx/5xx { error }
export async function POST(req: Request) {
  if (req.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ error: 'Requête refusée' }, { status: 403 })
  }
  const visitor = takeHit(`checkout:${clientAddress(req)}`, PER_VISITOR)
  if (!visitor.ok) {
    return NextResponse.json({ error: 'Trop de tentatives de paiement. Réessayez dans quelques minutes.' }, { status: 429, headers: { 'Retry-After': String(visitor.retryAfterSec) } })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  try {
    // The customer comes back to the address they are browsing (localhost, a preview, the real domain).
    const outcome = await startCheckout(parseCheckoutRequest(body), new URL(req.url).origin)
    if (outcome.status === 'changed') {
      const { status: _status, ...changed } = outcome
      return NextResponse.json(changed, { status: 409 })
    }
    return NextResponse.json({ url: outcome.url, orderRef: outcome.orderRef })
  } catch (err) {
    if (err instanceof CheckoutError) return NextResponse.json({ error: err.message }, { status: err.status })
    console.error('[api/checkout]', err)
    return NextResponse.json({ error: 'Le paiement est momentanément indisponible. Réessayez dans quelques minutes.' }, { status: 502 })
  }
}
