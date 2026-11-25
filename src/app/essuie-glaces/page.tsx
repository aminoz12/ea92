import type { Metadata } from 'next'
import { CallProductLanding, type LandingContent } from '@/views/shop/CallProductLanding'
import { GENART } from '@/lib/shop/partTypes'

export const metadata: Metadata = {
  title: 'Balais d’essuie-glace — promo hiver à Nanterre',
  description:
    'Balais d’essuie-glace Bosch, Valeo et plus en stock à Nanterre. Promo hiver : une paire achetée, un dégivrant Holts offert.',
  alternates: { canonical: '/essuie-glaces' },
  // Switch to index when the shop opens to the public.
  robots: { index: false, follow: true },
}

const CONTENT: LandingContent = {
  pill: 'Promo hiver',
  title: 'Des essuie-glaces neufs avant l’hiver',
  intro: 'Une paire de balais achetée = un dégivrant Holts offert (dans la limite des stocks). La bonne longueur pour votre véhicule, prête au comptoir.',
  bullets: [
    'Bosch, Valeo et balais éco : avant et arrière',
    'Retrait en 30 min au magasin, ou coursier en ~1 h',
    'Bonne longueur et bonne fixation vérifiées avec votre plaque',
  ],
  heroImage: '/images/promos/promo-3.jpeg',
  heroImageIsBanner: true,
  catalog: { genart: GENART.wiperBlades, label: 'balais d’essuie-glace' },
  guide: [
    {
      title: 'Quand les changer ?',
      text: 'Traces, bruit, broutements ou zones mal essuyées : il est temps. Comptez au moins un changement par an, idéalement à l’entrée de l’hiver.',
    },
    {
      title: 'Plat ou classique ?',
      text: 'La plupart des voitures récentes ont des balais plats, avec une fixation propre à chaque modèle. Avec votre plaque, on vous donne le bon modèle et le bon adaptateur.',
    },
    {
      title: 'La bonne longueur',
      text: 'Côté conducteur et côté passager ont souvent des longueurs différentes : c’est pour ça qu’on les vend en kit de deux, déjà appairés pour votre véhicule.',
    },
  ],
  helpMessage: 'Bonjour, je cherche des balais d’essuie-glace.',
}

export default function Page() {
  return <CallProductLanding content={CONTENT} />
}
