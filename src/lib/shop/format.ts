import { FULFILMENT } from './config'
import type { Availability } from './types'

const EUR = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

export const formatEUR = (n: number) => EUR.format(n)

export const AVAILABILITY: Record<
  Availability,
  { label: string; short: string; tone: 'green' | 'amber' | 'gray' }
> = {
  magasin: {
    label: `En stock au magasin — prêt en ${FULFILMENT.pickupReadyMinutes} min`,
    short: 'En stock au magasin',
    tone: 'green',
  },
  fournisseur_4h: {
    label: `Chez notre fournisseur — au magasin en ~${FULFILMENT.supplierLeadHours} h`,
    short: `Dispo en ${FULFILMENT.supplierLeadHours} h`,
    tone: 'amber',
  },
  fournisseur_24h: {
    label: 'Chez notre fournisseur — au magasin sous 24 h',
    short: 'Dispo sous 24 h',
    tone: 'gray',
  },
}

export const pluralize = (n: number, one: string, many: string) => (n > 1 ? many : one)
