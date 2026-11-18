import 'server-only'

// ---------------------------------------------------------------------------
//  Abandoned-cart reminders — storage + sending (STUB).
//
//  Production:
//   - store each reminder in the database (one row per phone number, replaced
//     on every cart update) with the consent text and timestamp as proof;
//   - an hourly cron (e.g. Vercel Cron) sends the due messages through the
//     WhatsApp Business Platform (Cloud API) with the Meta-approved MARKETING
//     template `ea92_panier_abandonne`, then marks them sent;
//   - delete the row after the last message, on purchase, on STOP, and in any
//     case after CART_RECOVERY.retentionDays.
//
//  Until then reminders live in memory (lost on restart, one per server
//  instance) so the flow can be tested end to end. Nothing is sent.
// ---------------------------------------------------------------------------

import type { CartItemRef } from '../loyalty/cartRecovery'

export interface CartReminder {
  phone: string // E.164
  firstName: string
  items: CartItemRef[]
  sendAt: Date[]
  consentText: string
  consentAt: Date
}

const store = new Map<string, CartReminder>()

/** Last 2 digits only: phone numbers must not end up in logs. */
const mask = (phone: string) => `${phone.slice(0, 4)}•••••${phone.slice(-2)}`

export async function saveCartReminder(r: CartReminder) {
  store.set(r.phone, r)
  console.info(`[cart-reminder] scheduled for ${mask(r.phone)}: ${r.sendAt.map((d) => d.toISOString()).join(', ')}`)
}

export async function cancelCartReminder(phone: string) {
  if (store.delete(phone)) console.info(`[cart-reminder] cancelled for ${mask(phone)}`)
}
