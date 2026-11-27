import 'server-only'
import { articleToken } from '../../shop/articleToken.server'
import { articleWeightKg, isParcelForbidden } from '../../shop/weight'

// ---------------------------------------------------------------------------
//  AutoPrécision — TecDoc catalogue API ("MegaWS"), server side only.
//
//  Read-only client: vehicles (brand → model → engine), part families for a
//  vehicle, articles of a family for a vehicle. The key never reaches the
//  browser: pages and /api/catalog/* call these functions on the server.
//
//  Env: AUTOPRECISION_CATALOG_API_URL, AUTOPRECISION_CATALOG_KEY
//  Auth: header X-Auth-Token. A vehicle id ("carId") is the TecDoc KTYP.
//
//  The API also has write and admin routes (PUT/POST/DELETE on /seller,
//  /admin, /bodata, /picsize, /kg). Nothing here calls them, on purpose.
// ---------------------------------------------------------------------------

/** Article and brand pictures are served from this CDN (the path comes from the API). */
const CDN = 'https://cdn.autoprecision.fr'
/** TecDoc tree for passenger cars and light vans. */
const LIGHT_VEHICLE_TREE = 2
/**
 * TecDoc's classic tree for passenger cars: YQ's universal tree uses the same
 * nodes, numbered 89,900 lower (Brake Pad 100030 = YQ 10130, checked on every
 * node of a Fiat 500 on 28 Nov 2026). See lib/shop/preciseFit.server.ts.
 */
const CLASSIC_TREE = 1
/** Catalogue data changes with TecDoc releases, not during the day. */
const ONE_DAY = 86_400

export class CatalogError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
  }
}

export const isCatalogConfigured = () => Boolean(process.env.AUTOPRECISION_CATALOG_API_URL && process.env.AUTOPRECISION_CATALOG_KEY)

async function call<T>(path: string, body?: unknown): Promise<T> {
  const base = process.env.AUTOPRECISION_CATALOG_API_URL
  const key = process.env.AUTOPRECISION_CATALOG_KEY
  if (!base || !key) throw new CatalogError('Catalogue non configuré')

  let res: Response
  try {
    res = await fetch(base.replace(/\/$/, '') + path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        'X-Auth-Token': key,
        'X-Lang': 'fr',
        'X-Country': 'FR',
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      next: { revalidate: ONE_DAY },
      signal: AbortSignal.timeout(15_000),
    })
  } catch (err) {
    throw new CatalogError(`Catalogue injoignable (${err instanceof Error ? err.message : 'erreur réseau'})`)
  }
  if (!res.ok) throw new CatalogError(`Catalogue : HTTP ${res.status}`, res.status)
  return (await res.json()) as T
}

const picture = (img?: RawPicture | null) => (img?.default ? `${CDN}/${img.default}` : undefined)

/* ------------------------------------------------------------------ */
/*  Raw API shapes (only the fields we read)                           */
/* ------------------------------------------------------------------ */

interface RawPicture {
  default?: string
  orig?: string
}
interface RawEngine {
  carId: number
  carName: string
  yearOfConstrFrom?: number
  yearOfConstrTo?: number
  powerHp?: number
  powerKw?: number
  fuelType?: string
  bodyType?: string
}
interface RawModel {
  modelId: number
  name: string
  yearFrom?: number
  yearTo?: number
  engines?: { fuel: string; list: RawEngine[] }[]
}
interface RawCar {
  carId: number
  carName: string
  manuName: string
  modelName: string
  fname?: string
  yearOfConstrFrom?: number
  yearOfConstrTo?: number
  powerHP?: number
  powerKW?: number
  engine?: { fuelType?: string; bodyType?: string; mcodes?: string[] }
}
interface RawTreeNode {
  nodeId: number
  desc: string
  childs?: RawTreeNode[]
  genarts?: { aid: number; name: string }[]
}
interface RawAttribute {
  aid: number
  name: string
  type?: string
  unit?: string
  val?: { txt?: string; immediate_display?: boolean }[]
}
interface RawArticle {
  id: string
  artNr: string
  dlNr: number
  description?: string
  brand?: { name?: string; img?: RawPicture }
  attrs?: RawAttribute[]
  iattrs?: RawAttribute[]
  genArts?: { aid: number; name: string }[]
  docs?: RawPicture[]
  eans?: { ean: string }[]
  oems?: { brand: string; refs: string[] }[]
  replby?: string[]
}

