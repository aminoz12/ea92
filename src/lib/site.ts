// Central site / business configuration — single source of truth for SEO,
// structured data, sitemap, robots and llms.txt.
// NOTE: update `url` if the production domain differs.
export const SITE = {
  name: 'Espace Auto 92',
  url: 'https://espaceauto92.fr',
  // TEMP (Google Ads — certification « docs officiels » en cours) : mention
  // « carte grise » retirée des meta description / og:description. Restaurer
  // les 2 lignes commentées ci-dessous une fois la certification obtenue.
  // description:
  //   "Espace Auto 92 — Distributeur de pièces détachées automobiles pour particuliers et professionnels à Nanterre (92) depuis 2017. Large stock, prix compétitifs, livraison express, carte grise et plaques d'immatriculation en 10 minutes.",
  description:
    'Espace Auto 92 — Magasin de pièces détachées automobiles à Nanterre (92) pour particuliers et professionnels depuis 2017. Toutes marques, large stock, prix compétitifs et livraison express.',
  // shortDescription:
  //   'Distributeur de pièces détachées auto à Nanterre (92) : large stock, prix pros, carte grise et plaques en 10 min.',
  shortDescription:
    'Magasin de pièces détachées auto à Nanterre (92) : toutes marques, large stock, prix pros et livraison express.',
  phone: '+33147851000',
  phoneDisplay: '01 47 85 10 00',
  whatsapp: '33756997939', // wa.me number (international, no +)
  email: 'espaceauto92.info@gmail.com',
  street: '426 Avenue de la République',
  city: 'Nanterre',
  postalCode: '92000',
  region: 'Île-de-France',
  country: 'FR',
  foundingDate: '2017',
  priceRange: '€€',
} as const
