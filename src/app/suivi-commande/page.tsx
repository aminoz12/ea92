import type { Metadata } from 'next'
import { TrackingView } from '@/views/shop/TrackingView'

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
  const orderId = one(sp.commande).trim().toUpperCase().slice(0, 20)
  const mode = one(sp.mode)
  return <TrackingView key={orderId + mode} orderId={orderId} modeParam={mode} />
}
