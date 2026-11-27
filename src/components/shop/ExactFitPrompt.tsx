'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useShop } from '@/providers/ShopProvider'
import { Icon } from '@/components/ui/Icon'
import type { Vehicle } from '@/lib/shop/types'
import { VehiclePicker } from './VehiclePicker'

// Shown on a parts list that could not be narrowed down to the customer's exact
// car because the server has no VIN for this vehicle type (see
// lib/shop/preciseFit.server.ts, reason 'no-vehicle'):
//  - the browser remembers this car from a plate search made before the
//    server kept the VIN: the plate is looked up again (the server keeps plate
//    answers 30 days, so this rarely costs a credit) and the list reloads;
//  - otherwise (make and model, or nothing): the customer is asked for the plate.

const triedKey = (plate: string) => `ea92-exact-fit:${plate}`
/** Same test as the server's before it keeps the VIN (lib/integrations/yq.server.ts, isVin). */
const hasVin = (v?: Vehicle) => /^[A-HJ-NPR-Z0-9]{17}$/.test(v?.vin?.trim().toUpperCase() ?? '')

export function ExactFitPrompt({ carId, genartId }: { carId: number; genartId: number }) {
  const { vehicle, hydrated, setVehicle } = useShop()
  const router = useRouter()
  const [state, setState] = useState<'checking' | 'restoring' | 'ask' | 'failed'>('checking')

  useEffect(() => {
    if (!hydrated || state !== 'checking') return
    const plate = vehicle?.source === 'siv' && vehicle.ktype === carId ? vehicle.plate : ''
    if (!plate) return setState('ask')
    let tried = false
    try {
      tried = window.sessionStorage.getItem(triedKey(plate)) === '1'
      window.sessionStorage.setItem(triedKey(plate), '1')
    } catch {}
    // Once per visit: if the plate gives no VIN, asking again would change nothing.
    if (tried) return setState('failed')
    setState('restoring')
    fetch('/api/vehicle/identify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plate }) })
      .then(async (res) => {
        const json = (await res.json()) as { vehicle?: Vehicle }
        if (!res.ok || !json.vehicle || !hasVin(json.vehicle) || json.vehicle.ktype !== carId) return setState('failed')
        setVehicle(json.vehicle)
        router.refresh()
      })
      .catch(() => setState('failed'))
  }, [hydrated, state, vehicle, carId, setVehicle, router])

  const identified = (v: Vehicle) => {
    if (v.ktype && v.ktype !== carId) router.push(`/pieces/${v.ktype}/${genartId}`)
    else if (v.ktype === carId && hasVin(v)) router.refresh()
    else setState('failed')
  }

  if (state === 'checking') return null
  if (state === 'restoring')
    return (
      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Icon name="refresh" className="h-4 w-4 animate-spin" />
        Recherche des pièces exactes pour votre véhicule…
      </p>
    )
  if (state === 'failed')
    return (
      <p className="mt-2 flex items-start gap-2 text-sm text-gray-600">
        <Icon name="info" weight="fill" className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
        Nous n’avons pas pu identifier précisément votre véhicule : la liste montre toutes les pièces du catalogue pour ce modèle. En cas de doute, écrivez-nous avant de commander.
      </p>
    )
  return (
    <div className="mt-4 rounded-xl bg-white p-5 ring-1 ring-gray-200 sm:p-6">
      <p className="flex items-start gap-2 font-display text-lg font-bold leading-tight text-gray-900">
        <Icon name="seal-check" weight="fill" className="mt-0.5 h-5 w-5 shrink-0 text-secondary-600" />
        Seulement les pièces exactes de votre voiture
      </p>
      <p className="mt-1 text-[15px] leading-snug text-gray-600">
        Cette liste montre tout le catalogue pour ce modèle. Entrez votre plaque : nous retrouvons le numéro de série de votre véhicule et la pièce montée d’origine.
      </p>
      <div className="mt-4 max-w-xl">
        <VehiclePicker alwaysForm submitLabel="Afficher" onIdentified={identified} />
      </div>
    </div>
  )
}
