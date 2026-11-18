'use client'

import { useEffect, useState } from 'react'
import { OPENING_HOURS, storeStatus } from '@/lib/hours'
import { Icon } from '../ui/Icon'

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const ORDER = [1, 2, 3, 4, 5, 6, 0] // Monday first

const fmt = (min: number) => {
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`
}

const parisWeekday = () =>
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short' }).format(new Date()),
  )

// Weekly hours with today highlighted and a live open/closed badge
// (computed after mount, in Paris time, to avoid hydration mismatches).
export function OpeningHoursCard({ className = '' }: { className?: string }) {
  const [today, setToday] = useState<number | null>(null)
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null)

  useEffect(() => {
    const tick = () => {
      setToday(parisWeekday())
      setStatus(storeStatus())
    }
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={`rounded-xl bg-white p-5 ring-1 ring-gray-200 sm:p-6 ${className}`}>
      <h2 className="font-display text-2xl font-bold text-gray-900">Horaires d’ouverture</h2>
      {/* Live status as a plain line (solid icon + text), like the stock status */}
      {status && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[15px] font-medium text-gray-800">
          <Icon
            name={status.open ? 'check-circle' : 'clock'}
            weight={status.open ? 'fill' : 'regular'}
            className={`h-5 w-5 shrink-0 ${status.open ? 'text-emerald-600' : 'text-gray-500'}`}
          />
          {status.label}
        </p>
      )}
      <dl className="mt-4 divide-y divide-gray-200 border-t border-gray-200 text-[15px]">
        {ORDER.map((d, i) => {
          const slots = OPENING_HOURS[d]
          const isToday = d === today
          return (
            <div key={d} className={`flex justify-between gap-4 py-2.5 ${isToday ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
              <dt className="flex items-center gap-2">
                {isToday && <span className="h-4 w-1 rounded-full bg-secondary-600" aria-hidden="true" />}
                {DAYS[i]}
                {isToday && <span className="font-normal text-gray-500">(aujourd’hui)</span>}
              </dt>
              <dd className="text-right">{slots.length ? slots.map(([o, c]) => `${fmt(o)} – ${fmt(c)}`).join(' · ') : 'Fermé'}</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
