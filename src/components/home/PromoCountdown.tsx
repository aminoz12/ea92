'use client'

import { useEffect, useState } from 'react'
import { PROMOS } from '@/lib/shop/config'

// Seconds until the end of the current week (Sunday 23:59:59, Paris time).
function secondsToEndOfWeek(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0'
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  const daysLeft = (7 - day) % 7 // Sunday → 0 (ends tonight)
  const elapsed = Number(get('hour')) * 3600 + Number(get('minute')) * 60 + Number(get('second'))
  return daysLeft * 86_400 + (86_399 - elapsed)
}

function secondsLeft(now: Date) {
  if (PROMOS.endsAt) return Math.floor((new Date(PROMOS.endsAt).getTime() - now.getTime()) / 1000)
  return secondsToEndOfWeek(now)
}

const pad = (n: number) => String(n).padStart(2, '0')

// "Fin des offres dans 2 j 05:12:33" — rendered after mount only (clock
// dependent), hidden once the offers have ended.
export function PromoCountdown() {
  const [left, setLeft] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setLeft(secondsLeft(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (left === null || left <= 0) return null
  const d = Math.floor(left / 86_400)
  const h = Math.floor((left % 86_400) / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60

  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-1.5 font-display text-base font-bold text-signal-400" role="timer" aria-live="off">
      <span className="text-xs font-semibold uppercase tracking-wide text-white/70">Fin dans</span>
      <span className="tabular-nums">
        {d > 0 && `${d} j `}
        {pad(h)} : {pad(m)} : {pad(s)}
      </span>
    </span>
  )
}