/* ------------------------------------------------------------------ */
/*  Public shapes (safe to send to the browser: no key, no prices)     */
/* ------------------------------------------------------------------ */

export interface CatalogBrand {
  id: number
  name: string
}
export interface CatalogEngine {
  carId: number
  name: string
  fuel: string
  powerHp?: number
  /** Production period as YYYYMM, as TecDoc gives it. */
  from?: number
  to?: number
}
export interface CatalogModel {
  modelId: number
  name: string
  from?: number
  to?: number
  engines: CatalogEngine[]
}
export interface CatalogCar {
  carId: number
  make: string
  model: string
  version: string
  fuel: string
  body?: string
  powerHp?: number
  powerKw?: number
  from?: number
  to?: number
  engineCodes: string[]
}
export interface CatalogGenart {
  id: number
  name: string
}
export interface CatalogFamily {
  nodeId: number
  name: string
  /** Sub-groups, each with the part types ("genarts") it contains. */
  groups: { name: string; genarts: CatalogGenart[] }[]
  genartCount: number
}
export interface CatalogAttribute {
  name: string
  value: string
}
/**
 * An article as the pages may use it. On purpose it carries NO reference: not
 * the part number, not the OE numbers, not the EAN. The owner does not want a
 * customer to be able to read them (see shop/articleToken.server.ts); the only
 * handle on the article is its opaque `token`.
 */
export interface CatalogArticle {
  /** Opaque id; the server turns it back into the reference when it needs it. */
  token: string
  /** TecDoc brand code, used to filter a list by brand. Not a secret: the brand name is shown. */
  dlNr: number
  brand: string
  brandLogo?: string
  image?: string
  designation?: string
  genart?: CatalogGenart
  /** Attributes that depend on the vehicle (disc diameter, build dates…). */
  fitment: CatalogAttribute[]
  /** Attributes of the part itself. */
  attributes: CatalogAttribute[]
  /** Fitting side, when TecDoc gives one (e.g. "Essieu avant"). */
  side?: string
  /** Shipping weight of one article, kg (catalogue weight, else typical weight of the part type). */
  weightKg: number
  /** May not travel as a parcel (starter battery). */
  parcelForbidden: boolean
}

/* ------------------------------------------------------------------ */
/*  Mapping                                                            */
/* ------------------------------------------------------------------ */

/** "PEUGEOT" → "Peugeot", "MERCEDES-BENZ" → "Mercedes-Benz"; short names such as BMW stay as they are. */
export const brandCase = (name: string) =>
  name.length <= 3 ? name : name.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase())

/** "208 II (UB_, UP_, UW_, UJ_)" → "208 II": the chassis codes mean nothing to a customer. */
const modelLabel = (name: string) => name.replace(/\s*\([^)]*\)\s*$/, '').trim()

/** TecDoc criterion 100 is the fitting side ("Côté d’assemblage"). */
const SIDE_ATTRIBUTE = 100

function attribute(a: RawAttribute): CatalogAttribute | null {
  const values = (a.val ?? []).map((v) => v.txt?.trim()).filter((v): v is string => Boolean(v))
  if (!values.length) return null
  const numeric = a.type === 'N'
  const shown = values.map((v) => {
    // Build dates come as YYYYMM ("Année à partir de : 201907").
    if (/^\d{6}$/.test(v) && /^Année/i.test(a.name)) return `${v.slice(4)}/${v.slice(0, 4)}`
    return numeric ? v.replace(/\.0+$/, '').replace('.', ',') : v
  })
  const unit = numeric && a.unit ? ` ${a.unit}` : ''
  return { name: a.name.replace(/\s*\[[^\]]*\]\s*$/, '').trim(), value: shown.join(', ') + unit }
}

/** TecDoc flags the attributes worth showing first (`immediate_display`); the others follow. */
const attributes = (list?: RawAttribute[]) => {
  const all = list ?? []
  const key = all.filter((a) => (a.val ?? []).some((v) => v.immediate_display))
  const rest = all.filter((a) => !key.includes(a))
  return [...key, ...rest].map(attribute).filter((a): a is CatalogAttribute => a !== null)
}

/**
 * Attributes whose very purpose is to identify the part: its number at another
 * brand, an original-equipment number, an industry code (WVA, FMSI), an
 * approval mark. With one of them a customer finds the same part elsewhere.
 * Fitment criteria such as "pour numéro OPR" or the engine code are kept.
 */
