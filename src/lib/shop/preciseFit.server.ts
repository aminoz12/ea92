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
//  Which YQ group holds a part type: YQ's universal tree is TecDoc's classic
//  tree under other numbers (node − 89,900), so the part type's place in that
//  tree gives the group, or the nearest parent group YQ has for the car. That
//  covers every part type; YQ_GROUPS only states a preferred group.
//
//  Anything missing (no VIN, other vehicle type, YQ not configured, down, or
//  out of quota) means "no precise answer": the page then shows the TecDoc
//  list and says why when the customer can do something about it (enter
//  their plate). It never blocks a sale.
// ---------------------------------------------------------------------------

import { articlesWithOeNumbers, compact, partTypePlaces } from '../integrations/autoprecision/catalog.server'
import { groupOeParts, isVin, isYqConfigured, yqVehicle, type OePart } from '../integrations/yq.server'
import { takeHit } from '../rateLimit.server'
import { PRECISE_FIT } from './config'
import { agreed, positionFromLevels, type Position } from './position'
import { YQ_GROUPS } from './partTypes'
import { openVehicle, VEHICLE_COOKIE } from './vehicleCookie.server'

/** TecDoc classic-tree node number − this = YQ universal-tree group code. */
export const YQ_NODE_OFFSET = 89_900
/** Groups asked for one part type at most (one YQ call each). */
const MAX_GROUPS = 3

export type NoFitReason =
  /** No VIN for this vehicle type: picked by make and model, or remembered by the browser without one. */
  | 'no-vehicle'
  | 'not-configured'
  /** YQ does not know this VIN. */
  | 'vehicle-unknown'
  /** No YQ group for this part type on this car. */
  | 'unmapped'
  /** YQ's group has no original number for this car. */
  | 'no-numbers'
  | 'limited'
  /** YQ or the catalogue failed. */
  | 'unavailable'
  /** No list to filter (catalogue down or empty). */
  | 'empty'

export type PreciseFit =
  /**
   * The exact articles (tokens) among the list, each with the position the
   * maker's catalogue gives its original part (front/rear, left/right), when it does.
   */
  | { status: 'exact'; tokens: Set<string>; positions: Map<string, Position> }
  /** YQ answered, but none of the articles of the list carries the original number. */
  | { status: 'no-match' }
  /** No precise answer: show the list as it is. */
  | { status: 'none'; reason: NoFitReason }

/**
 * YQ groups to ask for one part type, best first: the preferred one if the car
 * has it, else for each place of the part type in TecDoc's classic tree the
 * deepest node YQ has a group for.
 */
export function yqGroupsFor(genartId: number, places: number[][], available: Record<string, string>): string[] {
  const preferred = (YQ_GROUPS[genartId] ?? []).find((code) => code in available)
  if (preferred) return [preferred]
  const codes = new Set<string>()
  for (const chain of places) {
    const code = chain.map((node) => String(node - YQ_NODE_OFFSET)).find((c) => c in available)
    if (code) codes.add(code)
  }
  return [...codes].slice(0, MAX_GROUPS)
}

// Answers already given in this server instance: browsing filters and pages of
// one list must not count as new lookups for the visitor.
const recent = new Map<string, { at: number; parts: OePart[]; reason?: NoFitReason }>()
const RECENT_MS = 15 * 60_000
let warnedNotConfigured = false

const none = (reason: NoFitReason, carId: number, genartId: number): PreciseFit => {
  // Server log only (Vercel → Logs): why a list was not narrowed down. Never the VIN.
  if (reason !== 'no-vehicle' && reason !== 'not-configured') console.info(`[precise-fit] car ${carId}, part type ${genartId}: ${reason}`)
  return { status: 'none', reason }
}

export async function preciseFit(carId: number, genartId: number): Promise<PreciseFit> {
  if (!isYqConfigured()) {
    if (!warnedNotConfigured) console.warn('[precise-fit] YQ_LOGIN / YQ_PASSWORD missing: the catalogue shows every TecDoc part')
    warnedNotConfigured = true
    return none('not-configured', carId, genartId)
  }
  const vehicle = openVehicle((await cookies()).get(VEHICLE_COOKIE)?.value)
  // The VIN belongs to the vehicle type it was found with: on another type's pages it says nothing.
  if (!vehicle || vehicle.ktype !== carId || !isVin(vehicle.vin)) return none('no-vehicle', carId, genartId)

  const key = `${vehicle.vin}|${genartId}`
  const seen = recent.get(key)
  let parts = seen && Date.now() - seen.at < RECENT_MS ? seen.parts : null
  if (seen && parts && seen.reason) return none(seen.reason, carId, genartId)
  if (!parts) {
    const h = await headers()
    const visitor = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip')?.trim() || 'unknown'
    const rules = PRECISE_FIT.perVisitor.map((r) => ({ limit: r.limit, windowMs: r.windowMinutes * 60_000 }))
    if (!takeHit(`yq:${visitor}`, rules).ok) return none('limited', carId, genartId)
    let reason: NoFitReason | undefined
    try {
      const [yq, places] = await Promise.all([yqVehicle(vehicle.vin), partTypePlaces(carId, genartId)])
      const codes = yq.known ? yqGroupsFor(genartId, places, yq.groups) : []
      if (!yq.known) reason = 'vehicle-unknown'
      else if (!codes.length) reason = 'unmapped'
      parts = (await Promise.all(codes.map((code) => groupOeParts(vehicle.vin, code)))).flat()
    } catch (err) {
      console.error('[precise-fit] YQ lookup failed', err instanceof Error ? err.message : err)
      return none('unavailable', carId, genartId)
    }
    recent.set(key, { at: Date.now(), parts, reason })
    if (recent.size > 2000) for (const [k, v] of recent) if (Date.now() - v.at >= RECENT_MS) recent.delete(k)
    if (reason) return none(reason, carId, genartId)
  }
  if (!parts.length) return none('no-numbers', carId, genartId)

  try {
    const carried = await articlesWithOeNumbers(carId, genartId, [...new Set(parts.map((p) => p.number))])
    if (!carried.size) return { status: 'no-match' }
    // Where each original number goes on this car, from the names the maker's catalogue gives it.
    const whereOf = new Map<string, Position[]>()
    for (const p of parts) {
      const n = compact(p.number)
      whereOf.set(n, [...(whereOf.get(n) ?? []), positionFromLevels(p.where)])
    }
    const positions = new Map<string, Position>()
    for (const [token, numbers] of carried) positions.set(token, agreed(numbers.flatMap((n) => whereOf.get(n) ?? [])))
    return { status: 'exact', tokens: new Set(carried.keys()), positions }
  } catch (err) {
    console.error('[precise-fit] catalogue unavailable', err)
    return none('unavailable', carId, genartId)
  }
}
