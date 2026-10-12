import type { Metadata } from 'next'
import { ProPage } from '@/views/ProPage'

export const metadata: Metadata = {
  title: 'Compte PRO - Distributeur pièces détachées',
  description:
    "Ouvrez un compte professionnel chez Espace Auto 92 : tarifs pros, stock réel disponible immédiatement et livraison express pour les garagistes à Nanterre.",
  alternates: { canonical: '/pro' },
}

export default function Page() {
  return <ProPage />
}
