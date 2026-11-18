// ---------------------------------------------------------------------------
//  Digital service log ("carnet d'entretien") — reminders computed from the
//  purchase date of each wear part. Intervals are indicative: the
//  manufacturer's schedule (and mileage) always wins.
// ---------------------------------------------------------------------------

import type { WearPartKind } from '../shop/types'

export interface WearInterval {
  label: string
  months: number
  km?: number
  tip: string
}

export const WEAR_INTERVALS: Record<WearPartKind, WearInterval> = {
  plaquettes: { label: 'Plaquettes de frein', months: 24, km: 30000, tip: 'Contrôle de l’épaisseur à chaque vidange.' },
  disques: { label: 'Disques de frein', months: 48, km: 60000, tip: 'Un disque sur deux changements de plaquettes en moyenne.' },
  vidange: { label: 'Vidange + filtre à huile', months: 12, km: 15000, tip: 'Au premier des deux termes atteint.' },
  'filtre-air': { label: 'Filtre à air', months: 24, km: 30000, tip: 'Plus souvent en ville ou sur routes poussiéreuses.' },
  'filtre-habitacle': { label: 'Filtre d’habitacle', months: 12, km: 15000, tip: 'Idéalement avant l’été et la climatisation.' },
  balais: { label: 'Balais d’essuie-glace', months: 12, tip: 'Avant l’hiver : traces ou bruit = à changer.' },
  batterie: { label: 'Batterie', months: 48, tip: 'Test gratuit en magasin avant l’hiver.' },
  distribution: { label: 'Kit de distribution', months: 60, km: 120000, tip: 'Pièce critique : suivez l’échéance constructeur.' },
  ampoule: { label: 'Ampoules de phare', months: 24, tip: 'Changez-les par paire.' },
  amortisseurs: { label: 'Amortisseurs', months: 60, km: 80000, tip: 'Contrôle à chaque passage au contrôle technique.' },
}

const addMonths = (d: Date, months: number) => {
  const r = new Date(d)
  r.setMonth(r.getMonth() + months)
  return r
}

export const nextDueDate = (kind: WearPartKind, doneAt: Date) =>
  addMonths(doneAt, WEAR_INTERVALS[kind].months)

/** WhatsApp reminder is sent this many days before the due date. */
export const REMINDER_LEAD_DAYS = 21

export const reminderDate = (due: Date) => new Date(due.getTime() - REMINDER_LEAD_DAYS * 86_400_000)

export type DueStatus = 'ok' | 'bientot' | 'a-faire'

export function dueStatus(due: Date, today: Date = new Date()): DueStatus {
  const days = (due.getTime() - today.getTime()) / 86_400_000
  if (days < 0) return 'a-faire'
  if (days <= 45) return 'bientot'
  return 'ok'
}

export const formatDateFR = (d: Date) =>
  d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

/** Shop product to re-order for each wear part (demo catalogue slugs). */
export const WEAR_PRODUCT_SLUG: Record<WearPartKind, string> = {
  plaquettes: 'plaquettes-frein-avant',
  disques: 'disques-frein-avant',
  vidange: 'huile-moteur-5w30-5l',
  'filtre-air': 'filtre-a-air',
  'filtre-habitacle': 'filtre-habitacle-charbon',
  balais: 'balais-essuie-glace-avant',
  batterie: 'batterie-70ah-efb',
  distribution: 'kit-distribution-pompe-a-eau',
  ampoule: 'ampoules-h7',
  amortisseurs: 'amortisseurs-avant',
}
