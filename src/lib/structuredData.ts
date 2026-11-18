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
      "Achat en ligne : vous disposez de 14 jours après réception pour exercer votre droit de rétractation, la pièce doit être retournée non montée, dans son emballage et son état d'origine. Achat en magasin : sauf erreur de notre part, les articles ne sont ni repris ni échangés. Dans tous les cas, une erreur de référence de notre part est échangée immédiatement.",
  },
  {
    question: 'Après avoir passé commande, quel est le délai de réception ?',
    answer:
      "Notre boutique dispose d'un vaste stock. Si l'article est épuisé et nécessite une commande, celle-ci arrive en boutique dans un délai allant de 4h à 24h (sous réserve de disponibilité).",
  },
  {
    question: 'Puis-je commander en ligne et me faire livrer ?',
    answer:
      'Oui, partout en France. Choisissez au moment du paiement : retrait au magasin de Nanterre (ou en casier click & collect), livraison express par coursier en Île-de-France, envoi en colis partout en France, ou livraison directe dans un garage partenaire qui monte la pièce à prix fixe.',
  },
  {
    question: 'Comment être sûr que la pièce est compatible avec mon véhicule ?',
    answer:
      "Saisissez votre plaque d'immatriculation dans la boutique : nous identifions votre véhicule et n'affichons que les pièces compatibles. En cas de doute, envoyez-nous votre carte grise sur WhatsApp et un conseiller vérifie la référence avant l'envoi.",
  },
  {
    question: 'Les pièces sont-elles garanties ?',
    answer:
      "Oui, l'ensemble de nos pièces est garanti 1 an, dans le respect des conditions fournisseurs.",
  },
  {
    question: 'Je souhaiterais avoir plus d\'informations sur vos services, comment faire ?',
    answer:
      'Retrait au magasin, livraison, montage en garage partenaire, club fidélité, carnet d’entretien : tout est détaillé dans le menu du site. Vous pouvez aussi nous poser directement vos questions, nous serons ravis de vous renseigner au 01 47 85 10 00.',
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
