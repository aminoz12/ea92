import type { Metadata } from 'next'
import { ContactPage } from '@/views/ContactPage'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactez Espace Auto 92 à Nanterre : téléphone, adresse, horaires et formulaire de contact. 426 Avenue de la République, 92000 Nanterre.',
  alternates: { canonical: '/contact' },
}

export default function Page() {
  return <ContactPage />
}
