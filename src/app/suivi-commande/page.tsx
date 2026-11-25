import type { Metadata } from 'next'
import { TrackingView } from '@/views/shop/TrackingView'
import { getOrderConfirmation } from '@/lib/shop/checkout.server'

export const metadata: Metadata = {
  title: 'Suivi de commande',
  description: 'Suivez votre commande Espace Auto 92 en temps réel : préparation, arrivée au magasin, coursier ou colis.',
  alternates: { canonical: '/suivi-commande' },
  robots: { index: false, follow: true },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ''

  // Back from the Stripe payment page: the session is re-read at Stripe, so
  // "paid" on this page is what Stripe says, not what the address bar says.
  const sessionId = one(sp.session_id).trim()
  if (sessionId) {
    const confirmation = await getOrderConfirmation(sessionId)
    return <TrackingView key={sessionId} orderId={confirmation?.orderRef ?? ''} confirmation={confirmation ?? 'unknown'} />
  }

  const orderId = one(sp.commande).trim().toUpperCase().slice(0, 20)
  return <TrackingView key={orderId} orderId={orderId} />
}
