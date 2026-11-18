import 'server-only'

// ---------------------------------------------------------------------------
//  DEMO catalogue — INTERNAL data (purchase prices, RFA). Server only.
//
//  Replace with the real feed (TecCom / AutoPrécision availability + your
//  purchase conditions). The browser only ever receives `PublicProduct`
//  objects built by `toPublicProduct()` — never purchase prices or RFA.
// ---------------------------------------------------------------------------

import { BRAND_LOGOS, getCategory } from './categories'
import { PRO, VAT_RATE } from './config'
import { rankOffers, round2 } from './ranking'
import type { Availability, InternalProduct, PublicProduct } from './types'

const WIPER = '/images/products/balais-essuie-glace.svg'
const BULB = '/images/products/ampoule.svg'

export const INTERNAL_PRODUCTS: InternalProduct[] = [
  {
    slug: 'plaquettes-frein-avant',
    weightKg: 1.5,
    name: 'Plaquettes de frein avant',
    category: 'freinage',
    image: '/images/products/freinage1.png',
    position: 'Essieu avant',
    description:
      'Jeu de 4 plaquettes pour l’essieu avant, avec témoin d’usure selon montage. Contrôlez l’épaisseur des disques au changement.',
    specs: { Contenu: '4 plaquettes', Position: 'Avant', 'Témoin d’usure': 'Selon véhicule', Garantie: '1 an' },
    oe: ['GDB1550', '0986494262', 'FDB4050', '425467'],
    fits: 'all',
    wearPart: 'plaquettes',
    fittingJob: 'plaquettes-av',
    tags: ['best-seller'],
    offers: [
      { brand: 'TRW', reference: 'GDB1550', priceTTC: 32.9, purchaseHT: 14.2, rfaRate: 0.06, availability: 'magasin', stock: 6 },
      { brand: 'Bosch', reference: '0 986 494 262', priceTTC: 31.9, purchaseHT: 15.1, rfaRate: 0.03, availability: 'magasin', stock: 4 },
      { brand: 'Ferodo', reference: 'FDB4050', priceTTC: 33.2, purchaseHT: 14.6, rfaRate: 0.04, availability: 'fournisseur_4h' },
      { brand: 'Brembo', reference: 'P 61 117', priceTTC: 39.9, purchaseHT: 18.4, rfaRate: 0.05, availability: 'fournisseur_4h' },
    ],
  },
  {
    slug: 'disques-frein-avant',
    weightKg: 8,
    name: 'Disques de frein avant (la paire)',
    category: 'freinage',
    image: '/freinage.png',
    position: 'Essieu avant',
    description:
      'Paire de disques ventilés. À remplacer avec des plaquettes neuves pour un freinage homogène.',
    specs: { Contenu: '2 disques', Type: 'Ventilé', Position: 'Avant', Garantie: '1 an' },
    oe: ['DF4465', '09.A727.11', '0986479C20', '424934'],
    fits: 'all',
    wearPart: 'disques',
    fittingJob: 'disques-plaquettes-av',
    tags: ['best-seller'],
    offers: [
      { brand: 'TRW', reference: 'DF4465', priceTTC: 59.9, purchaseHT: 27.8, rfaRate: 0.06, availability: 'magasin', stock: 3 },
      { brand: 'Brembo', reference: '09.A727.11', priceTTC: 64.9, purchaseHT: 31.5, rfaRate: 0.05, availability: 'magasin', stock: 2 },
      { brand: 'Bosch', reference: '0 986 479 C20', priceTTC: 61.9, purchaseHT: 30.9, rfaRate: 0.03, availability: 'fournisseur_4h' },
    ],
  },
  {
    slug: 'huile-moteur-5w30-5l',
    weightKg: 4.8,
    name: 'Huile moteur 5W-30 (5 L)',
    category: 'entretien',
    image: '/images/products/huile1.png',
    description:
      'Huile synthétique faible teneur en cendres (Low SAPS), compatible filtres à particules. Vérifiez la norme constructeur de votre véhicule.',
    specs: { Viscosité: '5W-30', Contenance: '5 L', Normes: 'ACEA C2/C3 selon marque', Type: 'Synthèse' },
    oe: ['PSA B71 2290', 'VW 504.00/507.00', 'RN0720'],
    fits: 'all',
    wearPart: 'vidange',
    fittingJob: 'vidange',
    tags: ['best-seller'],
    offers: [
      { brand: 'Total', reference: 'Quartz Ineo ECS 5W-30', priceTTC: 44.9, purchaseHT: 21, rfaRate: 0.05, availability: 'magasin', stock: 24 },
      { brand: 'Castrol', reference: 'Edge 5W-30 LL', priceTTC: 49.9, purchaseHT: 24.5, rfaRate: 0.04, availability: 'magasin', stock: 12 },
      { brand: 'Mobil', reference: 'Mobil 1 ESP 5W-30', priceTTC: 52.9, purchaseHT: 26.8, rfaRate: 0.03, availability: 'fournisseur_4h' },
    ],
  },
  {
    slug: 'huile-moteur-5w40-5l',
    weightKg: 4.8,
    name: 'Huile moteur 5W-40 (5 L)',
    category: 'entretien',
    image: '/images/products/huile2.png',
    description: 'Huile synthétique pour moteurs essence et diesel sans filtre à particules.',
    specs: { Viscosité: '5W-40', Contenance: '5 L', Normes: 'ACEA A3/B4', Type: 'Synthèse' },
    oe: ['VW 502.00/505.00', 'MB 229.3'],
    fits: 'all',
    wearPart: 'vidange',
    fittingJob: 'vidange',
    offers: [
      { brand: 'Total', reference: 'Quartz 9000 5W-40', priceTTC: 39.9, purchaseHT: 18.4, rfaRate: 0.05, availability: 'magasin', stock: 20 },
      { brand: 'Castrol', reference: 'Magnatec 5W-40', priceTTC: 42.9, purchaseHT: 20.2, rfaRate: 0.04, availability: 'magasin', stock: 14 },
      { brand: 'Mobil', reference: 'Super 3000 X1 5W-40', priceTTC: 41.9, purchaseHT: 19.8, rfaRate: 0.03, availability: 'magasin', stock: 9 },
    ],
  },
  {
    slug: 'filtre-a-huile',
    name: 'Filtre à huile',
    category: 'entretien',
    image: '/images/products/filtre1.png',
    description: 'À changer à chaque vidange. Joint fourni selon référence.',
    specs: { Type: 'Cartouche', 'Joint fourni': 'Oui', Garantie: '1 an' },
    oe: ['L358A', 'OX 171/2D', 'ELH4358', 'F 026 407 157', '1109CK'],
    fits: 'all',
    wearPart: 'vidange',
    fittingJob: 'vidange',
    tags: ['best-seller'],
    offers: [
      { brand: 'Purflux', reference: 'L358A', priceTTC: 9.9, purchaseHT: 3.9, rfaRate: 0.05, availability: 'magasin', stock: 18 },
      { brand: 'Mecafilter', reference: 'ELH4358', priceTTC: 8.9, purchaseHT: 3.7, rfaRate: 0.03, availability: 'magasin', stock: 10 },
      { brand: 'MAHLE', reference: 'OX 171/2D', priceTTC: 11.9, purchaseHT: 4.8, rfaRate: 0.04, availability: 'magasin', stock: 9 },
      { brand: 'Bosch', reference: 'F 026 407 157', priceTTC: 10.9, purchaseHT: 4.6, rfaRate: 0.03, availability: 'fournisseur_4h' },
    ],
  },
  {
    slug: 'filtre-a-air',
    name: 'Filtre à air moteur',
    category: 'entretien',
    image: '/images/products/filtre2.png',
    description: 'Un filtre à air propre préserve la consommation et les performances du moteur.',
    specs: { Type: 'Élément filtrant', Garantie: '1 an' },
    oe: ['A1268', 'LX 1780/3', 'F 026 400 287'],
    fits: 'all',
    wearPart: 'filtre-air',
    offers: [
      { brand: 'Purflux', reference: 'A1268', priceTTC: 16.9, purchaseHT: 7.4, rfaRate: 0.05, availability: 'magasin', stock: 7 },
      { brand: 'MAHLE', reference: 'LX 1780/3', priceTTC: 18.9, purchaseHT: 8.1, rfaRate: 0.04, availability: 'magasin', stock: 5 },
      { brand: 'Bosch', reference: 'F 026 400 287', priceTTC: 17.9, purchaseHT: 8.2, rfaRate: 0.03, availability: 'fournisseur_4h' },
    ],
  },
  {
    slug: 'filtre-habitacle-charbon',
    name: 'Filtre d’habitacle charbon actif',
    category: 'entretien',
    image: '/filtrage.png',
    description: 'Filtre pollens, particules et odeurs. À remplacer une fois par an, idéalement avant l’été.',
    specs: { Type: 'Charbon actif', Garantie: '1 an' },
    oe: ['715 581', 'LAK 386', 'AHC264'],
    fits: 'all',
    wearPart: 'filtre-habitacle',
    offers: [
      { brand: 'Valeo', reference: '715 581', priceTTC: 19.9, purchaseHT: 8.4, rfaRate: 0.05, availability: 'magasin', stock: 4 },
      { brand: 'Purflux', reference: 'AHC264', priceTTC: 18.9, purchaseHT: 8.6, rfaRate: 0.04, availability: 'magasin', stock: 3 },
      { brand: 'MAHLE', reference: 'LAK 386', priceTTC: 21.9, purchaseHT: 9.8, rfaRate: 0.04, availability: 'fournisseur_4h' },
    ],
  },
  {
    slug: 'batterie-70ah-efb',
    weightKg: 18,
    parcelForbidden: true, // dangerous goods (lead-acid) — not accepted by parcel carriers
    name: 'Batterie 70 Ah EFB Start & Stop',
    category: 'demarrage',
    image: '/demarage.png',
    description:
      'Batterie EFB pour véhicules Start & Stop. Reprise de votre ancienne batterie en magasin. Mémoire de codes radio : pensez à les noter.',
    specs: { Capacité: '70 Ah', 'Courant de démarrage': '760 A (EN)', Technologie: 'EFB', Garantie: '2 ans' },
    oe: ['E46', '0 092 S4E 081', 'FL700'],
    fits: 'all',
    wearPart: 'batterie',
    fittingJob: 'batterie',
    tags: ['hiver', 'best-seller', 'promo'],
    compareAtTTC: 149.9,
    offers: [
      { brand: 'Varta', reference: 'Blue Dynamic EFB E46', priceTTC: 139.9, purchaseHT: 68, rfaRate: 0.05, availability: 'magasin', stock: 3 },
      { brand: 'Bosch', reference: 'S4 E08 EFB', priceTTC: 134.9, purchaseHT: 66.5, rfaRate: 0.04, availability: 'magasin', stock: 2 },
      { brand: 'Fulmen', reference: 'FL700 EFB', priceTTC: 129.9, purchaseHT: 63, rfaRate: 0.03, availability: 'fournisseur_4h' },
      { brand: 'Banner', reference: 'Running Bull EFB 570 12', priceTTC: 124.9, purchaseHT: 58.9, rfaRate: 0.02, availability: 'fournisseur_24h' },
    ],
  },
  {
    slug: 'kit-distribution-pompe-a-eau',
    tags: ['best-seller', 'promo'],
    compareAtTTC: 209.9,
    weightKg: 3,
    name: 'Kit de distribution + pompe à eau',
    category: 'distribution',
    image: '/images/products/cour3.png',
    description:
      'Courroie, galets et pompe à eau. Pièce critique : nous vérifions la référence avec votre carte grise avant toute commande.',
    specs: { Contenu: 'Courroie, galets, pompe à eau', Garantie: '2 ans' },
    oe: ['KP15580XS', 'VKMC 03316', 'KD059'],
    fits: ['renault-clio-iv-15-dci', 'dacia-sandero-ii-15-dci', 'vw-golf-vii-16-tdi', 'peugeot-308-ii-15-bluehdi'],
    wearPart: 'distribution',
    fittingJob: 'distribution',
    offers: [
      { brand: 'Gates', reference: 'KP15580XS', priceTTC: 176.9, purchaseHT: 92, rfaRate: 0.07, availability: 'fournisseur_4h' },
      { brand: 'Dolz', reference: 'KD059', priceTTC: 169.9, purchaseHT: 84, rfaRate: 0.03, availability: 'fournisseur_4h' },
      { brand: 'SKF', reference: 'VKMC 03316', priceTTC: 184.9, purchaseHT: 95.5, rfaRate: 0.04, availability: 'magasin', stock: 1 },
    ],
  },
  {
    slug: 'kit-distribution',
    weightKg: 1.5,
    name: 'Kit de distribution (sans pompe)',
    category: 'distribution',
    image: '/images/products/cour2.png',
    description: 'Courroie crantée et galets tendeur/enrouleur.',
    specs: { Contenu: 'Courroie, galets', Garantie: '2 ans' },
    oe: ['K015580XS', 'VKMA 03316'],
    fits: ['renault-clio-iv-15-dci', 'dacia-sandero-ii-15-dci', 'vw-golf-vii-16-tdi', 'peugeot-308-ii-15-bluehdi'],
    wearPart: 'distribution',
    fittingJob: 'distribution',
    offers: [
      { brand: 'Gates', reference: 'K015580XS', priceTTC: 109.9, purchaseHT: 52, rfaRate: 0.07, availability: 'fournisseur_4h' },
      { brand: 'SKF', reference: 'VKMA 03316', priceTTC: 112.9, purchaseHT: 55, rfaRate: 0.04, availability: 'fournisseur_4h' },
    ],
  },
  {
    slug: 'kit-courroie-accessoires',
    name: 'Kit courroie d’accessoires',
    category: 'distribution',
    image: '/images/products/cour1.png',
    description: 'Courroie d’alternateur / climatisation avec galets.',
    specs: { Contenu: 'Courroie, galet(s)', Garantie: '1 an' },
    oe: ['K016PK1153', 'VKMA 36000'],
    fits: 'all',
    offers: [
      { brand: 'Gates', reference: 'K016PK1153', priceTTC: 54.9, purchaseHT: 24.5, rfaRate: 0.07, availability: 'magasin', stock: 3 },
      { brand: 'Dayco', reference: 'KPV463', priceTTC: 52.9, purchaseHT: 25.2, rfaRate: 0.02, availability: 'fournisseur_4h' },
      { brand: 'SKF', reference: 'VKMA 36000', priceTTC: 57.9, purchaseHT: 27, rfaRate: 0.04, availability: 'fournisseur_24h' },
    ],
  },
  {
    slug: 'kit-embrayage',
    weightKg: 7,
    name: 'Kit d’embrayage 3 pièces',
    category: 'embrayage',
    image: '/embriage.png',
    description: 'Mécanisme, disque et butée. Volant moteur à contrôler lors du montage.',
    specs: { Contenu: 'Mécanisme, disque, butée', Garantie: '2 ans' },
    oe: ['620 3080 00', '826317', '3000 951 031'],
    fits: ['peugeot-208-ii-12-puretech', 'renault-clio-iv-15-dci', 'citroen-c3-iii-12-puretech', 'vw-golf-vii-16-tdi', 'dacia-sandero-ii-15-dci', 'peugeot-308-ii-15-bluehdi'],
    fittingJob: 'embrayage',
    offers: [
      { brand: 'Valeo', reference: '826317', priceTTC: 219.9, purchaseHT: 108, rfaRate: 0.05, availability: 'fournisseur_4h' },
      { brand: 'LuK', reference: '620 3080 00', priceTTC: 229.9, purchaseHT: 112, rfaRate: 0.06, availability: 'fournisseur_4h' },
      { brand: 'Sachs', reference: '3000 951 031', priceTTC: 234.9, purchaseHT: 115, rfaRate: 0.05, availability: 'fournisseur_24h' },
    ],
  },
  {
    slug: 'amortisseurs-avant',
    weightKg: 6,
    name: 'Amortisseurs avant (la paire)',
    category: 'suspension',
    image: '/suspension.png',
    position: 'Essieu avant',
    description: 'Paire d’amortisseurs à gaz. Toujours remplacer par essieu complet.',
    specs: { Contenu: '2 amortisseurs', Type: 'Gaz', Position: 'Avant', Garantie: '2 ans' },
    oe: ['316 999', '339 702', '22-232540'],
    fits: 'all',
    wearPart: 'amortisseurs',
    fittingJob: 'amortisseurs-av',
    offers: [
      { brand: 'Sachs', reference: '316 999', priceTTC: 139.9, purchaseHT: 66, rfaRate: 0.05, availability: 'magasin', stock: 2 },
      { brand: 'KYB', reference: '339 702', priceTTC: 129.9, purchaseHT: 62.5, rfaRate: 0.03, availability: 'fournisseur_4h' },
      { brand: 'Bilstein', reference: '22-232540', priceTTC: 154.9, purchaseHT: 74, rfaRate: 0.04, availability: 'fournisseur_24h' },
    ],
  },
  {
    slug: 'rotule-de-direction',
    name: 'Rotule de direction',
    category: 'direction',
    image: '/direction.png',
    description: 'Rotule de barre d’accouplement. Un contrôle du parallélisme est recommandé après montage.',
    specs: { Côté: 'Gauche ou droit selon référence', Garantie: '1 an' },
    oe: ['JTE1083', 'ES800963', '18578'],
    fits: 'all',
    offers: [
      { brand: 'TRW', reference: 'JTE1083', priceTTC: 24.9, purchaseHT: 10.2, rfaRate: 0.06, availability: 'magasin', stock: 4 },
      { brand: 'Febi', reference: '18578', priceTTC: 22.9, purchaseHT: 9.8, rfaRate: 0.04, availability: 'magasin', stock: 3 },
      { brand: 'Moog', reference: 'ES800963', priceTTC: 26.9, purchaseHT: 11.5, rfaRate: 0.05, availability: 'fournisseur_4h' },
    ],
  },
  {
    slug: 'balais-essuie-glace-avant',
    name: 'Balais d’essuie-glace avant (x2)',
    category: 'visibilite',
    image: WIPER,
    position: 'Pare-brise',
    description:
      'Kit de 2 balais plats avec adaptateurs. Promo de saison : une paire achetée, un dégivrant Holts offert (dans la limite des stocks).',
    specs: { Contenu: '2 balais', Type: 'Plat (flat blade)', Fixation: 'Multi-adaptateurs', Garantie: '1 an' },
    oe: ['3 397 007 297', '577 932'],
    fits: 'all',
    wearPart: 'balais',
    fittingJob: 'essuie-glaces',
    tags: ['appel', 'hiver', 'best-seller', 'promo'],
    compareAtTTC: 21.9,
    offers: [
      { brand: 'Technikit', reference: 'TK-650-400', priceTTC: 17.9, purchaseHT: 6.4, rfaRate: 0.02, availability: 'magasin', stock: 20 },
      { brand: 'Valeo', reference: 'Silencio X.TRM 577932', priceTTC: 27.9, purchaseHT: 11.3, rfaRate: 0.05, availability: 'magasin', stock: 10 },
      { brand: 'Bosch', reference: 'Aerotwin A297S', priceTTC: 29.9, purchaseHT: 12.4, rfaRate: 0.04, availability: 'magasin', stock: 15 },
    ],
  },
  {
    slug: 'balai-essuie-glace-arriere',
    name: 'Balai d’essuie-glace arrière',
    category: 'visibilite',
    image: WIPER,
    position: 'Lunette arrière',
    description: 'Balai arrière à fixation spécifique — on vérifie le modèle avec votre plaque.',
    specs: { Contenu: '1 balai', Garantie: '1 an' },
    oe: ['3 397 008 997', '574 609'],
    fits: 'all',
    wearPart: 'balais',
    fittingJob: 'essuie-glaces',
    tags: ['appel'],
    offers: [
      { brand: 'Valeo', reference: '574 609', priceTTC: 11.9, purchaseHT: 4.7, rfaRate: 0.05, availability: 'magasin', stock: 6 },
      { brand: 'Bosch', reference: 'Rear H 309', priceTTC: 12.9, purchaseHT: 5.1, rfaRate: 0.04, availability: 'magasin', stock: 8 },
    ],
  },
  {
    slug: 'ampoules-h7',
    name: 'Ampoules H7 12 V 55 W (x2)',
    category: 'eclairage',
    image: BULB,
    description: 'Ampoules de phare halogènes homologuées. Changez-les toujours par paire pour un éclairage égal.',
    specs: { Culot: 'PX26d', Puissance: '55 W', Tension: '12 V', Contenu: '2 ampoules' },
    oe: ['12972PRC1', '64210NBS-HCB', '1 987 301 090'],
    fits: 'all',
    wearPart: 'ampoule',
    fittingJob: 'ampoule',
    tags: ['appel', 'best-seller', 'promo'],
    compareAtTTC: 14.9,
    offers: [
      { brand: 'Osram', reference: 'Original Line 64210', priceTTC: 11.9, purchaseHT: 4.3, rfaRate: 0.04, availability: 'magasin', stock: 40 },
      { brand: 'Bosch', reference: 'Pure Light H7', priceTTC: 10.9, purchaseHT: 4.1, rfaRate: 0.03, availability: 'magasin', stock: 25 },
      { brand: 'Philips', reference: 'Vision +30 % 12972PRC1', priceTTC: 14.9, purchaseHT: 5.6, rfaRate: 0.04, availability: 'magasin', stock: 30 },
      { brand: 'Osram', reference: 'Night Breaker +200 % 64210NB200', priceTTC: 29.9, purchaseHT: 11.8, rfaRate: 0.05, availability: 'magasin', stock: 12 },
    ],
  },
  {
    slug: 'ampoule-h4',
    name: 'Ampoule H4 12 V 60/55 W',
    category: 'eclairage',
    image: BULB,
    description: 'Ampoule double filament (code + phare) homologuée.',
    specs: { Culot: 'P43t', Puissance: '60/55 W', Tension: '12 V', Contenu: '1 ampoule' },
    oe: ['12342PRC1', '64193'],
    fits: 'all',
    wearPart: 'ampoule',
    fittingJob: 'ampoule',
    tags: ['appel'],
    offers: [
      { brand: 'Bosch', reference: 'Pure Light H4', priceTTC: 7.9, purchaseHT: 3.1, rfaRate: 0.03, availability: 'magasin', stock: 15 },
      { brand: 'Philips', reference: 'Vision 12342PRC1', priceTTC: 8.9, purchaseHT: 3.2, rfaRate: 0.04, availability: 'magasin', stock: 20 },
      { brand: 'Osram', reference: 'Original Line 64193', priceTTC: 9.9, purchaseHT: 3.4, rfaRate: 0.05, availability: 'magasin', stock: 18 },
    ],
  },
  {
    slug: 'ampoules-h1',
    name: 'Ampoules H1 12 V 55 W (x2)',
    category: 'eclairage',
    image: BULB,
    description: 'Ampoules halogènes pour feux de route ou antibrouillards selon véhicule.',
    specs: { Culot: 'P14.5s', Puissance: '55 W', Tension: '12 V', Contenu: '2 ampoules' },
    oe: ['12258PRC1', '64150'],
    fits: 'all',
    wearPart: 'ampoule',
    fittingJob: 'ampoule',
    tags: ['appel'],
    offers: [
      { brand: 'Bosch', reference: 'Pure Light H1', priceTTC: 8.9, purchaseHT: 3.4, rfaRate: 0.03, availability: 'magasin', stock: 12 },
      { brand: 'Philips', reference: 'Vision 12258PRC1', priceTTC: 9.9, purchaseHT: 3.6, rfaRate: 0.04, availability: 'magasin', stock: 14 },
      { brand: 'Osram', reference: 'Original Line 64150', priceTTC: 10.9, purchaseHT: 3.9, rfaRate: 0.05, availability: 'magasin', stock: 9 },
    ],
  },

  // --- Exchange parts ("échange standard"): refundable deposit on the old part ---
  {
    slug: 'etrier-frein-avant-gauche',
    weightKg: 3.5,
    name: 'Étrier de frein avant gauche (échange standard)',
    category: 'freinage',
    image: '/freinage.png',
    position: 'Avant gauche',
    description:
      'Étrier reconditionné, testé sous pression. Vendu en échange standard : la consigne est remboursée au retour de votre ancien étrier.',
    specs: { Position: 'Avant gauche', Piston: 'Ø 54 mm', État: 'Échange standard (reconditionné)', Garantie: '1 an' },
    oe: ['4400S0', '343839', 'BHN1032E'],
    fits: ['peugeot-208-ii-12-puretech', 'citroen-c3-iii-12-puretech', 'peugeot-308-ii-15-bluehdi'],
    fittingJob: 'etrier',
    depositTTC: 25,
    offers: [
      { brand: 'TRW', reference: 'BHN1032E', priceTTC: 89.9, purchaseHT: 41.5, rfaRate: 0.06, availability: 'fournisseur_4h' },
      { brand: 'Bosch', reference: '0 986 135 482', priceTTC: 94.9, purchaseHT: 45.2, rfaRate: 0.03, availability: 'fournisseur_24h' },
    ],
  },
  {
    slug: 'demarreur-echange-standard',
    weightKg: 4,
    name: 'Démarreur (échange standard)',
    category: 'demarrage',
    image: '/demarage.png',
    description:
      'Démarreur reconditionné aux normes constructeur. Vendu en échange standard : la consigne est remboursée au retour de votre ancien démarreur.',
    specs: { Puissance: '1,1 kW', Tension: '12 V', État: 'Échange standard (reconditionné)', Garantie: '1 an' },
    oe: ['5802Z0', 'TS10E3', '0001138025'],
    fits: ['peugeot-208-ii-12-puretech', 'citroen-c3-iii-12-puretech'],
    fittingJob: 'demarreur',
    depositTTC: 60,
    offers: [
      { brand: 'Valeo', reference: 'TS10E3 (ES)', priceTTC: 179.9, purchaseHT: 84.0, rfaRate: 0.05, availability: 'fournisseur_4h' },
      { brand: 'Bosch', reference: '0 986 025 840', priceTTC: 189.9, purchaseHT: 91.5, rfaRate: 0.03, availability: 'fournisseur_24h' },
    ],
  },
  {
    slug: 'alternateur-echange-standard',
    weightKg: 6,
    name: 'Alternateur (échange standard)',
    category: 'demarrage',
    image: '/demarage.png',
    description:
      'Alternateur reconditionné, régulateur et roulements neufs. Vendu en échange standard : la consigne est remboursée au retour de votre ancien alternateur.',
    specs: { Intensité: '110 A', Tension: '14 V', État: 'Échange standard (reconditionné)', Garantie: '1 an' },
    oe: ['231008498R', 'TG11C072', '0986049310'],
    fits: ['renault-clio-iv-15-dci', 'dacia-sandero-ii-15-dci'],
    fittingJob: 'alternateur',
    depositTTC: 80,
    offers: [
      { brand: 'Valeo', reference: 'TG11C072 (ES)', priceTTC: 229.9, purchaseHT: 109.0, rfaRate: 0.05, availability: 'fournisseur_4h' },
      { brand: 'Bosch', reference: '0 986 049 310', priceTTC: 239.9, purchaseHT: 116.0, rfaRate: 0.03, availability: 'fournisseur_4h' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Public projection                                                  */
/* ------------------------------------------------------------------ */

export function toPublicProduct(p: InternalProduct): PublicProduct {
  const { offers } = rankOffers(p.offers, { marketPriceTTC: p.marketPriceTTC })
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    categoryName: getCategory(p.category)?.name ?? p.category,
    image: p.image,
    position: p.position,
    description: p.description,
    specs: p.specs,
    oe: p.oe,
    fits: p.fits,
    wearPart: p.wearPart,
    fittingJob: p.fittingJob,
    compareAtTTC: p.compareAtTTC,
    weightKg: p.weightKg ?? 1,
    parcelForbidden: p.parcelForbidden ?? false,
    depositTTC: p.depositTTC,
    tags: p.tags ?? [],
    // Strip purchase price, RFA and margin before anything leaves the server.
    offers: offers.map((o) => ({
      brand: o.brand,
      brandLogo: BRAND_LOGOS[o.brand],
      reference: o.reference,
      priceTTC: o.priceTTC,
      availability: o.availability,
      stock: o.stock,
      recommended: o.recommended,
    })),
  }
}

export const getPublicCatalog = (): PublicProduct[] => INTERNAL_PRODUCTS.map(toPublicProduct)

export const getPublicProduct = (slug: string): PublicProduct | undefined => {
  const p = INTERNAL_PRODUCTS.find((x) => x.slug === slug)
  return p ? toPublicProduct(p) : undefined
}

/* ------------------------------------------------------------------ */
/*  PRO projection — white label, reference search, net prices HT      */
/* ------------------------------------------------------------------ */

export interface ProCatalogLine {
  reference: string
  brand: string
  name: string
  oe: string[]
  availability: Availability
  priceHT: number // net PRO price = purchase HT × (1 + mark-up)
  publicPriceTTC: number
}

export function getProCatalog(markup: number = PRO.markupDefault): ProCatalogLine[] {
  const m = Math.min(PRO.markupMax, Math.max(PRO.markupMin, markup))
  return INTERNAL_PRODUCTS.flatMap((p) =>
    p.offers.map((o) => ({
      reference: o.reference,
      brand: o.brand,
      name: p.name,
      oe: p.oe,
      availability: o.availability,
      priceHT: round2(o.purchaseHT * (1 + m)),
      publicPriceTTC: o.priceTTC,
    })),
  )
}

export const priceHT = (ttc: number) => round2(ttc / (1 + VAT_RATE))
