// ---------------------------------------------------------------------------
//  Abandoned-cart WhatsApp reminder — client-safe helpers.
//
//  Only with the customer's explicit, separate consent (unticked box in the
//  cart): a reminder about a cart is commercial prospecting, which French law
//  (CPCE L34-5) only allows with prior consent. Max 2 messages, quiet hours,
//  no Sunday, data deleted after CART_RECOVERY.retentionDays or on STOP.
//
//  The recovery link carries the cart itself (slug + reference + qty, no
//  prices): the server re-prices it from the catalogue when it is opened.
// ---------------------------------------------------------------------------

import { CART_RECOVERY } from '../shop/config'

export interface CartItemRef {
  slug: string
  reference: string
  qty: number
}

const MAX_LINES = 30
const HOUR = 3_600_000

/* ---------- recovery link token (base64url JSON, UTF-8 safe) ---------- */

const toBase64Url = (text: string) => {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const fromBase64Url = (token: string) => {
  const b64 = token.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
}

export const encodeCartToken = (items: CartItemRef[]) =>
  toBase64Url(JSON.stringify(items.slice(0, MAX_LINES).map((i) => [i.slug, i.reference, i.qty])))

export function decodeCartToken(token: string): CartItemRef[] | null {
  try {
    const raw: unknown = JSON.parse(fromBase64Url(token))
    if (!Array.isArray(raw)) return null
    const items = raw
      .slice(0, MAX_LINES)
      .filter(
        (r): r is [string, string, number] =>
          Array.isArray(r) && typeof r[0] === 'string' && typeof r[1] === 'string' && Number.isInteger(r[2]),
      )
      .map(([slug, reference, qty]) => ({ slug, reference, qty: Math.min(99, Math.max(1, qty)) }))
    return items.length ? items : null
  } catch {
    return null
  }
}

/* ---------- phone ---------- */

/** E.164 (+33…) from what the customer typed, or null if it can't be a mobile number. */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, '')
  if (/^0[67]\d{8}$/.test(digits)) return `+33${digits.slice(1)}` // French mobile, national format
  if (/^(\+|00)33[67]\d{8}$/.test(digits)) return `+33${digits.slice(-9)}`
  if (/^(\+|00)[1-9]\d{7,14}$/.test(digits)) return `+${digits.replace(/^(\+|00)/, '')}` // other countries
  return null
}

/* ---------- send times (Europe/Paris, whatever the server time zone) ---------- */

const parisClock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', hour: '2-digit', hourCycle: 'h23', weekday: 'short' })

function isQuiet(d: Date) {
  const parts = parisClock.formatToParts(d)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value)
  const weekday = parts.find((p) => p.type === 'weekday')?.value
  return weekday === 'Sun' || hour >= CART_RECOVERY.quietFromHour || hour < CART_RECOVERY.quietUntilHour
}

/** First moment at or after `d` outside quiet hours (15-minute steps, DST-safe). */
export function nextSendableTime(d: Date): Date {
  let t = new Date(d)
  for (let i = 0; i < 4 * 24 * 3 && isQuiet(t); i++) t = new Date(t.getTime() + 15 * 60_000)
  return t
}

/** When the reminders go out, counted from the last cart update. */
export function planCartReminders(updatedAt: Date): Date[] {
  const plan: Date[] = []
  for (const h of CART_RECOVERY.delaysHours) {
    const earliest = new Date(updatedAt.getTime() + h * HOUR)
    // Keep at least 12 h between two messages (quiet hours can bunch them).
    const prev = plan[plan.length - 1]
    const candidate = prev && earliest.getTime() < prev.getTime() + 12 * HOUR ? new Date(prev.getTime() + 12 * HOUR) : earliest
    plan.push(nextSendableTime(candidate))
  }
  return plan
}

export const cartReminderPreview = (firstName: string, link: string) =>
  `Bonjour ${firstName || ''}, votre panier Espace Auto 92 vous attend : on a gardé vos pièces de côté. ` +
  `Reprenez votre commande ici : ${link} — Répondez STOP pour ne plus recevoir ces messages.`
