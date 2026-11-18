// ---------------------------------------------------------------------------
//  WhatsApp follow-ups after a purchase.
//
//   J0        confirmation (+ invoice)
//   J0        tracking link when shipped (courier / parcel)
//   J+2 → J+4 Google review request (J+3 by default, never on Sunday)
//   due − 21d wear-part reminder for each wear part bought
//   CT − 45d / − 7d contrôle technique reminder (planCtReminders, from the
//                 service log: first registration or last CT date)
//
//  Business-initiated WhatsApp messages need (1) the customer's opt-in and
//  (2) Meta-approved message templates (WhatsApp Business Platform / Cloud
//  API). Template names below must match the ones approved in Meta.
//  Sending = a daily cron (e.g. Vercel Cron) that picks the due messages.
// ---------------------------------------------------------------------------

import type { FulfilmentMode, WearPartKind } from '../shop/types'
import { WEAR_INTERVALS, nextDueDate, reminderDate } from './serviceLog'
import { CT_RULES } from './controleTechnique'

export type FollowUpKind = 'confirmation' | 'suivi' | 'avis' | 'rappel-usure' | 'rappel-ct'

export interface FollowUp {
  kind: FollowUpKind
  template: string
  sendAt: Date
  preview: string
}

export interface FollowUpOrder {
  orderId: string
  firstName: string
  purchasedAt: Date
  mode: FulfilmentMode
  lines: { name: string; wearPart?: WearPartKind }[]
}

const REVIEW_DELAY_DAYS = 3 // within the D+2–4 window
const SEND_HOUR = 10 // 10:30 local time: not too early, not during dinner

const atSendTime = (d: Date) => {
  const r = new Date(d)
  r.setHours(SEND_HOUR, 30, 0, 0)
  if (r.getDay() === 0) r.setDate(r.getDate() + 1) // no messages on Sunday
  return r
}

export function planFollowUps(o: FollowUpOrder): FollowUp[] {
  const plan: FollowUp[] = [
    {
      kind: 'confirmation',
      template: 'ea92_confirmation_commande',
      sendAt: o.purchasedAt,
      preview: `Bonjour ${o.firstName}, merci pour votre commande ${o.orderId} chez Espace Auto 92 ! Votre facture est jointe. On vous prévient dès qu’elle est prête.`,
    },
  ]

  if (o.mode === 'coursier' || o.mode === 'colis') {
    plan.push({
      kind: 'suivi',
      template: 'ea92_suivi_livraison',
      sendAt: o.purchasedAt,
      preview: `Votre commande ${o.orderId} est en route 🚚 Suivez-la en temps réel : {{lien_suivi}}`,
    })
  }

  plan.push({
    kind: 'avis',
    template: 'ea92_demande_avis',
    sendAt: atSendTime(new Date(o.purchasedAt.getTime() + REVIEW_DELAY_DAYS * 86_400_000)),
    preview: `${o.firstName}, tout s’est bien passé avec votre pièce ? Un avis Google nous aide énormément 🙏 {{lien_avis}}`,
  })

  const seen = new Set<WearPartKind>()
  for (const line of o.lines) {
    if (!line.wearPart || seen.has(line.wearPart)) continue
    seen.add(line.wearPart)
    const due = nextDueDate(line.wearPart, o.purchasedAt)
    plan.push({
      kind: 'rappel-usure',
      template: 'ea92_rappel_usure',
      sendAt: atSendTime(reminderDate(due)),
      preview: `Bonjour ${o.firstName}, vos ${WEAR_INTERVALS[line.wearPart].label.toLowerCase()} arrivent bientôt en fin de vie (achat le ${o.purchasedAt.toLocaleDateString('fr-FR')}). On vous les réserve ? Répondez OUI.`,
    })
  }

  return plan.sort((a, b) => a.sendAt.getTime() - b.sendAt.getTime())
}

/** Contrôle technique reminders (needs the WhatsApp opt-in, like the others). */
export function planCtReminders(o: { firstName: string; plate: string; due: Date }, now: Date = new Date()): FollowUp[] {
  const dueLabel = o.due.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  return CT_RULES.reminderLeadDays
    .map((lead) => atSendTime(new Date(o.due.getTime() - lead * 86_400_000)))
    .filter((sendAt) => sendAt.getTime() > now.getTime())
    .map((sendAt) => ({
      kind: 'rappel-ct' as const,
      template: 'ea92_rappel_controle_technique',
      sendAt,
      preview: `Bonjour ${o.firstName}, le contrôle technique de votre véhicule ${o.plate} est à faire avant le ${dueLabel}. Ampoules, essuie-glaces, plaquettes : on vérifie avec vous ce qui fait échouer le plus souvent ? {{lien_checklist}}`,
    }))
}
