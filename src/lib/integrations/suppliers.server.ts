import 'server-only'

// ---------------------------------------------------------------------------
//  Supplier gateway — availability + automatic order preparation.
//
//  Target flow:  web order → supplier prepares automatically
//                → parts arrive at the store → courier / pickup / parcel.
//
//  Gateways: AutoPrécision's EasyOrder API (it queries the suppliers set up
//  on the account, TecCom included) or TecCom directly. Both fit behind the
//  same interface, so the shop code does not change when you switch — set
//  SUPPLIER_GATEWAY=autoprecision | teccom | demo.
// ---------------------------------------------------------------------------

import { INTERNAL_PRODUCTS } from '../shop/catalog.server'
import { FULFILMENT } from '../shop/config'
import type { Availability } from '../shop/types'
import {
  areSupplierOrdersEnabled,
  isEasyOrderConfigured,
  listConnectorConfigs,
  placeOrder,
  streamAvailability,
  type AvailabilityDetail,
  type ConnectorAvailability,
} from './autoprecision/easyorder.server'

export interface PartRef {
  brand: string
  reference: string
  /** TecDoc manufacturer code. EasyOrder needs it with the reference; the catalogue API gives it. */
  dlNr?: number
}

/** Amounts are excl. VAT. None of this goes to the browser as is: see shop/offers.server.ts. */
export interface SupplierAvailability extends PartRef {
  availability: Availability | 'indisponible'
  quantity?: number
  purchaseHT?: number
  /** Selling price the supplier platform computes for our account, when it gives one. */
  saleHT?: number
  /** Manufacturer's recommended public price. */
  publicHT?: number
  /** Deposit on an exchange part ("consigne"). */
  depositHT?: number
}

/** True when stock and prices come from a real supplier platform, not from the demo catalogue. */
export const isSupplierGatewayLive = () => process.env.SUPPLIER_GATEWAY === 'autoprecision' && isEasyOrderConfigured()

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
  throw new Error(`${name} gateway not implemented yet`)
}

// AutoPrécision EasyOrder. The availability mapping below was checked against
// real answers on 24 Nov 2026 (see autoprecision/easyorder.server.ts). The
// order path has never run.

/** A page waits this long for the suppliers; the slower ones are left out of that answer. */
const AVAILABILITY_DEADLINE_MS = 6_000
/** Beyond this the part is not offered online: "sous 24 h" would be a false promise. */
const MAX_LEAD_HOURS = 36

/** A supplier's answer is usable when it says the part is available. */
const usable = (r: ConnectorAvailability) => r.connectorResponse?.status === 'OK' && r.connectorResponse.availability === 'AVAILABLE'

/** What the part costs us, excl. VAT: a price fixed by the supplier takes precedence over the base price. */
const purchasePrice = (d?: AvailabilityDetail) => d?.purchaseFixed ?? d?.purchaseBase

/**
 * EasyOrder dates carry no time zone ("2026-11-25T12:00:00"): they are French
 * local time, whatever zone the server runs in. Returns the instant in ms.
 */
function parisTime(value: string): number | null {
  if (/(Z|[+-]\d{2}:?\d{2})$/.test(value)) {
    const t = Date.parse(value)
    return Number.isNaN(t) ? null : t
  }
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/)
  if (!m) return null
  const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0))
  // What a clock in Paris shows at that UTC instant gives the offset to take off.
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(asUtc))
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const shownInParis = Date.UTC(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'), part('second'))
  return asUtc - (shownInParis - asUtc)
}

/**
 * At the store within about 4 hours, or by the next day; null when it is too
 * far away to be offered online. No date given: assume the next day.
 */
function leadTime(d: AvailabilityDetail, now: number): Availability | null {
  const at = d.deliveryDate ? parisTime(d.deliveryDate) : null
  if (at === null) return 'fournisseur_24h'
  const hours = (at - now) / 3_600_000
  if (hours > MAX_LEAD_HOURS) return null
  // "AFTER" means not before that time: never promised inside the short window.
  return hours <= FULFILMENT.supplierLeadHours && d.dateQualifier !== 'AFTER' ? 'fournisseur_4h' : 'fournisseur_24h'
}

const autoPrecisionGateway: SupplierGateway = {
  name: 'autoprecision',
  async checkAvailability(parts) {
    const answers = await streamAvailability(
      parts.map((p) => ({ artNr: p.reference, dlNr: p.dlNr, quantity: 1 })),
      AVAILABILITY_DEADLINE_MS,
    )
    const now = Date.now()
    return parts.map((p, i) => {
      const candidates = (answers[i]?.responses ?? []).filter(usable).flatMap((r) => {
        const d = r.connectorResponse as AvailabilityDetail
        const lead = leadTime(d, now)
        return lead ? [{ main: r.isPrincipal ?? false, d, lead }] : []
      })
      // The account's main supplier first (none is flagged today), then the cheapest one that has the part.
      const best = candidates.sort(
        (a, b) => Number(b.main) - Number(a.main) || (purchasePrice(a.d) ?? Infinity) - (purchasePrice(b.d) ?? Infinity),
      )[0]
      if (!best) return { ...p, availability: 'indisponible' as const }
      // The manufacturer's public price does not depend on who sells us the part, but not every supplier
      // sends it (0 or nothing) and their lists differ slightly: keep the lowest one given.
      const publicPrices = candidates.map((c) => c.d.publicPrice ?? 0).filter((n) => n > 0)
      return {
        ...p,
        availability: best.lead,
        quantity: best.d.currentAvailability,
        purchaseHT: purchasePrice(best.d),
        saleHT: best.d.saleFixed ?? best.d.saleBase,
        publicHT: publicPrices.length ? Math.min(...publicPrices) : undefined,
        depositHT: best.d.prixConsigne || undefined,
      }
    })
  },
  async placeOrder(webOrderId, lines) {
    // Real supplier order: off unless AUTOPRECISION_ORDERS_ENABLED=true.
    if (!areSupplierOrdersEnabled()) throw new Error('Supplier orders are disabled (AUTOPRECISION_ORDERS_ENABLED)')
    const configs = await listConnectorConfigs()
    // No supplier is flagged as the main one on this account (24 Nov 2026), and
    // sending the order to an arbitrary one would be wrong: the order has to go
    // to the supplier whose availability answer was shown to the customer. Until
    // order lines carry that supplier, refuse rather than guess.
    const target = configs.find((c) => c.isPrincipal && c.canOrder)
    if (!target) throw new Error('No main supplier on this account: the order must name the supplier chosen at availability time')
    const result = await placeOrder(target.connectorConfId, {
      orderRef: webOrderId,
      articles: lines.map((l) => ({ artNr: l.reference, dlNr: l.dlNr, quantity: l.quantity })),
    })
    const refused = (result.articles ?? []).filter((a) => a.response?.connectorResponse?.orderStatus === 'ERROR')
    if (refused.length) throw new Error(`Supplier refused ${refused.length} line(s): ${refused.map((a) => a.artNr).join(', ')}`)
    // The order answer carries no delivery date: ask availability first and keep its date.
    return { supplierOrderId: result.orderNumber ?? webOrderId, expectedAtStore: '' }
  },
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
