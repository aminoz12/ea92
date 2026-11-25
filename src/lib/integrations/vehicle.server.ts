import 'server-only'

// ---------------------------------------------------------------------------
//  Vehicle identification — server side.
//
//  Two ways to know the customer's vehicle:
//
//   1. By plate: AutoPrécision's identification API (SIV) returns the
//      registration data and the TecDoc type (KTYP). Connected
//      (source: 'siv'). Env: AUTOPRECISION_VEHICLE_API_URL,
//      AUTOPRECISION_VEHICLE_TOKEN (header X-Auth-Token).
//      Every lookup uses one credit of the account, and the account has a
//      daily limit: answers are kept for 30 days so a plate is paid for once.
//      Without the two variables (local demo) a plate returns a DEMO vehicle
//      (source: 'demo').
//
//   2. By make / model / engine, picked in the TecDoc catalogue: connected
//      (see autoprecision/catalog.server.ts). The vehicle then carries its
//      KTYP (`ktype`) and source: 'tecdoc'.
//
//  Either way the KTYP is what the catalogue needs to list compatible parts.
// ---------------------------------------------------------------------------

import { unstable_cache } from 'next/cache'
import { DEMO_VEHICLES, isValidFrenchPlate } from './vehicle'
import { brandCase, getCar, type CatalogCar } from './autoprecision/catalog.server'
import type { Vehicle } from '../shop/types'

/** The customer can act on these: the message is shown as is. Anything else is a service failure. */
export class VehicleLookupError extends Error {}

const PLATE_NOT_FOUND = 'Aucun véhicule trouvé pour cette plaque. Vérifiez-la ou choisissez votre véhicule par marque et modèle.'
const THIRTY_DAYS = 30 * 86_400

function demoVehicle(plate: string): Vehicle {
  // Deterministic: the same plate always gives the same demo vehicle.
  let h = 0
  for (const ch of plate) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const v = DEMO_VEHICLES[h % DEMO_VEHICLES.length]
  // The real plate provider returns the date of first registration (DPMC,
  // box B of the carte grise); the demo derives a stable one from the plate.
  const month = String((h % 12) + 1).padStart(2, '0')
  const day = String((h % 28) + 1).padStart(2, '0')
  return { ...v, plate, firstRegistration: `${v.year}-${month}-${day}`, source: 'demo' }
}

/** TecDoc fuel wording → the four fuels the shop shows. */
function shopFuel(fuel: string): Vehicle['fuel'] {
  const f = fuel.toLowerCase()
  if (f.includes('/') && f.includes('lectrique')) return 'Hybride' // "Essence/électrique", "Diesel/électrique"
  if (f.includes('hybrid')) return 'Hybride'
  if (f.includes('lectrique')) return 'Électrique'
  if (f.includes('diesel')) return 'Diesel'
  return 'Essence'
}

const yearOf = (yyyymm?: number) => (yyyymm ? Math.floor(yyyymm / 100) : undefined)

/** A TecDoc vehicle as the shop's `Vehicle`. `plate` is empty when it was picked by make and model. */
export function vehicleFromCatalogCar(car: CatalogCar, plate = ''): Vehicle {
  const from = yearOf(car.from)
  const to = yearOf(car.to)
  return {
    key: `ktype-${car.carId}`,
    ktype: car.carId,
    plate,
    make: car.make,
    model: car.model,
    version: car.version,
    engine: car.engineCodes[0] ?? '',
    fuel: shopFuel(car.fuel),
    // Production start: the real year of the car is only known from the plate.
    year: from ?? new Date().getFullYear(),
    yearsLabel: from ? (to ? `${from} – ${to}` : `depuis ${from}`) : undefined,
    source: 'tecdoc',
  }
}

/** Vehicle picked in the catalogue (make → model → engine). */
export async function identifyVehicleByKtype(carId: number): Promise<Vehicle> {
  return vehicleFromCatalogCar(await getCar(carId))
}

const isPlateApiConfigured = () => Boolean(process.env.AUTOPRECISION_VEHICLE_API_URL && process.env.AUTOPRECISION_VEHICLE_TOKEN)

/**
 * Answer of GET /v3/siv/{plaque}: the registration attributes are strings at
 * the root of the object (their list depends on the vehicle), next to the
 * TecDoc links.
 */
interface SivAnswer {
  liens_tecdoc?: { lien_tecdoc?: { typnr?: string }[] }[]
  [attribute: string]: unknown
}