const IDENTIFYING_ATTRIBUTE =
  /WVA|FMSI|num[ée]ro\s+OE|num[ée]ro\s+d.origine|num[ée]ro\s+d.article|marque de conformit|homologation|\br[ée]f[ée]rence\b|\bEAN\b|\bGTIN\b/i

const compact = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '')

/** The article's own weight when the catalogue gives it ("Poids [kg]", "Poids net [g]"), kg. */
function catalogueWeightKg(a: RawArticle): number | undefined {
  for (const at of [...(a.attrs ?? []), ...(a.iattrs ?? [])]) {
    if (!/^poids/i.test(at.name)) continue
    const v = parseFloat(String(at.val?.[0]?.txt ?? '').replace(',', '.'))
    if (!Number.isFinite(v) || v <= 0) continue
    const kg = /\[g\]/i.test(at.name) || /^g$/i.test(at.unit ?? '') ? v / 1000 : v
    if (kg < 200) return kg
  }
  return undefined
}

/** The part type of an article: its own, else the one of the list it was asked for. */
const partTypeOf = (a: RawArticle, listPartType?: number) => a.genArts?.[0]?.aid ?? listPartType

/** The token of an article, carrying its shipping weight and part type (see shop/articleToken.server.ts). */
function tokenOf(a: RawArticle, listPartType?: number): string {
  const partType = partTypeOf(a, listPartType)
  return articleToken(a.dlNr, a.artNr, { weightKg: articleWeightKg(catalogueWeightKg(a), partType), partType })
}

function article(a: RawArticle, listPartType?: number): CatalogArticle {
  const partType = partTypeOf(a, listPartType)
  const side = (a.iattrs ?? []).find((x) => x.aid === SIDE_ATTRIBUTE)?.val?.[0]?.txt
  // Everything that names this part somewhere: an attribute repeating one of them is dropped too.
  const own = compact(a.artNr)
  const identifiers = new Set(
    [own, ...(a.eans ?? []).map((e) => compact(e.ean)), ...(a.oems ?? []).flatMap((o) => o.refs.map(compact)), ...(a.replby ?? []).map(compact)].filter((x) => x.length >= 5),
  )
  const reveals = (text: string) => {
    const t = compact(text)
    return t.length >= 5 && (identifiers.has(t) || (own.length >= 5 && t.includes(own)))
  }
  const safe = (list?: RawAttribute[]) => (list ?? []).filter((x) => !IDENTIFYING_ATTRIBUTE.test(x.name) && !(x.val ?? []).some((v) => reveals(v.txt ?? '')))
  return {
    token: tokenOf(a, listPartType),
    dlNr: a.dlNr,
    brand: a.brand?.name ?? '',
    brandLogo: picture(a.brand?.img),
    image: picture(a.docs?.[0]),
    designation: a.description && !reveals(a.description) ? a.description : undefined,
    genart: a.genArts?.[0] ? { id: a.genArts[0].aid, name: a.genArts[0].name } : undefined,
    fitment: attributes(safe((a.iattrs ?? []).filter((x) => x.aid !== SIDE_ATTRIBUTE))),
    attributes: attributes(safe(a.attrs)),
    side: side || undefined,
    weightKg: articleWeightKg(catalogueWeightKg(a), partType),
    parcelForbidden: isParcelForbidden(partType),
  }
}

/* ------------------------------------------------------------------ */
/*  Queries                                                            */
/* ------------------------------------------------------------------ */

/** Car makes (passenger cars), A → Z. */
export async function listCarBrands(): Promise<CatalogBrand[]> {
  const raw = await call<{ id: number; name: string }[]>('/carbrands?pv=true')
  return raw.map((b) => ({ id: b.id, name: b.name })).sort((a, b) => a.name.localeCompare(b.name, 'fr'))
}

/** Models of a make, each with its engines. Most recent models first. */
export async function listBrandModels(brandId: number): Promise<CatalogModel[]> {
  const raw = await call<{ model: string; list: RawModel[] }[]>(`/carbrands/${brandId}?pv=true`)
  return raw
    .flatMap((group) => group.list)
    .map((m) => ({
      modelId: m.modelId,
      name: modelLabel(m.name),
      from: m.yearFrom,
      to: m.yearTo,
      engines: (m.engines ?? []).flatMap((g) =>
        g.list.map((e) => ({ carId: e.carId, name: e.carName, fuel: e.fuelType || g.fuel, powerHp: e.powerHp, from: e.yearOfConstrFrom, to: e.yearOfConstrTo })),
      ),
    }))
    .filter((m) => m.engines.length > 0)
    .sort((a, b) => (b.from ?? 0) - (a.from ?? 0) || a.name.localeCompare(b.name, 'fr'))
}

