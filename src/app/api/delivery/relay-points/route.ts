import { NextResponse } from 'next/server'
import { isBoxtalConfigured, listRelayPoints } from '@/lib/integrations/boxtal.server'
import { clientAddress, takeHit } from '@/lib/rateLimit.server'
import { FULFILMENT } from '@/lib/shop/config'

// A customer looks relay points up a few times at most; each call asks Boxtal.
const PER_VISITOR = [{ limit: 20, windowMs: 10 * 60_000 }]

// POST { postalCode, city?, street? } → { configured, points }
// The relay points the customer can choose from, nearest first. `configured`
// is false while the shop has no Boxtal keys: the cart then offers relay
// delivery without a choice of relay.
export async function POST(req: Request) {
  if (req.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ error: 'Requête refusée' }, { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }
  const str = (key: string, max: number) => (typeof body[key] === 'string' ? (body[key] as string).replace(/\s+/g, ' ').trim().slice(0, max) : '')
  const postalCode = str('postalCode', 5)
  if (!/^\d{5}$/.test(postalCode)) return NextResponse.json({ error: 'Code postal invalide' }, { status: 400 })

  if (!isBoxtalConfigured()) return NextResponse.json({ configured: false, points: [] })

  const visitor = takeHit(`relay:${clientAddress(req)}`, PER_VISITOR)
  if (!visitor.ok) {
    return NextResponse.json({ error: 'Trop de recherches de points relais. Réessayez dans quelques minutes.' }, { status: 429, headers: { 'Retry-After': String(visitor.retryAfterSec) } })
  }

  try {
    const points = await listRelayPoints({ postalCode, city: str('city', 80), street: str('street', 120) })
    return NextResponse.json({ configured: true, points: points.slice(0, FULFILMENT.parcel.relayPointsShown) }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('[api/delivery/relay-points]', err)
    return NextResponse.json({ configured: true, points: [], error: 'Les points relais sont momentanément indisponibles. Réessayez, ou choisissez la livraison à domicile.' }, { status: 502 })
  }
}
