import 'server-only'
import { cookies, headers } from 'next/headers'

// ---------------------------------------------------------------------------
//  "Which of these parts fit the customer's exact car?"
//
//  TecDoc gives the parts of a vehicle TYPE; when the customer was identified
//  by their plate we also know the car's VIN, and YQ (the makers' own
//  catalogues) gives the original part number(s) for that exact car. The
//  articles that carry one of them are the exact ones.
//
//  Anything missing (no VIN, other vehicle type, part type not mapped, YQ not
//  configured, down, or out of quota) simply means "no precise answer": the
//  page then shows the TecDoc list as before. It never blocks a sale.
// ---------------------------------------------------------------------------

import { articlesWithOeNumbers } from '../integrations/autoprecision/catalog.server'
import { findOeNumbers, isVin, isYqConfigured } from '../integrations/yq.server'
import { takeHit } from '../rateLimit.server'
import { PRECISE_FIT } from './config'
import { YQ_GROUPS } from './partTypes'
import { openVehicle, VEHICLE_COOKIE } from './vehicleCookie.server'

export type PreciseFit =
  /** The exact articles (tokens) among the list. */
  | { status: 'exact'; tokens: Set<string> }
  /** YQ answered, but none of the articles of the list carries the original number. */
  | { status: 'no-match' }
  /** No precise answer: show the list as it is. */
  | { status: 'none' }

// Answers already given in this server instance: browsing filters and pages of
// one list must not count as new lookups for the visitor.
const recent = new Map<string, { at: number; numbers: string[] }>()
const RECENT_MS = 15 * 60_000

export async function preciseFit(carId: number, genartId: number): Promise<PreciseFit> {
  const groups = YQ_GROUPS[genartId]
  if (!groups || !isYqConfigured()) return { status: 'none' }
  const vehicle = openVehicle((await cookies()).get(VEHICLE_COOKIE)?.value)
  // The VIN belongs to the vehicle type it was found with: on another type's pages it says nothing.
  if (!vehicle || vehicle.ktype !== carId || !isVin(vehicle.vin)) return { status: 'none' }

  const key = `${vehicle.vin}|${genartId}`
  let numbers = recent.get(key)?.at && Date.now() - recent.get(key)!.at < RECENT_MS ? recent.get(key)!.numbers : null
  if (!numbers) {
    const h = await headers()
    const visitor = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip')?.trim() || 'unknown'
    const rules = PRECISE_FIT.perVisitor.map((r) => ({ limit: r.limit, windowMs: r.windowMinutes * 60_000 }))
    if (!takeHit(`yq:${visitor}`, rules).ok) return { status: 'none' }
    try {
      numbers = (await findOeNumbers(vehicle.vin, groups)).numbers
    } catch (err) {
      console.error('[precise-fit] YQ lookup failed', err instanceof Error ? err.message : err)
      return { status: 'none' }
    }
    recent.set(key, { at: Date.now(), numbers })
    if (recent.size > 2000) for (const [k, v] of recent) if (Date.now() - v.at >= RECENT_MS) recent.delete(k)
  }
  if (!numbers.length) return { status: 'none' }

  try {
    const tokens = await articlesWithOeNumbers(carId, genartId, numbers)
    return tokens.size ? { status: 'exact', tokens } : { status: 'no-match' }
  } catch (err) {
    console.error('[precise-fit] catalogue unavailable', err)
    return { status: 'none' }
  }
}
