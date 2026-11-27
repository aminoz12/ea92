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
const THIRTY_DAYS = 30 * 24 * 3600

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

export interface OeLookup {
  /** YQ knows this VIN. */
  vehicle: boolean
  /** Code of the YQ group that was found for the vehicle, if any. */
  group: string | null
  /** Original part numbers of that group for this exact vehicle (as YQ writes them). */
  numbers: string[]
}

/**
 * Original part numbers for one exact vehicle (by VIN) and one kind of part,
 * given as YQ group codes in order of preference (the first one the vehicle
 * has is used). Three calls to YQ.
 */
async function lookupOeNumbers(vin: string, groupCodes: string[]): Promise<OeLookup> {
  const found = await post<{ data?: { vehicles?: { navigationLinks?: Link[] }[] } }>('findVehicle', {
    token: '',
    formValues: [{ name: 'IdentString', value: vin }],
  })
  const vehicle = found.data?.vehicles?.find((v) => v.navigationLinks?.some((l) => l.action === 'getGroups'))
  if (!vehicle) return { vehicle: Boolean(found.data?.vehicles?.length), group: null, numbers: [] }

  const groupsToken = vehicle.navigationLinks!.find((l) => l.action === 'getGroups')!.token
  const tree = await post<{ data?: TreeNode }>('getGroups', { token: groupsToken, filterValues: [], currentFilterState: '' })
  const byCode = new Map<string, TreeNode>()
  const walk = (n: TreeNode) => {
    if (n.code !== undefined && n.links?.some((l) => l.action === 'getGroupParts')) byCode.set(String(n.code), n)
    for (const c of n.children ?? []) walk(c)
  }
  if (tree.data) walk(tree.data)
  const code = groupCodes.find((c) => byCode.has(c))
  if (!code) return { vehicle: true, group: null, numbers: [] }

  const partsToken = byCode.get(code)!.links!.find((l) => l.action === 'getGroupParts')!.token
  const parts = await post<{ data?: { categories?: { units?: { partSections?: { parts?: Part[] }[] }[] }[] } }>('getGroupParts', {
    token: partsToken,
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
  return { vehicle: true, group: code, numbers: [...numbers] }
}

/** The original numbers of a car do not change: kept 30 days per VIN and part type. Failures are not kept. */
export const findOeNumbers = unstable_cache(lookupOeNumbers, ['yq-oe-numbers'], { revalidate: THIRTY_DAYS })
