import type { Metadata } from 'next'
import { HomePage } from '@/views/HomePage'

export const metadata: Metadata = {
  title: 'Espace Auto 92 - Car parts store in Nanterre (92)',
  description:
    'Espace Auto 92 — auto parts distributor for individuals and professionals in Nanterre (92) since 2017. Large stock, competitive prices, vehicle registration and licence plates.',
  alternates: {
    canonical: '/en',
    languages: {
      'fr-FR': '/',
      'en-US': '/en',
    },
  },
}

export default function Page() {
  return <HomePage />
}
