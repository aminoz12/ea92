import type { Category, CategoryId } from './types'

// Shop departments ("rayons") — reuse the existing category visuals.
export const CATEGORIES: Category[] = [
  { id: 'freinage', name: 'Freinage', image: '/freinage.png', blurb: 'Plaquettes, disques, étriers' },
  { id: 'entretien', name: 'Entretien & filtration', image: '/filtrage.png', blurb: 'Huiles, filtres, vidange' },
  { id: 'demarrage', name: 'Batterie & démarrage', image: '/demarage.png', blurb: 'Batteries, démarreurs, alternateurs' },
  { id: 'distribution', name: 'Distribution', image: '/distribution.png', blurb: 'Kits, courroies, pompes à eau' },
  { id: 'eclairage', name: 'Ampoules & éclairage', image: '/eclairage.png', blurb: 'H1, H4, H7, feux, phares' },
  { id: 'visibilite', name: 'Essuie-glaces & vitrage', image: '/vitrage.png', blurb: 'Balais, rétroviseurs, vitrage' },
  { id: 'embrayage', name: 'Embrayage', image: '/embriage.png', blurb: 'Kits, butées, volants moteur' },
  { id: 'suspension', name: 'Suspension', image: '/suspension.png', blurb: 'Amortisseurs, ressorts, rotules' },
  { id: 'direction', name: 'Direction', image: '/direction.png', blurb: 'Rotules, crémaillères, biellettes' },
  { id: 'echappement', name: 'Échappement', image: '/echappement.png', blurb: 'Silencieux, catalyseurs, FAP' },
  { id: 'carrosserie', name: 'Carrosserie', image: '/carosserie.png', blurb: 'Pièces de carrosserie, rénovation' },
  { id: 'outillage', name: 'Outillage', image: '/outilage.png', blurb: 'Outils et équipement garage' },
]

export const getCategory = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)

export const isCategoryId = (v: unknown): v is CategoryId =>
  typeof v === 'string' && CATEGORIES.some((c) => c.id === v)

// Logos already in /public/images/brands — brands without a logo show as text.
export const BRAND_LOGOS: Record<string, string> = {
  Bosch: '/images/brands/bosch.png',
  TRW: '/images/brands/trw.png',
  Ferodo: '/images/brands/ferodo.png',
  Brembo: '/images/brands/brembo.png',
  Valeo: '/images/brands/valeo.png',
  Varta: '/images/brands/varta.png',
  Castrol: '/images/brands/castrol.png',
  MAHLE: '/images/brands/MAHLE.png',
  Purflux: '/images/brands/purflux.png',
  Mecafilter: '/images/brands/mecafilter.png',
  Gates: '/images/brands/gates.png',
  SKF: '/images/brands/skf.png',
  Dolz: '/images/brands/dolz.png',
  LuK: '/images/brands/luk.png',
  Sachs: '/images/brands/sachs.png',
  Febi: '/images/brands/febi.png',
  Moog: '/images/brands/moog.png',
  Delphi: '/images/brands/delphi.png',
  Denso: '/images/brands/denso.png',
}