export async function getCar(carId: number): Promise<CatalogCar> {
  const c = await call<RawCar>(`/cars/${carId}`)
  return {
    carId: c.carId,
    make: brandCase(c.manuName),
    model: modelLabel(c.modelName),
    version: c.carName,
    fuel: c.engine?.fuelType ?? '',
    body: c.engine?.bodyType,
    powerHp: c.powerHP,
    powerKw: c.powerKW,
    from: c.yearOfConstrFrom,
    to: c.yearOfConstrTo,
    engineCodes: c.engine?.mcodes ?? [],
  }
}

function collectGroups(node: RawTreeNode, path: string[] = []): { name: string; genarts: CatalogGenart[] }[] {
  const own = (node.genarts ?? []).map((g) => ({ id: g.aid, name: g.name }))
  const here = own.length ? [{ name: path.join(' › ') || node.desc, genarts: own }] : []
  return [...here, ...(node.childs ?? []).flatMap((child) => collectGroups(child, [...path, child.desc]))]
}

/** Part families that exist for this vehicle (TecDoc tree, light vehicles). */
export async function getCarFamilies(carId: number): Promise<CatalogFamily[]> {
  const tree = await call<{ childs?: RawTreeNode[] }>(`/genartTrees/${LIGHT_VEHICLE_TREE}/car/${carId}`)
  return (
    (tree.childs ?? [])
      // The "Recherche … par image / par graphique" branches only repeat other families.
      .filter((node) => !/^Recherche /i.test(node.desc))
      .map((node) => {
        const seen = new Set<number>()
        const groups = collectGroups(node)
          .filter((g) => !/(^|› )Recherche /i.test(g.name))
          .map((g) => ({
            name: g.name,
            genarts: g.genarts.filter((x) => {
              if (seen.has(x.id)) return false
              seen.add(x.id)
              return true
            }),
          }))
          .filter((g) => g.genarts.length > 0)
        return { nodeId: node.nodeId, name: node.desc, groups, genartCount: seen.size }
      })
      .filter((family) => family.genartCount > 0)
  )
}

/**
 * Where a part type sits in TecDoc's classic tree for this vehicle: one chain
 * of node numbers per place (a part type can sit in several), the deepest
 * node first, the top-level family last.
 */
export async function partTypePlaces(carId: number, genartId: number): Promise<number[][]> {
  const tree = await call<{ childs?: RawTreeNode[] }>(`/genartTrees/${CLASSIC_TREE}/car/${carId}`)
  const places: number[][] = []
  const walk = (node: RawTreeNode, chain: number[]) => {
    const here = [node.nodeId, ...chain]
    if (node.genarts?.some((g) => g.aid === genartId)) places.push(here)
    for (const child of node.childs ?? []) walk(child, here)
  }
  for (const top of tree.childs ?? []) walk(top, [])
  return places
}

/** Articles of one part type that fit the vehicle. The API returns the whole list at once. */
export async function listCarArticles(carId: number, genartId: number): Promise<CatalogArticle[]> {
  const raw = await call<RawArticle[]>(`/v2/cars/${carId}/genart/${genartId}?PageSize=200`, {})
  return (Array.isArray(raw) ? raw : []).map((a) => article(a, genartId))
}

/**
 * Tokens of the articles of that list that carry one of these original
 * (manufacturer) part numbers. Same request as listCarArticles, so it is
 * answered from Next's cache. The numbers are compared without spaces, dots
 * or dashes ("7 736 530 6" = "77365306") and never leave the server.
 */
export async function articlesWithOeNumbers(carId: number, genartId: number, oeNumbers: string[]): Promise<Set<string>> {
  const wanted = new Set(oeNumbers.map(compact).filter((n) => n.length >= 5))
  if (!wanted.size) return new Set()
  const raw = await call<RawArticle[]>(`/v2/cars/${carId}/genart/${genartId}?PageSize=200`, {})
  return new Set(
    (Array.isArray(raw) ? raw : [])
      .filter((a) => (a.oems ?? []).some((o) => (o.refs ?? []).some((r) => wanted.has(compact(r)))))
      .map((a) => tokenOf(a, genartId)),
  )
}
