import { NextResponse } from 'next/server'
import { SITE } from '@/lib/site'
import { cartReminderPreview, encodeCartToken, normalizePhone, planCartReminders } from '@/lib/loyalty/cartRecovery'
import { parseCartItems, priceCartItems } from '@/lib/shop/cart.server'
import { cancelCartReminder, saveCartReminder } from '@/lib/integrations/cartReminders.server'

// Abandoned-cart WhatsApp reminder.
// POST   { phone, firstName, items: [{ slug, reference, qty }], consent: true, consentText }
//        → { sendAt: string[], preview }   (replaces any previous reminder for this phone)
// DELETE { phone } → cancels (purchase done, consent withdrawn, cart emptied)

async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = (await req.json()) as unknown
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : null
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  const body = await readJson(req)
  if (!body) return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })

  // Consent is mandatory and must be explicit (unticked box ticked by the customer).
  if (body.consent !== true || typeof body.consentText !== 'string' || !body.consentText.trim()) {
    return NextResponse.json({ error: 'Consentement requis' }, { status: 400 })
  }
  const phone = typeof body.phone === 'string' ? normalizePhone(body.phone) : null
  if (!phone) return NextResponse.json({ error: 'Numéro de mobile invalide' }, { status: 400 })

  const lines = priceCartItems(parseCartItems(body.items))
  if (!lines.length) return NextResponse.json({ error: 'Panier vide' }, { status: 400 })

  const firstName = typeof body.firstName === 'string' ? body.firstName.trim().split(/\s+/)[0].slice(0, 40) : ''
  const items = lines.map((l) => ({ slug: l.slug, reference: l.reference, qty: l.qty }))
  const sendAt = planCartReminders(new Date())

  await saveCartReminder({
    phone,
    firstName,
    items,
    sendAt,
    consentText: body.consentText.trim().slice(0, 500),
    consentAt: new Date(),
  })

  const link = `${SITE.url}/panier?reprise=${encodeCartToken(items)}`
  return NextResponse.json({ sendAt: sendAt.map((d) => d.toISOString()), preview: cartReminderPreview(firstName, link) })
}

export async function DELETE(req: Request) {
  const body = await readJson(req)
  const phone = body && typeof body.phone === 'string' ? normalizePhone(body.phone) : null
  if (!phone) return NextResponse.json({ error: 'Numéro de mobile invalide' }, { status: 400 })
  await cancelCartReminder(phone)
  return NextResponse.json({ ok: true })
}
