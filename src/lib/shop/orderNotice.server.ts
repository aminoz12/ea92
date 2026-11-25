import 'server-only'
import nodemailer from 'nodemailer'

// Tells the shop that an order has been paid. Called from the Stripe webhook.
//
// The order itself stays in Stripe (dashboard → Payments): this e-mail is the
// "new order" bell. It is sent with the site's Gmail account when SMTP_PASS is
// set (same settings as the contact form); without it nothing is sent and the
// order only shows in the dashboard.

import { SITE } from '../site'
import type { CheckoutSession } from '../integrations/stripe.server'

const eur = (cents: number | null) => `${((cents ?? 0) / 100).toFixed(2).replace('.', ',')} €`

/** Plain-text summary of a paid session, from what checkout.server.ts stored in it. */
export function orderSummary(session: CheckoutSession) {
  const m = session.metadata ?? {}
  const items = Object.keys(m)
    .filter((k) => /^items_\d+$/.test(k))
    .sort((a, b) => Number(a.slice(6)) - Number(b.slice(6)))
    .flatMap((k) => m[k].split(' ; '))
  return [
    `Commande ${session.client_reference_id ?? m.order_ref ?? '?'} — ${eur(session.amount_total)} TTC${session.livemode ? '' : '  [PAIEMENT DE TEST, aucun encaissement]'}`,
    '',
    `Réception : ${m.reception ?? m.mode ?? '?'}`,
    ...(m.address ? [`Adresse : ${m.address}`] : []),
    `Client : ${m.customer_name ?? '?'} — ${m.customer_phone ?? '?'}${session.customer_details?.email ? ` — ${session.customer_details.email}` : ''}`,
    `WhatsApp accepté : ${m.whatsapp_optin ?? 'non'}`,
    ...(m.vehicle ? [`Véhicule : ${m.vehicle}`] : []),
    '',
    'Pièces à préparer (quantité x code marque TecDoc/référence @ prix unitaire TTC) :',
    ...items.map((i) => `  - ${i}`),
    ...(m.delivery_ttc ? ['', `Livraison facturée : ${m.delivery_ttc.replace('.', ',')} €`] : []),
    '',
    `Paiement Stripe : ${session.payment_intent ?? session.id}`,
  ].join('\n')
}

export const isOrderNoticeConfigured = () => Boolean(process.env.SMTP_PASS)

/** Sends the summary to the shop. Throws when the e-mail could not be sent. */
export async function notifyShopOfPaidOrder(session: CheckoutSession) {
  const ref = session.client_reference_id ?? session.metadata?.order_ref ?? session.id
  // No personal data in the logs: the reference and the amount are enough to find the order in Stripe.
  console.info(`[order] paid: ${ref} ${eur(session.amount_total)}${session.livemode ? '' : ' (test)'}`)
  if (!isOrderNoticeConfigured()) return

  const account = process.env.SMTP_USER || SITE.email
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: account, pass: process.env.SMTP_PASS },
  })
  await transporter.sendMail({
    from: `"Espace Auto 92 — commandes" <${account}>`,
    to: SITE.email,
    subject: `${session.livemode ? '' : '[TEST] '}Nouvelle commande ${ref} — ${eur(session.amount_total)}`,
    text: orderSummary(session),
  })
}
