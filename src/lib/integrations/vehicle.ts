// ---------------------------------------------------------------------------
//  Vehicle identification — shared (client-safe) part.
//  The server lookup lives in vehicle.server.ts.
// ---------------------------------------------------------------------------

import type { PublicProduct, Vehicle } from '../shop/types'

// French SIV plate: AA-123-BB (letters I, O and U are never issued).
const PLATE_LETTER = '[A-HJ-NP-TV-Z]'
export const FRENCH_PLATE_RE = new RegExp(`^${PLATE_LETTER}{2}-[0-9]{3}-${PLATE_LETTER}{2}$`)

export const isValidFrenchPlate = (value: string) => FRENCH_PLATE_RE.test(value)

/** Normalise what the customer types into the AA-123-BB shape. */
export function formatPlate(raw: string) {
  const c = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7)
  return [c.slice(0, 2), c.slice(2, 5), c.slice(5, 7)].filter(Boolean).join('-')
}

// Demo vehicles returned while the identification API is not connected.
export const DEMO_VEHICLES: Omit<Vehicle, 'plate' | 'source'>[] = [
  { key: 'peugeot-208-ii-12-puretech', make: 'Peugeot', model: '208 II', version: '1.2 PureTech 100', engine: 'EB2ADTD', fuel: 'Essence', year: 2021 },
  { key: 'renault-clio-iv-15-dci', make: 'Renault', model: 'Clio IV', version: '1.5 dCi 90', engine: 'K9K', fuel: 'Diesel', year: 2017 },
  { key: 'citroen-c3-iii-12-puretech', make: 'Citroën', model: 'C3 III', version: '1.2 PureTech 82', engine: 'EB2F', fuel: 'Essence', year: 2019 },
  { key: 'vw-golf-vii-16-tdi', make: 'Volkswagen', model: 'Golf VII', version: '1.6 TDI 115', engine: 'DGTE', fuel: 'Diesel', year: 2018 },
  { key: 'dacia-sandero-ii-15-dci', make: 'Dacia', model: 'Sandero II', version: '1.5 dCi 90', engine: 'K9K', fuel: 'Diesel', year: 2016 },
  { key: 'peugeot-308-ii-15-bluehdi', make: 'Peugeot', model: '308 II', version: '1.5 BlueHDi 130', engine: 'DV5RC', fuel: 'Diesel', year: 2020 },
  { key: 'toyota-yaris-iii-15-hybrid', make: 'Toyota', model: 'Yaris III', version: '1.5 Hybride 100h', engine: '1NZ-FXE', fuel: 'Hybride', year: 2018 },
  { key: 'renault-megane-iv-13-tce', make: 'Renault', model: 'Mégane IV', version: '1.3 TCe 140', engine: 'H5H', fuel: 'Essence', year: 2020 },
]

export const vehicleLabel = (v: Pick<Vehicle, 'make' | 'model' | 'version'>) =>
  `${v.make} ${v.model} ${v.version}`

/** Demo compatibility check — the real one comes from the catalogue API. */
export function isCompatible(product: Pick<PublicProduct, 'fits'>, vehicle?: Vehicle | null) {
  if (!vehicle) return undefined
  return product.fits === 'all' || product.fits.includes(vehicle.key)
}
