import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCar, articlesWithOeNumbers, compact, partTypePlaces } from '@/lib/integrations/autoprecision/catalog.server'
import { agreed, positionFromLevels, positionLabel, type Position } from '@/lib/shop/position'
import { isVin, isYqConfigured, yqCredentialShape, yqPartsOf, yqVehicle, yqVehicleFresh, yqWhoAmI } from '@/lib/integrations/yq.server'
import { clientAddress, takeHit } from '@/lib/rateLimit.server'
import { yqGroupsFor } from '@/lib/shop/preciseFit.server'
import { openVehicle, VEHICLE_COOKIE } from '@/lib/shop/vehicleCookie.server'

// ---------------------------------------------------------------------------
//  GET /api/diag/exact-fit[?genart=402]  — Preview deployments only.
//
//  Runs each link of the "exact parts" chain FROM THE SERVER (Vercel), so a
//  failure that only happens there (an environment value, an address the
//  supplier refuses) shows up. Prints statuses and counts only: no key, no
//  VIN, no part number (the owner's rule, lib/shop/articleToken.server.ts).
//  Open it in the browser after a plate search, so the vehicle cookie is there.
// ---------------------------------------------------------------------------

export const dynamic = 'force-dynamic'

const RULES = [{ limit: 10, windowMs: 10 * 60_000 }]

async function status(url: string, headers: Record<string, string>) {
  const t = Date.now()
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json', ...headers }, cache: 'no-store', signal: AbortSignal.timeout(12_000) })
    return { http: res.status, ms: Date.now() - t }
  } catch (err) {
    return { http: null, ms: Date.now() - t, error: err instanceof Error ? err.message : 'network error' }
  }
}

const failure = (err: unknown) => (err instanceof Error ? err.message : String(err))

export async function GET(req: Request) {
  // Production never answers: this page only helps while testing.
  if (process.env.VERCEL_ENV === 'production' || (!process.env.VERCEL_ENV && process.env.NODE_ENV === 'production')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (!takeHit(`diag:${clientAddress(req)}`, RULES).ok) return NextResponse.json({ error: 'Trop de vérifications, réessayez dans 10 minutes' }, { status: 429 })

  const genart = Number(new URL(req.url).searchParams.get('genart') || 402)
  const report: Record<string, unknown> = {
    deployment: { env: process.env.VERCEL_ENV ?? 'local', region: process.env.VERCEL_REGION ?? null, commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null },
  }

  // 1. YQ: are the values there, do they look right, does YQ accept them from here?
  report.yq = { configured: isYqConfigured(), ...yqCredentialShape(), whoAmI: isYqConfigured() ? await yqWhoAmI() : 'skipped' }

  // 2. AutoPrécision from this server (since 27 Nov they may filter by address): plate API account route (free), catalogue.
  const plateBase = process.env.AUTOPRECISION_VEHICLE_API_URL?.replace(/\/$/, '')
  const catBase = process.env.AUTOPRECISION_CATALOG_API_URL?.replace(/\/$/, '')
  report.plateApi = plateBase && process.env.AUTOPRECISION_VEHICLE_TOKEN ? await status(`${plateBase}/user`, { 'X-Auth-Token': process.env.AUTOPRECISION_VEHICLE_TOKEN }) : 'not configured'
  report.catalogue = catBase && process.env.AUTOPRECISION_CATALOG_KEY ? await status(`${catBase}/carbrands?pv=true`, { 'X-Auth-Token': process.env.AUTOPRECISION_CATALOG_KEY, 'X-Lang': 'fr', 'X-Country': 'FR' }) : 'not configured'

  // 3. The visitor's exact vehicle (set by a plate search on this site).
  const raw = (await cookies()).get(VEHICLE_COOKIE)?.value
  const vehicle = openVehicle(raw)
  report.vehicleCookie = { present: Boolean(raw), readable: Boolean(vehicle), ktype: vehicle?.ktype ?? null, vinLooksRight: vehicle ? isVin(vehicle.vin) : false }
  if (!vehicle || !isVin(vehicle.vin) || !isYqConfigured()) {
    report.next = !raw ? 'No vehicle cookie: search your plate on the site first, then open this page again.' : 'Stopped before asking YQ (see above).'
    return NextResponse.json(report, { headers: { 'Cache-Control': 'no-store' } })
  }

  // 4. YQ for this car: from the cache the pages use, then fresh.
  try {
    const cached = await yqVehicle(vehicle.vin)
    report.yqVehicleCached = { known: cached.known, groups: Object.keys(cached.groups).length }
  } catch (err) {
    report.yqVehicleCached = { error: failure(err) }
  }
  let groups: Record<string, string> = {}
  try {
    const t = Date.now()
    const fresh = await yqVehicleFresh(vehicle.vin)
    groups = fresh.groups
    report.yqVehicleFresh = { known: fresh.known, groups: Object.keys(fresh.groups).length, ms: Date.now() - t }
  } catch (err) {
    report.yqVehicleFresh = { error: failure(err) }
  }

  // 5. One part type: where it sits, which YQ groups, how many original numbers, how many TecDoc articles keep.
  try {
    const [car, places] = await Promise.all([getCar(vehicle.ktype), partTypePlaces(vehicle.ktype, genart)])
    const codes = yqGroupsFor(genart, places, groups)
    const numbers = new Set<string>()
    const where = new Map<string, Position[]>()
    for (const code of codes)
      for (const p of await yqPartsOf(groups[code])) {
        numbers.add(p.number)
        where.set(compact(p.number), [...(where.get(compact(p.number)) ?? []), positionFromLevels(p.where)])
      }
    const exact = numbers.size ? await articlesWithOeNumbers(vehicle.ktype, genart, [...numbers]) : new Map<string, string[]>()
    // How the exact parts split by position (what the page groups them by, before TecDoc's own side).
    const byPosition: Record<string, number> = {}
    for (const carried of exact.values()) {
      const label = positionLabel(agreed(carried.flatMap((n) => where.get(n) ?? []))) || '(no position from YQ)'
      byPosition[label] = (byPosition[label] ?? 0) + 1
    }
    report.partType = { genart, car: `${car.make} ${car.model}`, placesInTecDocTree: places.length, yqGroups: codes, originalNumbers: numbers.size, exactArticles: exact.size, byPosition }
  } catch (err) {
    report.partType = { genart, error: failure(err) }
  }
  return NextResponse.json(report, { headers: { 'Cache-Control': 'no-store' } })
}
