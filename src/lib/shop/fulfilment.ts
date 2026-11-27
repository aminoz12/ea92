// ---------------------------------------------------------------------------
//  The 4 fulfilment modes + fallback price estimates.
//
//  Client-safe (no secrets): used to display the modes, and by the quote API
//  route as a fallback while Uber Direct / Boxtal are not connected.
// ---------------------------------------------------------------------------

import { FULFILMENT, LOYALTY } from './config'
import { round2 } from './ranking'
import type { FulfilmentMode } from './types'

export interface FulfilmentInfo {
  id: FulfilmentMode
  name: string
  short: string
  partner: string
  delay: string
  priceLabel: string
  description: string
}

export const FULFILMENT_MODES: FulfilmentInfo[] = [
  {
    id: 'retrait',
    name: 'Retrait en magasin',
    short: 'Retrait magasin',
    partner: 'Comptoir + casiers click & collect',
    delay: `Prêt en ${FULFILMENT.pickupReadyMinutes} min si en stock`,
    priceLabel: 'Gratuit',
    description:
      'Récupérez votre pièce au comptoir à Nanterre — et bientôt 24 h/24 dans nos casiers devant le magasin, avec un code reçu par WhatsApp.',
  },
  {
    id: 'coursier',
    name: 'Livraison express par coursier',
    short: 'Coursier en ~1 h',
    partner: 'Uber Direct',
    delay: 'En ~1 h en Île-de-France',
    priceLabel: `Dès ${FULFILMENT.courier.baseFeeTTC.toFixed(2).replace('.', ',')} €`,
    description:
      'Un coursier récupère votre commande au magasin et vous la livre à domicile ou à l’atelier. Prix calculé automatiquement selon votre adresse.',
  },
  {
    id: 'colis',
    name: 'Expédition partout en France',
    short: 'Colis 24–72 h',
    partner: 'Boxtal (Colissimo, Mondial Relay, Chronopost…)',
    delay: FULFILMENT.parcel.delay,
    priceLabel: `Dès ${FULFILMENT.parcel.relayFromTTC.toFixed(2).replace('.', ',')} € — offert dès ${FULFILMENT.parcel.freeAboveTTC} €`,
    description:
      'Point relais ou domicile : on compare les transporteurs pour vous et le suivi colis arrive sur WhatsApp.',
  },
  {
    id: 'montage',
    name: 'Livraison + montage en garage partenaire',
    short: 'Montage prix fixe',
    partner: 'Garages partenaires',
    delay: 'Rendez-vous sous 24–72 h',
    priceLabel: 'Prix fixe par intervention',
    description:
      'Votre pièce est livrée directement au garage partenaire de votre choix, qui la monte à un prix fixe annoncé à l’avance.',
  },
]

export const getFulfilment = (id: FulfilmentMode) => FULFILMENT_MODES.find((m) => m.id === id)!

/* ------------------------------------------------------------------ */
/*  Fallback estimates (used until the carrier APIs answer)            */
/* ------------------------------------------------------------------ */

export interface QuoteEstimate {
  available: boolean
  feeTTC: number
  etaLabel: string
  zoneLabel?: string
  reason?: string
}

export function estimateCourier(postalCode: string): QuoteEstimate {
  const cp = postalCode.replace(/\s/g, '')
  if (!/^\d{5}$/.test(cp)) {
    return { available: false, feeTTC: 0, etaLabel: '', reason: 'Code postal invalide' }
  }
  // First matching zone wins — zones are ordered from the most precise prefix.
  const zone = FULFILMENT.courier.zones.find((z) => z.prefixes.some((p) => cp.startsWith(p)))
  if (!zone) {
    return {
      available: false,
      feeTTC: 0,
      etaLabel: '',
      reason: 'Livraison coursier limitée à l’Île-de-France — choisissez l’expédition colis.',
    }
  }
  return {
    available: true,
    feeTTC: round2(FULFILMENT.courier.baseFeeTTC + zone.extraTTC),
    etaLabel: `~${zone.etaMinutes} min après préparation`,
    zoneLabel: zone.label,
  }
}

/** Grid price of a parcel of that weight (the band it falls in), before any free delivery. */
export function parcelBandPrice(weightKg: number, option: 'relais' | 'domicile'): number {
  const bands = FULFILMENT.parcel.bands
  const band = bands.find((b) => weightKg <= b.upToKg) ?? bands[bands.length - 1]
  return option === 'relais' ? band.relayTTC : band.homeTTC
}

/**
 * Price of a parcel for the customer: the band of its weight; from
 * freeAboveTTC it is free up to freeUpToKg, and a heavier parcel pays only the
 * difference with that band. (The weight limit is checked by quoteParcel.)
 */
export function estimateParcel(
  weightKg: number,
  cartTotalTTC: number,
  option: 'relais' | 'domicile',
): QuoteEstimate {
  const { freeAboveTTC, freeUpToKg, delay } = FULFILMENT.parcel
  const full = parcelBandPrice(weightKg, option)
  if (cartTotalTTC >= freeAboveTTC) {
    const extra = round2(Math.max(0, full - parcelBandPrice(Math.min(weightKg, freeUpToKg), option)))
    return { available: true, feeTTC: extra, etaLabel: delay, zoneLabel: extra > 0 ? 'Supplément poids' : undefined }
  }
  return { available: true, feeTTC: full, etaLabel: delay }
}

/** Loyalty points earned on a basket (particuliers). */
export const pointsFor = (amountTTC: number) =>
  Math.floor(amountTTC * LOYALTY.particulier.pointsPerEuro)
