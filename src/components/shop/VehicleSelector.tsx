'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useShop } from '@/providers/ShopProvider'
import type { CatalogBrand, CatalogEngine, CatalogModel } from '@/lib/integrations/autoprecision/catalog.server'
import type { Vehicle } from '@/lib/shop/types'
import { Icon } from '@/components/ui/Icon'

// Makes most often seen at the counter, offered first in the list.
const COMMON = ['PEUGEOT', 'RENAULT', 'CITROËN', 'DACIA', 'VOLKSWAGEN', 'TOYOTA', 'FORD', 'OPEL', 'FIAT', 'BMW', 'MERCEDES-BENZ', 'AUDI', 'NISSAN', 'SEAT', 'SKODA', 'HYUNDAI', 'KIA']

const year = (yyyymm?: number) => (yyyymm ? Math.floor(yyyymm / 100) : null)
const period = (from?: number, to?: number) => {
  const a = year(from)
  const b = year(to)
  if (!a) return ''
  return b ? `${a} – ${b}` : `depuis ${a}`
}

const engineLabel = (e: CatalogEngine) => [e.name, e.powerHp ? `${e.powerHp} ch` : '', period(e.from, e.to)].filter(Boolean).join(' · ')

// Make → model → engine, from the real TecDoc catalogue. The chosen vehicle is
// stored in the shop context with its TecDoc type, then the customer lands on
// the parts that fit it. For visitors who do not have their plate at hand.
export function VehicleSelector({
  brands,
  tone = 'dark',
  query = '',
}: {
  brands: CatalogBrand[]
  /** Background the form sits on. */
  tone?: 'dark' | 'light'
  /** A part name the customer already typed: carried to the vehicle's parts, which look it up. */
  query?: string
}) {
  const router = useRouter()
  const { setVehicle } = useShop()
  const [brandId, setBrandId] = useState('')
  const [models, setModels] = useState<CatalogModel[]>([])
  const [modelId, setModelId] = useState('')
  const [carId, setCarId] = useState('')
  const [status, setStatus] = useState<'idle' | 'models' | 'vehicle' | 'error'>('idle')
  const [error, setError] = useState('')

  const common = useMemo(() => COMMON.map((name) => brands.find((b) => b.name === name)).filter((b): b is CatalogBrand => Boolean(b)), [brands])
  const model = models.find((m) => String(m.modelId) === modelId)
  const enginesByFuel = useMemo(() => {
    const groups = new Map<string, CatalogEngine[]>()
    for (const e of model?.engines ?? []) groups.set(e.fuel, [...(groups.get(e.fuel) ?? []), e])
    return [...groups.entries()]
  }, [model])

  const fail = (message: string) => {
    setStatus('error')
    setError(message)
  }

  const chooseBrand = async (value: string) => {
    setBrandId(value)
    setModels([])
    setModelId('')
    setCarId('')
    if (!value) return setStatus('idle')
    setStatus('models')
    try {
      const res = await fetch(`/api/catalog/vehicles?brand=${value}`)
      const json = (await res.json()) as { models?: CatalogModel[]; error?: string }
      if (!res.ok || !json.models) throw new Error(json.error || 'Modèles introuvables')
      setModels(json.models)
      setStatus('idle')
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Erreur, réessayez')
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!carId) return fail('Choisissez la marque, le modèle puis la motorisation.')
    setStatus('vehicle')
    try {
      const res = await fetch(`/api/catalog/vehicles?car=${carId}`)
      const json = (await res.json()) as { vehicle?: Vehicle; error?: string }
      if (!res.ok || !json.vehicle) throw new Error(json.error || 'Véhicule introuvable')
      setVehicle(json.vehicle)
      router.push(`/pieces/${carId}${query ? `?q=${encodeURIComponent(query)}` : ''}`)
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Erreur, réessayez')
    }
  }

  const dark = tone === 'dark'
  const field = `h-12 w-full rounded-lg bg-white px-3 text-base font-semibold text-gray-900 ring-1 outline-none focus:ring-2 disabled:text-gray-500 ${
    dark ? 'ring-white/20 focus:ring-signal-400 disabled:bg-white/60' : 'ring-gray-300 focus:ring-gray-900 disabled:bg-gray-100'
  }`
  const label = `mb-1.5 block text-sm font-semibold ${dark ? 'text-white/80' : 'text-gray-700'}`

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="vs-brand" className={label}>
            1. Marque
          </label>
          <select id="vs-brand" value={brandId} onChange={(e) => chooseBrand(e.target.value)} className={field}>
            <option value="">Choisir la marque</option>
            <optgroup label="Marques courantes">
              {common.map((b) => (
                <option key={`c${b.id}`} value={b.id}>
                  {b.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Toutes les marques">
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label htmlFor="vs-model" className={label}>
            2. Modèle
          </label>
          <select
            id="vs-model"
            value={modelId}
            onChange={(e) => {
              setModelId(e.target.value)
              setCarId('')
              setStatus('idle')
            }}
            disabled={!models.length}
            className={field}
          >
            <option value="">{status === 'models' ? 'Chargement…' : 'Choisir le modèle'}</option>
            {models.map((m) => (
              <option key={m.modelId} value={m.modelId}>
                {[m.name, period(m.from, m.to)].filter(Boolean).join(' · ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="vs-engine" className={label}>
            3. Motorisation
          </label>
          <select
            id="vs-engine"
            value={carId}
            onChange={(e) => {
              setCarId(e.target.value)
              setStatus('idle')
            }}
            disabled={!model}
            className={field}
          >
            <option value="">Choisir la motorisation</option>
            {enginesByFuel.map(([fuel, engines]) => (
              <optgroup key={fuel} label={fuel}>
                {engines.map((e) => (
                  <option key={e.carId} value={e.carId}>
                    {engineLabel(e)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === 'vehicle'}
          className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-secondary-600 px-6 font-display text-sm font-bold text-white transition-colors hover:bg-secondary-700 disabled:opacity-70"
        >
          {status === 'vehicle' ? (
            <>
              <Icon name="refresh" className="h-4 w-4 animate-spin" /> Recherche…
            </>
          ) : (
            <>
              <Icon name="search" strokeWidth={2.4} className="h-5 w-5" /> Voir les pièces compatibles
            </>
          )}
        </button>
        {status === 'error' && (
          <p role="alert" className={`flex items-start gap-1.5 text-sm font-medium ${dark ? 'text-signal-400' : 'text-secondary-700'}`}>
            <Icon name="warning" weight="fill" className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        )}
      </div>
    </form>
  )
}
