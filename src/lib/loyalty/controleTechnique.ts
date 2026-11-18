// ---------------------------------------------------------------------------
//  Contrôle technique (France, passenger cars) — next due date + reminders.
//
//   - first CT: before the 4th anniversary of first registration (it can be
//     done in the 6 months before that date)
//   - then every 2 years
//   - after a failed CT: contre-visite within 2 months
//
//  Light commercial vehicles add a yearly pollution check, not handled here.
// ---------------------------------------------------------------------------

export const CT_RULES = {
  firstAfterYears: 4,
  everyYears: 2,
  soonDays: 60, // "bientôt" below this
  reminderLeadDays: [45, 7], // WhatsApp reminders before the due date
} as const

export type CtStatus = 'ok' | 'bientot' | 'a-faire'

export type CtResult =
  | { kind: 'due'; due: Date; basis: 'premier' | 'periodique'; status: CtStatus; reminders: Date[] }
  | { kind: 'missing'; reason: 'no-dates' | 'last-ct-needed' }

const DAY = 86_400_000

/** "YYYY-MM-DD" → local Date at noon (avoids time-zone day shifts), or null. */
export function parseISODate(value?: string | null): Date | null {
  const m = value ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12)
  return Number.isNaN(d.getTime()) || d.getMonth() !== Number(m[2]) - 1 ? null : d
}

const addYears = (d: Date, years: number) => {
  const r = new Date(d)
  r.setFullYear(r.getFullYear() + years)
  return r
}

export function computeCt(input: { firstRegistration?: string; lastCt?: string }, today: Date = new Date()): CtResult {
  const lastCt = parseISODate(input.lastCt)
  const firstReg = parseISODate(input.firstRegistration)

  let due: Date
  let basis: 'premier' | 'periodique'
  if (lastCt && lastCt.getTime() <= today.getTime() + DAY) {
    due = addYears(lastCt, CT_RULES.everyYears)
    basis = 'periodique'
  } else if (firstReg) {
    due = addYears(firstReg, CT_RULES.firstAfterYears)
    basis = 'premier'
    // Older than 4 years and no last CT date: we can't know the next one.
    if (due.getTime() < today.getTime()) return { kind: 'missing', reason: 'last-ct-needed' }
  } else {
    return { kind: 'missing', reason: 'no-dates' }
  }

  const days = (due.getTime() - today.getTime()) / DAY
  const status: CtStatus = days < 0 ? 'a-faire' : days <= CT_RULES.soonDays ? 'bientot' : 'ok'
  const reminders = CT_RULES.reminderLeadDays.map((lead) => new Date(due.getTime() - lead * DAY))
  return { kind: 'due', due, basis, status, reminders }
}

/** What fails most often — each line links to the parts that fix it. */
export const CT_CHECKLIST: { label: string; tip: string; href?: string }[] = [
  { label: 'Feux et ampoules', tip: 'Croisement, stop, clignotants, plaque : testez-les à deux.', href: '/ampoules' },
  { label: 'Essuie-glaces et lave-glace', tip: 'Balais qui laissent des traces, réservoir vide.', href: '/essuie-glaces' },
  { label: 'Freinage', tip: 'Plaquettes, disques, bruit ou voiture qui tire d’un côté.', href: '/boutique?categorie=freinage' },
  { label: 'Pollution', tip: 'Vidange et filtre à air récents aident à passer les mesures.', href: '/boutique?categorie=entretien' },
  { label: 'Pneus', tip: 'Usure au-delà du témoin (1,6 mm), même modèle sur un essieu.' },
  { label: 'Voyants au tableau de bord', tip: 'Moteur, airbag, ABS allumés : faites un diagnostic avant.' },
]
