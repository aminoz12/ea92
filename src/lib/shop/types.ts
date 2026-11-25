import type { FittingJobId } from './config'

export type CategoryId =
  | 'freinage'
  | 'entretien'
  | 'distribution'
  | 'embrayage'
  | 'suspension'
  | 'demarrage'
  | 'eclairage'
  | 'visibilite'
  | 'direction'
  | 'echappement'
  | 'outillage'
  | 'carrosserie'

export interface Category {
  id: CategoryId
  name: string
  image: string
  blurb: string
}

// Where the part is right now:
//  - magasin          : on the shelf in Nanterre, ready in ~30 min
//  - fournisseur_4h   : prepared by the supplier (TecCom / AutoPrécision), in store in ~4 h
//  - fournisseur_24h  : next-day supplier delivery
export type Availability = 'magasin' | 'fournisseur_4h' | 'fournisseur_24h'

// Wear parts drive the digital service log + WhatsApp reminders.
export type WearPartKind =
  | 'plaquettes'
  | 'disques'
  | 'vidange'
  | 'filtre-air'
  | 'filtre-habitacle'
  | 'balais'
  | 'batterie'
  | 'distribution'
  | 'ampoule'
  | 'amortisseurs'

/* ------------------------------------------------------------------ */
/*  INTERNAL catalogue (server only — contains purchase prices & RFA) */
/* ------------------------------------------------------------------ */

export interface InternalOffer {
  brand: string
  reference: string
  priceTTC: number
  purchaseHT: number // net purchase price before RFA
  rfaRate: number // supplier year-end rebate on this brand (0..1)
  availability: Availability
  stock?: number // units on the shelf when availability === 'magasin'
}

export interface InternalProduct {
  slug: string
  name: string
  category: CategoryId
  image: string
  position?: string
  description: string
  specs: Record<string, string>
  oe: string[] // OE / cross references, used by the PRO reference search
  // Demo compatibility: vehicle keys (see lib/integrations/vehicle.ts) or 'all'
  fits: string[] | 'all'
  wearPart?: WearPartKind
  fittingJob?: FittingJobId
  // Crossed-out "before" price. Real promos: it must be the lowest price
  // charged in the previous 30 days (Code de la consommation, art. L112-1-1).
  compareAtTTC?: number
  marketPriceTTC?: number // optional competitor price — caps the "cheapest band"
  weightKg?: number // shipping weight (default 1 kg)
  parcelForbidden?: boolean // e.g. lead-acid batteries: no parcel shipping
  depositTTC?: number // "consigne" on exchange parts, refunded when the old part comes back
  tags?: ('best-seller' | 'promo' | 'hiver' | 'appel')[]
  offers: InternalOffer[]
}

/* ------------------------------------------------------------------ */
/*  PUBLIC catalogue (safe to send to the browser)                    */
/* ------------------------------------------------------------------ */

export interface PublicOffer {
  brand: string
  brandLogo?: string
  reference: string
  priceTTC: number
  availability: Availability
  stock?: number
  recommended: boolean
}

export interface PublicProduct {
  slug: string
  name: string
  category: CategoryId
  categoryName: string
  image: string
  position?: string
  description: string
  specs: Record<string, string>
  oe: string[]
  fits: string[] | 'all'
  wearPart?: WearPartKind
  fittingJob?: FittingJobId
  compareAtTTC?: number
  weightKg: number
  parcelForbidden: boolean
  depositTTC?: number
  tags: NonNullable<InternalProduct['tags']>
  offers: PublicOffer[] // ranked: recommended first
}

export interface Vehicle {
  key: string
  plate: string
  make: string
  model: string
  version: string
  engine: string
  fuel: 'Essence' | 'Diesel' | 'Hybride' | 'Électrique'
  year: number
  firstRegistration?: string // ISO date of first registration (DPMC), drives the CT reminder
  vin?: string
  /** TecDoc vehicle type (KTYP): what the real catalogue needs to list compatible parts. */
  ktype?: number
  /** Production period, shown instead of `year` when the vehicle was picked by make and model. */
  yearsLabel?: string
  /** 'siv' = identified by its plate; 'tecdoc' = picked by make and model in the catalogue; 'demo' = placeholder when the plate API is not configured. */
  source: 'siv' | 'demo' | 'tecdoc'
}

export type FulfilmentMode = 'retrait' | 'coursier' | 'colis' | 'montage'

export interface CartLine {
  /**
   * `art-<token>` for an article of the real catalogue: the token is the opaque
   * id from lib/shop/articleToken.server.ts, which only the server can turn
   * back into a reference. (A demo product has its own slug.)
   */
  slug: string
  brand: string
  /** Always empty for a catalogue article: the customer must never see a part's reference. */
  reference: string
  name: string
  /** May be empty for a catalogue article that has no picture. */
  image: string
  /** Page the line links back to; demo products link to /boutique/<slug>. */
  href?: string
  priceTTC: number
  qty: number
  fittingJob?: FittingJobId
  wearPart?: WearPartKind
  weightKg?: number
  parcelForbidden?: boolean
  depositTTC?: number // per unit
}
