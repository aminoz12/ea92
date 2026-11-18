// ---------------------------------------------------------------------------
//  PRO credit — "encours et blocage".
//  Full functional spec: docs/specs/encours-et-blocage.md
//
//  Pure functions (no I/O). In production the SAME function must run on the
//  server inside the order transaction — the UI check is only a preview.
// ---------------------------------------------------------------------------

import { PRO } from '../shop/config'
import { round2 } from '../shop/ranking'

export type ProAccountStatus =
  | 'actif' // ordering on credit allowed
  | 'alerte' // ≥ 80 % of the limit used — still allowed, garage warned
  | 'bloque_plafond' // this order would exceed the limit
  | 'bloque_impaye' // a direct debit was rejected — credit frozen
  | 'suspendu' // manual suspension by the shop

export interface ProAccountSnapshot {
  creditLimitTTC: number
  openInvoicesTTC: number // invoiced, not yet paid (incl. debits sent but not confirmed)
  uninvoicedOrdersTTC: number // validated orders not invoiced yet
  creditNotesTTC: number // credit notes (avoirs) not yet offset
  hasRejectedDebit: boolean
  manualSuspension: boolean
}

export interface CreditDecision {
  status: ProAccountStatus
  outstandingTTC: number
  availableTTC: number
  usage: number // 0..1+ share of the limit used (after this order)
  canOrderOnCredit: boolean
  message: string
}

export const outstandingTTC = (a: ProAccountSnapshot) =>
  round2(Math.max(0, a.openInvoicesTTC + a.uninvoicedOrdersTTC - a.creditNotesTTC))

export function evaluateCredit(a: ProAccountSnapshot, orderTTC = 0): CreditDecision {
  const current = outstandingTTC(a)
  const after = round2(current + orderTTC)
  const availableTTC = round2(Math.max(0, a.creditLimitTTC - current))
  const usage = a.creditLimitTTC > 0 ? after / a.creditLimitTTC : 1
  const base = { outstandingTTC: current, availableTTC, usage }

  if (a.manualSuspension) {
    return { ...base, status: 'suspendu', canOrderOnCredit: false, message: 'Compte suspendu — contactez le magasin.' }
  }
  if (a.hasRejectedDebit) {
    return {
      ...base,
      status: 'bloque_impaye',
      canOrderOnCredit: false,
      message: 'Prélèvement rejeté : commandes à crédit bloquées jusqu’à régularisation. Paiement CB possible.',
    }
  }
  if (after > a.creditLimitTTC + 1e-9) {
    return {
      ...base,
      status: 'bloque_plafond',
      canOrderOnCredit: false,
      message: `Cette commande dépasse votre encours disponible (${availableTTC.toFixed(2).replace('.', ',')} €). Réglez par CB ou attendez le prochain prélèvement.`,
    }
  }
  if (usage >= PRO.alertThreshold) {
    return { ...base, status: 'alerte', canOrderOnCredit: true, message: `Vous avez utilisé ${Math.round(usage * 100)} % de votre encours.` }
  }
  return { ...base, status: 'actif', canOrderOnCredit: true, message: 'Encours disponible.' }
}

/** Next weekly direct-debit date (strictly after `from`). */
export function nextDebitDate(from: Date, weekday: number = PRO.debitWeekday): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const delta = (weekday - d.getDay() + 7) % 7 || 7
  d.setDate(d.getDate() + delta)
  return d
}