/** First of the named attributes that is filled in. */
function attribute(answer: SivAnswer, ...names: string[]) {
  for (const name of names) {
    const value = answer[name]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return undefined
}

/** SIV dates come as YYYYMMDD. */
const isoDate = (d?: string) => (d && /^\d{8}$/.test(d) ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}` : undefined)

/** KTYPs of the answer. From 2 000 000 up the number is a heavy-vehicle type (NTYP), which the catalogue pages do not cover. */
const ktypesOf = (answer: SivAnswer) =>
  (answer.liens_tecdoc ?? [])
    .flatMap((link) => link.lien_tecdoc ?? [])
    .map((link) => Number(link.typnr))
    .filter((n) => Number.isInteger(n) && n > 0 && n < 2_000_000)

/** Registration wording ("GAZOLE", "ESS+ELEC HNR", "ELECTRIC") → the four fuels the shop shows. */
function sivFuel(answer: SivAnswer): Vehicle['fuel'] {
  const f = `${attribute(answer, 'energie') ?? ''} ${attribute(answer, 'fuel') ?? ''}`.toLowerCase()
  const electric = /[ée]lec/.test(f)
  if (f.includes('hybrid') || (electric && f.includes('+'))) return 'Hybride'
  if (electric) return 'Électrique'
  if (/gazole|diesel/.test(f)) return 'Diesel'
  return 'Essence'
}

async function lookupPlate(plate: string): Promise<Vehicle> {
  const base = (process.env.AUTOPRECISION_VEHICLE_API_URL as string).replace(/\/$/, '')
  let res: Response
  try {
    res = await fetch(`${base}/v3/siv/${encodeURIComponent(plate.replace(/-/g, ''))}?country=fr`, {
      headers: { 'X-Auth-Token': process.env.AUTOPRECISION_VEHICLE_TOKEN as string, Accept: 'application/json' },
      cache: 'no-store', // kept by `cachedLookup` below, once it is a vehicle
      signal: AbortSignal.timeout(15_000),
    })
  } catch (err) {
    throw new Error(`Plate API unreachable (${err instanceof Error ? err.message : 'network error'})`)
  }
  if (!res.ok) {
    // Documented errors are { code, description }: 07 / 119 / 201 (HTTP 404) mean
    // no vehicle, or none linked to TecDoc. In practice an unknown plate comes
    // back as HTTP 400 with the data provider's own body,
    // {"error_code":200,"error_message":"vehicle not found"} (seen 24 Nov 2026).
    // The plate format is already checked, so a 400 is "not found" unless it is
    // one of ours: 01 bad parameters, 02 token refused, 05 server unavailable.
    const problem = (await res.json().catch(() => null)) as { code?: string; description?: string; error_message?: string } | null
    const ours = ['01', '02', '05'].includes(problem?.code ?? '')
    if (res.status === 404 || (res.status === 400 && !ours)) throw new VehicleLookupError(PLATE_NOT_FOUND)
    // 04 (no credit left), 10 (daily limit), 06 (data provider down)…: ours to fix, not the customer's.
    throw new Error(`Plate API: HTTP ${res.status} ${problem?.description ?? problem?.error_message ?? ''}`.trim())
  }

  const answer = (await res.json()) as SivAnswer
  // A plate can come back with several KTYPs; the first one is the API's best match.
  const [ktype] = ktypesOf(answer)
  if (!ktype) throw new VehicleLookupError(PLATE_NOT_FOUND)

  const firstRegistration = isoDate(attribute(answer, 'date_pme', 'first_use_date'))
  const year = firstRegistration ? Number(firstRegistration.slice(0, 4)) : undefined
  const engineCode = attribute(answer, 'engine_code_equivalent', 'tec_code_moteur_tecdoc_equivalent', 'code_moteur', 'engine_code')

  let vehicle: Vehicle
  try {
    // Make, model and version worded as everywhere else in the shop.
    vehicle = vehicleFromCatalogCar(await getCar(ktype), plate)
  } catch {
    // Catalogue unreachable: the registration data is enough to name the vehicle.
    vehicle = {
      key: `ktype-${ktype}`,
      ktype,
      plate,
      make: brandCase(attribute(answer, 'marque', 'brand') ?? ''),
      model: attribute(answer, 'modele', 'model') ?? '',
      version: attribute(answer, 'version', 'version_full') ?? '',
      engine: '',
      fuel: sivFuel(answer),
      year: year ?? new Date().getFullYear(),
      source: 'siv',
    }
  }
  return {
    ...vehicle,
    source: 'siv',
    engine: vehicle.engine || engineCode || '',
    // The registration gives the real year of the car, not just its production period.
    year: year ?? vehicle.year,
    yearsLabel: year ? undefined : vehicle.yearsLabel,
    firstRegistration,
    vin: attribute(answer, 'vin'),
  }
}

/** A lookup is paid for: the same plate is asked once, then answered from the cache. Failures are not kept. */
const cachedLookup = unstable_cache(lookupPlate, ['autoprecision-siv-plate'], { revalidate: THIRTY_DAYS })

export async function identifyVehicle(plate: string): Promise<Vehicle> {
  if (!isValidFrenchPlate(plate)) throw new VehicleLookupError('Plaque invalide')
  if (!isPlateApiConfigured()) {
    // The demo vehicle is for a developer's machine. On the deployed site a
    // made-up car would list the wrong parts: say the search is unavailable.
    if (process.env.NODE_ENV === 'production') throw new Error('Plate API not configured (AUTOPRECISION_VEHICLE_API_URL / _TOKEN)')
    return demoVehicle(plate)
  }
  // Connected: never fall back to a demo vehicle, a wrong car would list the wrong parts.
  return cachedLookup(plate)
}
