import type { Metadata } from 'next'
import { ServiceLogView } from '@/views/ServiceLogView'

export const metadata: Metadata = {
  title: 'Carnet d’entretien digital',
  description:
    'Votre carnet d’entretien rempli automatiquement à chaque achat chez Espace Auto 92, avec rappels WhatsApp avant chaque échéance.',
  alternates: { canonical: '/carnet-entretien' },
  robots: { index: false, follow: true }, // demo data
}

export default function Page() {
  return <ServiceLogView />
}
