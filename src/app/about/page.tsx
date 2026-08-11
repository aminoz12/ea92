import type { Metadata } from 'next'
import { AboutPage } from '@/views/AboutPage'

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'Découvrez Espace Auto 92, votre distributeur de pièces détachées automobiles à Nanterre (92) depuis 2017.',
  alternates: { canonical: '/about' },
}

export default function Page() {
  return <AboutPage />
}
