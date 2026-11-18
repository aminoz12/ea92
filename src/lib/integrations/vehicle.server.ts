import 'server-only'

// ---------------------------------------------------------------------------
//  Vehicle identification ("YQ") — server side.
//
//  How it should work in production:
//   1. plate → VIN / K-type : needs a SIV-licensed plate provider
//      (env: PLATE_API_URL, PLATE_API_KEY).
//   2. VIN → exact vehicle + compatible parts : YQ Service (ACIS) catalogue,
//      which identifies vehicles from the VIN (env: YQ_API_URL, YQ_API_KEY).
//
//  Until both are configured, `identifyVehicle` returns a DEMO vehicle
//  (source: 'demo') so the whole shop flow can be tested end to end.
// ---------------------------------------------------------------------------

import { DEMO_VEHICLES, isValidFrenchPlate } from './vehicle'
import type { Vehicle } from '../shop/types'

export class VehicleLookupError extends Error {}

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

const isConfigured = () =>
  Boolean(
    process.env.PLATE_API_URL &&
      process.env.PLATE_API_KEY &&
      process.env.YQ_API_URL &&
      process.env.YQ_API_KEY,
  )

async function lookupWithProviders(plate: string): Promise<Vehicle> {
  // TODO(integration): implement once the provider contracts are signed.
  //  - call the SIV plate provider with `plate` → { vin, ktype, make, model… }
  //  - call YQ with the VIN → exact version + catalogue vehicle id
  //  - map the answer to `Vehicle` with source: 'yq'
  // Keep the API keys server-side: this module is never bundled for the browser.
  throw new VehicleLookupError(`Vehicle providers configured but adapter not implemented (${plate})`)
}

export async function identifyVehicle(plate: string): Promise<Vehicle> {
  if (!isValidFrenchPlate(plate)) throw new VehicleLookupError('Plaque invalide')
  if (!isConfigured()) return demoVehicle(plate)
  try {
    return await lookupWithProviders(plate)
  } catch (err) {
    console.error('[vehicle] provider lookup failed, falling back to demo', err)
    return demoVehicle(plate)
  }
}
