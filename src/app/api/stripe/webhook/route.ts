import { NextResponse } from 'next/server'
import { StripeError, verifyWebhook } from '@/lib/integrations/stripe.server'
import { notifyShopOfPaidOrder } from '@/lib/shop/orderNotice.server'

// Stripe calls this address when something happens to a payment. It is the
// reliable signal that an order is paid: the customer may close the browser
// before coming back to the site.
//
// Set it up in the Stripe dashboard (Developers → Webhooks → Add endpoint):
//   URL     https://<the site>/api/stripe/webhook
//   Events  checkout.session.completed
//           checkout.session.async_payment_succeeded
//           checkout.session.async_payment_failed
// and put the endpoint's signing secret in STRIPE_WEBHOOK_SECRET.
export async function POST(req: Request) {
  // The signature covers the body byte for byte: read it as text, never as parsed JSON.
  const raw = await req.text()

  let event
  try {
    event = verifyWebhook(raw, req.headers.get('stripe-signature'))
  } catch (err) {
    const status = err instanceof StripeError && err.status ? err.status : 400
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Signature invalide' }, { status })
  }

  const session = event.data.object
  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
      // "completed" also fires for payment methods that settle later (payment_status "unpaid"):
      // those are announced by async_payment_succeeded once the money is there.
      if (session.payment_status === 'unpaid') break
      try {
        await notifyShopOfPaidOrder(session)
      } catch (err) {
        // Not acknowledged: Stripe sends the event again later, so the order is not lost.
        console.error('[stripe/webhook] could not notify the shop', err)
        return NextResponse.json({ error: 'Notification non envoyée' }, { status: 500 })
      }
      break
    case 'checkout.session.async_payment_failed':
      console.warn(`[order] payment failed: ${session.client_reference_id ?? session.id}`)
      break
    default:
      // Other events are not ours to handle; acknowledging them stops the retries.
      break
  }
  return NextResponse.json({ received: true })
}
