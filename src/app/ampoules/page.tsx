import type { Metadata } from 'next'
import { CallProductLanding, type LandingContent } from '@/views/shop/CallProductLanding'
import { getPublicCatalog } from '@/lib/shop/catalog.server'

export const metadata: Metadata = {
  title: 'Ampoules de phare H1, H4, H7 — en stock à Nanterre',
  description:
    'Ampoules de phare H1, H4, H7 Philips, Osram, Bosch en stock au magasin Espace Auto 92 à Nanterre. Trouvez la bonne référence avec votre plaque.',
  alternates: { canonical: '/ampoules' },
  // Switch to index once real prices are live (demo catalogue for now).
  robots: { index: false, follow: true },
}

const CONTENT: LandingContent = {
  pill: 'Petit prix · en stock',
  title: 'Une ampoule grillée ? Repartez éclairé en 10 minutes',
  intro: 'H1, H4, H7 et toutes les ampoules de feux : la bonne référence pour votre véhicule, au meilleur prix, prête au comptoir.',
  bullets: [
    'Philips, Osram, Bosch : toutes les références courantes en stock',
    'Retrait en 30 min au magasin, ou coursier en ~1 h',
    'On vérifie la référence avec votre plaque avant de vous la donner',
  ],
  heroImage: '/images/products/ampoule.svg',
  guide: [
    {
      title: 'H1, H4, H7 : quel culot ?',
      text: 'Le culot dépend du phare : H7 pour les feux de croisement de nombreuses voitures récentes, H4 (double filament code + phare) sur beaucoup de citadines, H1 pour les feux de route ou antibrouillards. Votre plaque suffit pour trouver le bon.',
    },
    {
      title: 'Toujours par paire',
      text: 'Les deux ampoules ont le même âge : quand l’une lâche, l’autre suit souvent. Les changer ensemble garantit un éclairage homogène et un réglage correct.',
    },
    {
      title: 'Et les ampoules LED ?',
      text: 'En remplacement d’une ampoule halogène, une LED n’est autorisée que si elle est homologuée pour votre véhicule. Demandez-nous : on vous dit ce qui est permis pour votre modèle.',
    },
  ],
  helpMessage: 'Bonjour, je cherche une ampoule de phare.',
}

export default function Page() {
  const products = getPublicCatalog().filter((p) => p.category === 'eclairage')
  return <CallProductLanding content={CONTENT} products={products} />
}
