import { SITE } from './site'

// LocalBusiness (AutoPartsStore) — the core schema for local SEO + AEO/GEO.
// Clearly identifies the business as an auto PARTS store (not a repair garage).
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoPartsStore',
  '@id': `${SITE.url}/#business`,
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  image: `${SITE.url}/logo.png`,
  logo: `${SITE.url}/logo.png`,
  priceRange: SITE.priceRange,
  foundingDate: SITE.foundingDate,
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Cash, Credit Card, Debit Card',
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.street,
    addressLocality: SITE.city,
    postalCode: SITE.postalCode,
    addressRegion: SITE.region,
    addressCountry: SITE.country,
  },
  areaServed: [
    { '@type': 'City', name: 'Nanterre' },
    { '@type': 'AdministrativeArea', name: 'Hauts-de-Seine (92)' },
    { '@type': 'AdministrativeArea', name: 'Île-de-France' },
  ],
  knowsLanguage: ['fr', 'en'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
      opens: '09:00',
      closes: '18:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Friday',
      opens: '09:00',
      closes: '12:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Friday',
      opens: '15:00',
      closes: '18:30',
    },
  ],
  makesOffer: {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      // TEMP (Google Ads — certification en cours) : mention « carte grise »
      // retirée du JSON-LD. Restaurer la ligne commentée après certification.
      // name: "Pièces détachées automobiles, carte grise et plaques d'immatriculation",
      name: "Pièces détachées automobiles et plaques d'immatriculation",
    },
  },
}

export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  name: SITE.name,
  url: SITE.url,
  inLanguage: 'fr-FR',
  publisher: { '@id': `${SITE.url}/#business` },
}

// FAQPage — mirrors the FAQ section so answer engines can surface direct answers.
const faqItems: { question: string; answer: string }[] = [
  {
    question: 'Comment puis-je retourner un article ?',
    answer:
      "Sauf erreur de notre part, les articles ne sont ni repris ni échangés. Pour tous articles retournés, ils doivent être dans leur emballage et état d'origine, sans aucune trace de montage ou d'usure.",
  },
  {
    question: 'Après avoir passé commande, quel est le délai de réception ?',
    answer:
      "Notre boutique dispose d'un vaste stock. Si l'article est épuisé et nécessite une commande, celle-ci arrive en boutique dans un délai allant de 4h à 24h (sous réserve de disponibilité).",
  },
  {
    question: 'Les pièces sont-elles garanties ?',
    answer:
      "Oui, l'ensemble de nos pièces est garanti 1 an, dans le respect des conditions fournisseurs.",
  },
  {
    question: 'Je souhaiterais avoir plus d\'informations sur vos services, comment faire ?',
    answer:
      'Consultez notre page « Nos Services » et découvrez tous les bénéfices que vous pourrez tirer avec Espace Auto 92. Vous pouvez également nous contacter directement au 01 47 85 10 00, nous serons ravis de vous renseigner.',
  },
  // TEMP (Google Ads — certification en cours) : question FAQ « carte grise »
  // retirée du JSON-LD (miroir de la FAQ visible). Décommenter pour restaurer.
  // {
  //   question: "Quels sont les documents nécessaires pour la création d'une carte grise ?",
  //   answer:
  //     "Vos cartes grises et plaques d'immatriculation sont réalisées en seulement 10 minutes en magasin ou en ligne. Les documents nécessaires sont disponibles au téléchargement sur notre page FAQ.",
  // },
]

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE.url}/#faq`,
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}
