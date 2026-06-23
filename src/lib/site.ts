// Central site / business configuration — single source of truth for SEO,
// structured data, sitemap, robots and llms.txt.
// NOTE: update `url` if the production domain differs.
export const SITE = {
  name: 'Espace Auto 92',
  url: 'https://espaceauto92.fr',
  description:
    "Espace Auto 92 — Distributeur de pièces détachées automobiles pour particuliers et professionnels à Nanterre (92) depuis 2017. Large stock, prix compétitifs, livraison express, carte grise et plaques d'immatriculation en 10 minutes.",
  shortDescription:
    'Distributeur de pièces détachées auto à Nanterre (92) : large stock, prix pros, carte grise et plaques en 10 min.',
  phone: '+33147851000',
  phoneDisplay: '01 47 85 10 00',
  email: 'espaceauto92.info@gmail.com',
  street: '426 Avenue de la République',
  city: 'Nanterre',
  postalCode: '92000',
  region: 'Île-de-France',
  country: 'FR',
  foundingDate: '2017',
  priceRange: '€€',
} as const
