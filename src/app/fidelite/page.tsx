import type { Metadata } from 'next'
import { FidelityView } from '@/views/FidelityView'

export const metadata: Metadata = {
  title: 'Fidélité — particuliers & professionnels',
  description:
    'Club fidélité Espace Auto 92 : 1 point par euro, carnet d’entretien digital et rappels WhatsApp pour les particuliers ; remise de fin d’année pour les pros.',
  alternates: { canonical: '/fidelite' },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const espace = Array.isArray(sp.espace) ? sp.espace[0] : sp.espace
  const tab = espace === 'pro' ? 'pro' : 'particuliers'
  return <FidelityView key={tab} initialTab={tab} />
}
