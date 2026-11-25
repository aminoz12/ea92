'use client'

// The step between "I typed a part name" and the parts: which vehicle?
//
// A part only means something for a vehicle, so the search never runs without
// one. A visitor whose vehicle is already known goes straight on; the others
// are asked for their plate first (or for make and model when they do not have
// it at hand), then land on the part they typed.

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useShop } from '@/providers/ShopProvider'
import type { CatalogBrand } from '@/lib/integrations/autoprecision/catalog.server'
import { Icon } from '@/components/ui/Icon'
import { VehiclePicker } from './VehiclePicker'
import { VehicleSelector } from './VehicleSelector'

export function PartSearchGate({ query, brands }: { query: string; brands: CatalogBrand[] }) {
  const router = useRouter()
  const { vehicle, hydrated } = useShop()
  const ktype = hydrated ? vehicle?.ktype : undefined
  const suffix = query ? `?q=${encodeURIComponent(query)}` : ''

  useEffect(() => {
    if (ktype) router.replace(`/pieces/${ktype}${suffix}`)
  }, [ktype, suffix, router])

  // Not known yet, or on the way to the parts: nothing to ask.
  if (!hydrated || ktype) {
    return (
      <p className="mt-6 flex items-center gap-2 text-gray-600" aria-busy="true">
        <Icon name="refresh" className="h-4 w-4 animate-spin" /> Recherche des pièces pour votre véhicule…
      </p>
    )
  }

  return (
    <>
      <div className="mt-6 overflow-hidden rounded-xl border-l-4 border-secondary-600 bg-gray-900 p-5 sm:p-7">
        <h2 className="font-display text-2xl font-bold leading-tight text-white lg:text-3xl">
          Pour quel véhicule ? <span className="text-secondary-500">Votre plaque suffit</span>
        </h2>
        <p className="mb-5 mt-1 max-w-2xl text-sm text-white/70 sm:text-base">
          {query ? `« ${query} » : la bonne pièce dépend du véhicule. ` : ''}Entrez votre plaque, nous affichons uniquement les pièces qui se montent dessus, avec leur prix.
        </p>
        <div className="max-w-2xl">
          <VehiclePicker tone="dark" size="lg" submitLabel="Trouver mes pièces" autoFocus />
        </div>
        {vehicle && !vehicle.ktype && (
          <p className="mt-3 max-w-2xl text-sm text-white/70">
            Ce véhicule n’est pas encore relié à notre catalogue en ligne. Choisissez-le par marque et modèle ci-dessous, ou{' '}
            <Link href="/contact" className="font-semibold text-white underline underline-offset-4 hover:text-signal-400">
              contactez-nous
            </Link>
            .
          </p>
        )}
      </div>

      {brands.length > 0 && (
        <div className="mt-6 rounded-xl bg-white p-5 ring-1 ring-gray-200 sm:p-7">
          <h2 className="font-display text-xl font-bold leading-tight text-gray-900">Pas la plaque sous la main ?</h2>
          <p className="mb-5 mt-1 text-sm text-gray-600 sm:text-base">Choisissez la marque, le modèle et la motorisation : la carte grise ou le nom du modèle suffit.</p>
          <VehicleSelector brands={brands} tone="light" query={query} />
        </div>
      )}
    </>
  )
}
