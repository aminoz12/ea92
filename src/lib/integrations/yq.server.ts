import 'server-only'
import { unstable_cache } from 'next/cache'

// ---------------------------------------------------------------------------
//  YQ Service — the car makers' own parts catalogues (WS.OEM REST API v2).
//
//  Why: TecDoc lists every part that fits a vehicle TYPE (dozens of brake pad
//  sets for a Fiat 500 1.2). The maker's catalogue, asked with the car's VIN,
//  knows the exact car as it left the factory and gives the original part
//  number(s) for it. The shop then keeps the TecDoc articles that carry that
//  original number: same car, the right part, still several brands to choose.
//
//  Calls (OpenAPI file of https://oem-api.yqservice.eu, read on 27 Nov 2026):
//   1. POST /restApi/v2/findVehicle   {token:"", formValues:[{name:"IdentString", value:VIN}]}
//      → vehicles[], each with navigationLinks; "getGroups" opens the YQ
//        universal tree (the same group codes for every make).
//   2. POST /restApi/v2/getGroups     {token, filterValues:[], currentFilterState:""}
//      → tree of groups {code, name, children, links[getGroupParts…]}
//   3. POST /restApi/v2/getGroupParts {token, filterValues:[], currentFilterState:""}
//      → units with their parts; the parts of the group have `matched: true`.
//  Every token comes from the previous answer. HTTP Basic auth with the shop's
//  YQ login (the same as for the demo, said YQ).
//
//  The original numbers never leave the server: they only select articles
//  (see the owner's rule in lib/shop/articleToken.server.ts).
//
//  Env: YQ_LOGIN, YQ_PASSWORD, YQ_API_URL (optional, default below).
// ---------------------------------------------------------------------------

const DEFAULT_URL = 'https://oem-api.yqservice.eu'
const ONE_DAY = 24 * 3600
const THIRTY_DAYS = 30 * ONE_DAY

export class YqError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
  }
}

export const isYqConfigured = () => Boolean(process.env.YQ_LOGIN && process.env.YQ_PASSWORD)

const baseUrl = () => {
  const raw = (process.env.YQ_API_URL ?? '').trim().replace(/\/+$/, '')
  if (!raw) return DEFAULT_URL
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
}

/** 17 characters, letters and digits, never I, O or Q: what a VIN looks like. */
export const isVin = (value: string) => /^[A-HJ-NPR-Z0-9]{17}$/.test(value)

interface Link {
  action?: string
  token?: string
  code?: string
}
interface TreeNode {
  code?: string | number
  name?: string
  children?: TreeNode[]
  links?: Link[]
}
interface Part {
  partNumber?: string
  matched?: boolean | null
}

async function post<T>(action: string, body: unknown): Promise<T> {
  const login = process.env.YQ_LOGIN
  const password = process.env.YQ_PASSWORD
  if (!login || !password) throw new YqError('YQ non configuré')
  let res: Response
  try {
    res = await fetch(`${baseUrl()}/restApi/v2/${action}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
      // The answers carry tokens and can be large (the tree of a vehicle is ~700 kB): never kept by Next.
      cache: 'no-store',
      signal: AbortSignal.timeout(12_000),
    })
  } catch (err) {
    throw new YqError(`YQ injoignable (${err instanceof Error ? err.message : 'erreur réseau'})`)
  }
  if (!res.ok) throw new YqError(`YQ ${action} : HTTP ${res.status}`, res.status)
  return (await res.json()) as T
}

/** One vehicle in YQ's universal tree. */
export interface YqVehicle {
  /** YQ knows this VIN. */
  known: boolean
  /** The groups this vehicle has: group code → token of the call that lists its parts. */
  groups: Record<string, string>
}

/** Two calls: the vehicle by its VIN, then its tree of groups. */
async function loadVehicle(vin: string): Promise<YqVehicle> {
  const found = await post<{ data?: { vehicles?: { navigationLinks?: Link[] }[] } }>('findVehicle', {
    token: '',
    formValues: [{ name: 'IdentString', value: vin }],
  })
  const vehicle = found.data?.vehicles?.find((v) => v.navigationLinks?.some((l) => l.action === 'getGroups'))
  if (!vehicle) return { known: Boolean(found.data?.vehicles?.length), groups: {} }

  const groupsToken = vehicle.navigationLinks!.find((l) => l.action === 'getGroups')!.token
  const tree = await post<{ data?: TreeNode }>('getGroups', { token: groupsToken, filterValues: [], currentFilterState: '' })
  const groups: Record<string, string> = {}
  const walk = (n: TreeNode) => {
    const token = n.links?.find((l) => l.action === 'getGroupParts')?.token
    if (n.code !== undefined && token) groups[String(n.code)] = token
    for (const c of n.children ?? []) walk(c)
  }
  if (tree.data) walk(tree.data)
  return { known: true, groups }
}

/**
 * The vehicle's groups, kept one day: browsing several part types of one car
 * then costs one call each instead of three. (A token was still accepted 24 h
 * later on 28 Nov 2026; a refused one is renewed, see groupNumbers.)
 */
export const yqVehicle = unstable_cache(loadVehicle, ['yq-vehicle-groups'], { revalidate: ONE_DAY })

/** One call: the original numbers of one group, for the vehicle the token was made for. */
async function partsOf(token: string): Promise<string[]> {
  const parts = await post<{ data?: { categories?: { units?: { partSections?: { parts?: Part[] }[] }[] }[] } }>('getGroupParts', {
    token,
    filterValues: [],
    currentFilterState: '',
  })
  const numbers = new Set<string>()
  for (const c of parts.data?.categories ?? [])
    for (const u of c.units ?? [])
      for (const s of u.partSections ?? [])
        for (const p of s.parts ?? []) {
          const n = (p.partNumber ?? '').trim()
          // `matched` marks the parts of the group; the others are the rest of the assembly (caliper, bracket…).
          if (p.matched === true && n && !/^\*+$/.test(n)) numbers.add(n)
        }
  return [...numbers]
}

async function groupNumbers(vin: string, code: string): Promise<string[]> {
  const token = (await yqVehicle(vin)).groups[code]
  if (!token) return []
  try {
    return await partsOf(token)
  } catch (err) {
    // A token kept from yesterday may have been refused: once more with fresh ones.
    if (!(err instanceof YqError) || !err.status || err.status >= 500) throw err
    const fresh = (await loadVehicle(vin)).groups[code]
    return fresh ? partsOf(fresh) : []
  }
}

/**
 * Original part numbers (as YQ writes them) of one YQ group for one exact
 * vehicle. A car's original numbers do not change: kept 30 days per VIN and
 * group. Failures are not kept.
 */
export const groupOeNumbers = unstable_cache(groupNumbers, ['yq-group-numbers'], { revalidate: THIRTY_DAYS })
