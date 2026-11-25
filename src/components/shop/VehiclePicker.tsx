'use client'

import { useEffect, useRef, useState } from 'react'
import { useShop } from '@/providers/ShopProvider'
import { formatPlate, isValidFrenchPlate, vehicleLabel } from '@/lib/integrations/vehicle'
import type { Vehicle } from '@/lib/shop/types'
import { Icon } from '@/components/ui/Icon'

/** A small French number plate (blue band + number). */
export function PlateChip({ plate, className = '' }: { plate: string; className?: string }) {
  return (
    <span className={`inline-flex h-8 shrink-0 items-stretch overflow-hidden rounded-md bg-white ring-1 ring-gray-900 ${className}`}>
      <span className="flex w-4 items-end justify-center bg-[#003399] pb-0.5 text-[8px] font-bold leading-none text-white" aria-hidden="true">
        F
      </span>
      <span className="flex items-center px-2 font-display text-base font-bold tracking-[0.08em] text-gray-900">{plate}</span>
    </span>
  )
}

// Plate → vehicle identification (YQ). Stores the vehicle in the shop context
// so every product card can show "compatible / non compatible".
export function VehiclePicker({
  tone = 'light',
  onIdentified,
  compact = false,
  autoFocus = false,
  size = 'md',
  submitLabel = 'Identifier',
}: {
  tone?: 'light' | 'dark'
  onIdentified?: (v: Vehicle) => void
  /** Narrow containers (header panel, mobile drawer): stacked actions. */
  compact?: boolean
  /** Put the cursor in the plate field when the form shows. */
  autoFocus?: boolean
  /** 'lg' = the big plate search bar (home). */
  size?: 'md' | 'lg'
  submitLabel?: string
}) {
  const { vehicle, setVehicle } = useShop()
  const [plate, setPlate] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const valid = isValidFrenchPlate(plate)
  const showForm = !vehicle || editing

  useEffect(() => {
    if (showForm && (autoFocus || editing)) inputRef.current?.focus()
  }, [showForm, autoFocus, editing])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) {
      setStatus('error')
      setError(plate ? 'Plaque incomplète : le format est AA-123-BB.' : 'Saisissez votre plaque, au format AA-123-BB.')
      inputRef.current?.focus()
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/vehicle/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate }),
      })
      const json = (await res.json()) as { vehicle?: Vehicle; error?: string }
      if (!res.ok || !json.vehicle) throw new Error(json.error || 'Véhicule introuvable')
      setVehicle(json.vehicle)
      setEditing(false)
      setStatus('idle')
      setPlate('')
      onIdentified?.(json.vehicle)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Erreur, réessayez')
    }
  }

  const dark = tone === 'dark'
  const lg = size === 'lg'

  // Identified: the plate, the vehicle, and what you can do with it.
  if (!showForm && vehicle) {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        {vehicle.plate && <PlateChip plate={vehicle.plate} />}
        <div className="min-w-0 flex-1 basis-40 leading-tight">
          <p className={`flex ${compact || lg ? 'items-start' : 'items-center'} gap-1.5 font-display text-lg font-bold leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            <span className={compact || lg ? '' : 'truncate'}>{vehicleLabel(vehicle)}</span>
            <Icon name="check-circle" weight="fill" className={`mt-0.5 h-5 w-5 shrink-0 ${dark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </p>
          <p className={`text-sm ${dark ? 'text-white/70' : 'text-gray-500'}`}>
            {vehicle.fuel} · {vehicle.yearsLabel ?? vehicle.year}
            {vehicle.source === 'demo' && ' · véhicule de démonstration'}
          </p>
        </div>
        <div className={`flex items-center gap-4 text-sm font-semibold ${compact ? 'w-full' : ''}`}>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={`underline underline-offset-4 ${dark ? 'text-white hover:text-signal-400' : 'text-gray-900 hover:text-secondary-600'}`}
          >
            Changer de véhicule
          </button>
          <button
            type="button"
            onClick={() => {
              setVehicle(null)
              setEditing(false)
            }}
            className={dark ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-secondary-600'}
          >
            Retirer
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="w-full" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div
          className={`relative flex ${lg ? 'h-14' : 'h-12'} shrink-0 items-stretch overflow-hidden rounded-lg bg-white ring-1 transition-shadow focus-within:ring-2 sm:flex-1 ${
            status === 'error' ? 'ring-2 ring-secondary-600' : valid ? 'ring-2 ring-emerald-600' : dark ? 'ring-white/20 focus-within:ring-signal-400' : 'ring-gray-300 focus-within:ring-gray-900'
          }`}
        >
          <span className={`flex ${lg ? 'w-10 pb-2 text-sm' : 'w-8 pb-1.5 text-xs'} shrink-0 select-none items-end justify-center bg-[#003399] font-bold leading-none text-white`} aria-hidden="true">
            F
          </span>
          <input
            ref={inputRef}
            value={plate}
            onChange={(e) => {
              setPlate(formatPlate(e.target.value))
              setStatus('idle')
            }}
            placeholder="AA-123-BB"
            aria-label="Plaque d’immatriculation"
            aria-invalid={status === 'error'}
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            maxLength={9}
            className={`min-w-0 flex-1 bg-transparent px-3 text-center font-display ${lg ? 'text-2xl sm:text-[1.75rem]' : 'text-xl'} font-bold tracking-[0.12em] text-gray-900 outline-none placeholder:font-semibold placeholder:text-gray-300`}
          />
          {valid && status !== 'loading' && (
            <Icon name="check-circle" weight="fill" className={`absolute right-3 top-1/2 ${lg ? 'h-6 w-6' : 'h-5 w-5'} -translate-y-1/2 text-emerald-600`} />
          )}
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`flex ${lg ? 'h-14 px-6 text-base' : 'h-12 px-5 text-sm'} shrink-0 items-center justify-center gap-2 rounded-lg bg-secondary-600 font-display font-bold text-white transition-colors hover:bg-secondary-700 disabled:opacity-70`}
        >
          {status === 'loading' ? (
            <>
              <Icon name="refresh" className="h-4 w-4 animate-spin" /> Recherche…
            </>
          ) : (
            <>
              {lg && <Icon name="search" strokeWidth={2.4} className="h-5 w-5" />}
              {submitLabel}
            </>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p role="alert" className={`mt-2 flex items-start gap-1.5 text-sm font-medium ${dark ? 'text-signal-400' : 'text-secondary-700'}`}>
          <Icon name="warning" weight="fill" className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
      {editing && vehicle && (
        <button
          type="button"
          onClick={() => {
            setEditing(false)
            setStatus('idle')
            setPlate('')
          }}
          className={`mt-2 text-sm font-semibold underline underline-offset-4 ${dark ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Annuler et garder {vehicle.make} {vehicle.model}
        </button>
      )}
    </form>
  )
}
