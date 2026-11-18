import { NextResponse } from 'next/server'
import { identifyVehicle, VehicleLookupError } from '@/lib/integrations/vehicle.server'

// POST { plate: "AA-123-BB" } → { vehicle }
export async function POST(req: Request) {
  let plate = ''
  try {
    const body = (await req.json()) as { plate?: unknown }
    plate = typeof body.plate === 'string' ? body.plate.trim().toUpperCase() : ''
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  try {
    const vehicle = await identifyVehicle(plate)
    return NextResponse.json({ vehicle })
  } catch (err) {
    if (err instanceof VehicleLookupError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    console.error('[api/vehicle/identify]', err)
    return NextResponse.json({ error: 'Service indisponible' }, { status: 502 })
  }
}
