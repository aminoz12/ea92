import 'server-only'

// ---------------------------------------------------------------------------
//  Supplier gateway — availability + automatic order preparation.
//
//  Target flow:  web order → supplier prepares automatically
//                → parts arrive at the store → courier / pickup / parcel.
//
//  Open decision: AutoPrécision directly (availability feed, like Topwagen)
//  or TecCom (TecAlliance's B2B order network, multi-supplier). Both fit
//  behind the same interface, so the shop code does not change when you
//  switch — set SUPPLIER_GATEWAY=autoprecision | teccom | demo.
//  Recommendation and trade-offs: docs/integrations.md.
// ---------------------------------------------------------------------------

import { INTERNAL_PRODUCTS } from '../shop/catalog.server'
import type { Availability } from '../shop/types'

export interface PartRef {
  brand: string
  reference: string
}

export interface SupplierAvailability extends PartRef {
  availability: Availability | 'indisponible'
  quantity?: number
  purchaseHT?: number
}

export interface SupplierOrderLine extends PartRef {
  quantity: number
}

export interface SupplierOrderResult {
  supplierOrderId: string
  expectedAtStore: string // ISO date-time
}

export interface SupplierGateway {
  name: 'demo' | 'autoprecision' | 'teccom'
  checkAvailability(parts: PartRef[]): Promise<SupplierAvailability[]>
  placeOrder(webOrderId: string, lines: SupplierOrderLine[]): Promise<SupplierOrderResult>
}

/* ------------------------------------------------------------------ */
/*  Demo gateway — answers from the demo catalogue                     */
/* ------------------------------------------------------------------ */

const demoGateway: SupplierGateway = {
  name: 'demo',
  async checkAvailability(parts) {
    return parts.map((p) => {
      const offer = INTERNAL_PRODUCTS.flatMap((x) => x.offers).find(
        (o) => o.brand === p.brand && o.reference === p.reference,
      )
      return offer
        ? { ...p, availability: offer.availability, quantity: offer.stock, purchaseHT: offer.purchaseHT }
        : { ...p, availability: 'indisponible' }
    })
  },
  async placeOrder(webOrderId) {
    const expected = new Date(Date.now() + 4 * 3600_000)
    return { supplierOrderId: `DEMO-${webOrderId}`, expectedAtStore: expected.toISOString() }
  },
}

/* ------------------------------------------------------------------ */
/*  Real gateways — to implement once access is granted                */
/* ------------------------------------------------------------------ */

const notImplemented = (name: string): never => {
  throw new Error(`${name} gateway not implemented yet — see docs/integrations.md`)
}

// AutoPrécision: availability per platform + delivery rounds to the store.
// Env: AUTOPRECISION_API_URL, AUTOPRECISION_API_KEY, AUTOPRECISION_CUSTOMER_ID
const autoPrecisionGateway: SupplierGateway = {
  name: 'autoprecision',
  checkAvailability: async () => notImplemented('AutoPrécision'),
  placeOrder: async () => notImplemented('AutoPrécision'),
}

// TecCom: standard inquiry (availability/price) + order messages to every
// TecCom-connected supplier. Env: TECCOM_API_URL, TECCOM_USER, TECCOM_PASSWORD
const tecComGateway: SupplierGateway = {
  name: 'teccom',
  checkAvailability: async () => notImplemented('TecCom'),
  placeOrder: async () => notImplemented('TecCom'),
}

export function getSupplierGateway(): SupplierGateway {
  switch (process.env.SUPPLIER_GATEWAY) {
    case 'autoprecision':
      return autoPrecisionGateway
    case 'teccom':
      return tecComGateway
    default:
      return demoGateway
  }
}
