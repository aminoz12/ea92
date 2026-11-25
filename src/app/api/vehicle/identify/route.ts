import { NextResponse } from 'next/server'
import { isValidFrenchPlate } from '@/lib/integrations/vehicle'
import { identifyVehicle, VehicleLookupError } from '@/lib/integrations/vehicle.server'
import { clientAddress, takeHit, type RateRule } from '@/lib/rateLimit.server'
import { PLATE_LOOKUP } from '@/lib/shop/config'

const rules = (list: readonly { limit: number; windowMinutes: number }[]): RateRule[] =>
  list.map((r) => ({ limit: r.limit, windowMs: r.windowMinutes * 60_000 }))
const PER_VISITOR = rules(PLATE_LOOKUP.perVisitor)
const EVERYONE = rules(PLATE_LOOKUP.everyone)

const tooMany = (error: string, retryAfterSec: number) =>
  NextResponse.json({ error }, { status: 429, headers: { 'Retry-After': String(retryAfterSec) } })

// POST { plate: "AA-123-BB" } → { vehicle }
// A lookup costs a credit: the route only serves this site's own pages, and
// each visitor, then all visitors together, are limited (see PLATE_LOOKUP).
export async function POST(req: Request) {
  // Browsers say where a request comes from; a page of another site has no business here.
  if (req.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ error: 'Requête refusée' }, { status: 403 })
  }

  let plate = ''
  try {
    const body = (await req.json()) as { plate?: unknown }
    plate = typeof body.plate === 'string' ? body.plate.trim().toUpperCase() : ''
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }
  // Checked before counting: a badly typed plate costs nothing and must not use up the visitor's tries.
  if (!isValidFrenchPlate(plate)) return NextResponse.json({ error: 'Plaque invalide' }, { status: 400 })

  const visitor = takeHit(`plate:${clientAddress(req)}`, PER_VISITOR)
  if (!visitor.ok) {
    const minutes = Math.max(1, Math.ceil(visitor.retryAfterSec / 60))
    const wait = minutes > 90 ? 'demain' : `dans ${minutes} minute${minutes > 1 ? 's' : ''}`
    return tooMany(`Trop de recherches par plaque depuis votre connexion. Réessayez ${wait}, ou choisissez votre véhicule par marque et modèle.`, visitor.retryAfterSec)
  }
  const everyone = takeHit('plate:*', EVERYONE)
  if (!everyone.ok) {
    return tooMany('La recherche par plaque est très demandée en ce moment. Choisissez votre véhicule par marque et modèle.', everyone.retryAfterSec)
  }

  try {
    const vehicle = await identifyVehicle(plate)
    return NextResponse.json({ vehicle })
  } catch (err) {
    if (err instanceof VehicleLookupError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    console.error('[api/vehicle/identify]', err)
    return NextResponse.json(
      { error: 'La recherche par plaque est indisponible pour le moment. Choisissez votre véhicule par marque et modèle.' },
      { status: 502 },
    )
  }
}
