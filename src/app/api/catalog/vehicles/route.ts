import { NextResponse } from 'next/server'
import { CatalogError, listBrandModels, listCarBrands } from '@/lib/integrations/autoprecision/catalog.server'
import { identifyVehicleByKtype } from '@/lib/integrations/vehicle.server'

// Vehicle selector, step by step. The catalogue key stays on the server.
//   GET /api/catalog/vehicles            → { brands }
//   GET /api/catalog/vehicles?brand=88   → { models } (each with its engines)
//   GET /api/catalog/vehicles?car=136530 → { vehicle } (ready for the shop context)
const id = (value: string | null) => (value && /^\d{1,9}$/.test(value) ? Number(value) : null)

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const car = params.get('car')
  const brand = params.get('brand')

  try {
    if (car !== null) {
      const carId = id(car)
      if (carId === null) return NextResponse.json({ error: 'Véhicule invalide' }, { status: 400 })
      return NextResponse.json({ vehicle: await identifyVehicleByKtype(carId) })
    }
    if (brand !== null) {
      const brandId = id(brand)
      if (brandId === null) return NextResponse.json({ error: 'Marque invalide' }, { status: 400 })
      return NextResponse.json({ models: await listBrandModels(brandId) })
    }
    return NextResponse.json({ brands: await listCarBrands() })
  } catch (err) {
    if (err instanceof CatalogError && err.status === 404) {
      return NextResponse.json({ error: 'Véhicule introuvable' }, { status: 404 })
    }
    console.error('[api/catalog/vehicles]', err)
    return NextResponse.json({ error: 'Catalogue momentanément indisponible' }, { status: 503 })
  }
}
