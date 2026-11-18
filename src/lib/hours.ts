// Store opening hours (Nanterre) — same as the footer and the JSON-LD.
// [open, close] in minutes since midnight, per weekday (0 = Sunday).
const H = (h: number, m = 0) => h * 60 + m

export const OPENING_HOURS: Record<number, [number, number][]> = {
  0: [],
  1: [[H(9), H(18, 30)]],
  2: [[H(9), H(18, 30)]],
  3: [[H(9), H(18, 30)]],
  4: [[H(9), H(18, 30)]],
  5: [
    [H(9), H(12, 30)],
    [H(15), H(18, 30)],
  ],
  6: [[H(9), H(18, 30)]],
}

export const HOURS_LABELS = [
  { days: 'Lun. – Jeu. & Sam.', hours: '9 h – 18 h 30' },
  { days: 'Vendredi', hours: '9 h – 12 h 30 · 15 h – 18 h 30' },
  { days: 'Dimanche', hours: 'Fermé' },
]

const fmt = (min: number) => {
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`
}

/** Open/closed status in Paris time — call on the client only (uses "now"). */
export function storeStatus(now: Date = new Date()): { open: boolean; label: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  const minutes = Number(get('hour')) * 60 + Number(get('minute'))

  const today = OPENING_HOURS[day] ?? []
  const current = today.find(([o, c]) => minutes >= o && minutes < c)
  if (current) return { open: true, label: `Ouvert jusqu’à ${fmt(current[1])}` }

  const laterToday = today.find(([o]) => minutes < o)
  if (laterToday) return { open: false, label: `Fermé · ouvre à ${fmt(laterToday[0])}` }

  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7
    const slots = OPENING_HOURS[d]
    if (slots.length) {
      const name = i === 1 ? 'demain' : ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][d]
      return { open: false, label: `Fermé · ouvre ${name} à ${fmt(slots[0][0])}` }
    }
  }
  return { open: false, label: 'Fermé' }
}
