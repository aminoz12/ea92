import 'server-only'
import { randomBytes } from 'node:crypto'

// ---------------------------------------------------------------------------
//  From a cart sent by the browser to a payment page.
//
//  Nothing that decides an amount is taken from the browser: every part is
//  re-priced live at the suppliers, the delivery fee is recomputed, and if the
//  total differs from what the customer was shown, no payment is created — the
//  cart is sent back up to date so the customer agrees to the new total first.
//
//  There is no order database yet: Stripe keeps the order (lines, amounts,
//  and, in the session's metadata, who ordered and how to hand it over). The
//  shop reads it in the Stripe dashboard and in the notification e-mail.
// ---------------------------------------------------------------------------

import { FULFILMENT } from './config'
import { readArticleToken } from './articleToken.server'
import { articleWeightKg, isParcelForbidden, parcelWeightKg } from './weight'
import { areOffersLive, priceArticles } from './offers.server'
import type { QuoteEstimate } from './fulfilment'
import type { CartLine, FulfilmentMode } from './types'
import { quoteCourier } from '../integrations/uberDirect.server'
import { findRelayPoint, isBoxtalConfigured, quoteParcel, type RelayPoint } from '../integrations/boxtal.server'
import {
  createCheckoutSession,
  getCheckoutSession,
  isCheckoutSessionId,
  isPaid,
  isStripeConfigured,
  type CheckoutLine,
} from '../integrations/stripe.server'
import { normalizePhone } from '../loyalty/cartRecovery'

/** A request we refuse; `message` is shown to the customer. */
export class CheckoutError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message)
  }
}

const MAX_LINES = 30
const MODES: FulfilmentMode[] = ['retrait', 'coursier', 'colis', 'montage']

interface RequestedLine {
  /** `art-<token>`: all the browser knows about the article. */
  slug: string
  /** Read from the token, here on the server. Never sent back to the browser, never shown on the payment page. */
  artNr: string
  dlNr: number
  qty: number
  /** Shipping weight of one article and its part type, read from the token (never from the browser). */
  weightKg: number
  parcelForbidden: boolean
  /** Shown on the payment page; never used to compute anything. */
  name: string
  brand: string
  image?: string
  href?: string
  /** What the customer saw: compared with the live price, never charged as is. */
  shownPriceTTC?: number
}

interface CheckoutRequest {
  lines: RequestedLine[]
  mode: FulfilmentMode
  pickup: 'comptoir' | 'casier'
  parcelOption: 'relais' | 'domicile'
  /** The relay point the customer chose (carrier code); checked again at Boxtal before paying. */
  relayCode: string
  address: { street: string; postalCode: string; city: string }
  contact: { name: string; phone: string }
  whatsappOptIn: boolean
  vehicle: string
  /** Total the customer was shown, incl. delivery and deposits. */
  shownTotalTTC?: number
}

export type CheckoutOutcome =
  | { status: 'ready'; url: string; orderRef: string }
  | {
      /** Prices, stock or delivery moved since the cart was displayed: nothing was created. */
      status: 'changed'
      message: string
      lines: CartLine[]
      removed: { slug: string; reference: string }[]
      quote?: QuoteEstimate & { source: string }
    }

const text = (value: unknown, max: number) =>
  typeof value === 'string'
    ? value
        .replace(/[\u0000-\u001f\u007f]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, max)
    : ''
const cents = (eur: number) => Math.round(eur * 100)
const round2 = (n: number) => Math.round(n * 100) / 100

/** Reads and checks what the browser sent. Throws CheckoutError with a message for the customer. */
export function parseCheckoutRequest(body: unknown): CheckoutRequest {
  if (!body || typeof body !== 'object') throw new CheckoutError('Requête invalide')
  const b = body as Record<string, unknown>

  if (!Array.isArray(b.items) || b.items.length === 0) throw new CheckoutError('Votre panier est vide.')
  if (b.items.length > MAX_LINES) throw new CheckoutError(`Un panier ne peut pas dépasser ${MAX_LINES} lignes.`)
  const lines: RequestedLine[] = b.items.map((raw) => {
    const it = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
    const slug = text(it.slug, 220)
    const qty = typeof it.qty === 'number' && Number.isInteger(it.qty) ? it.qty : 0
    // Only articles of the real catalogue can be paid for: they are the ones a
    // supplier prices. The browser names them by their opaque token; a token we
    // did not issue (or an old cart line) does not open.
    const article = slug.startsWith('art-') ? readArticleToken(slug.slice(4)) : null
    if (!article) {
      throw new CheckoutError('Un article de votre panier n’est plus vendu en ligne. Retirez-le pour continuer.')
    }
    if (qty < 1 || qty > 99) throw new CheckoutError('Quantité invalide dans le panier.')
    const image = text(it.image, 400)
    const href = text(it.href, 200)
    return {
      slug,
      artNr: article.artNr,
      dlNr: article.dlNr,
      qty,
      // Tokens made before the weights were sealed in them get the default weight.
      weightKg: articleWeightKg(article.weightKg, article.partType),
      parcelForbidden: isParcelForbidden(article.partType),
      name: text(it.name, 120) || 'Pièce',
      brand: text(it.brand, 60),
      image: image.startsWith('https://') ? image : undefined,
      href: href.startsWith('/pieces/') ? href : undefined,
      shownPriceTTC: typeof it.priceTTC === 'number' && Number.isFinite(it.priceTTC) ? it.priceTTC : undefined,
    }
  })

  const mode = MODES.find((m) => m === b.mode)
  if (!mode) throw new CheckoutError('Choisissez un mode de réception.')
  if (mode === 'montage' && !FULFILMENT.partnerGaragesAvailable) {
    throw new CheckoutError('Le montage en garage partenaire n’est pas encore disponible en ligne. Choisissez un autre mode de réception.')
  }

  const a = (b.address && typeof b.address === 'object' ? b.address : {}) as Record<string, unknown>
  const address = { street: text(a.street, 120), postalCode: text(a.postalCode, 5), city: text(a.city, 80) }
  if (mode === 'coursier' || mode === 'colis') {
    if (address.street.length <= 3) throw new CheckoutError('Indiquez votre adresse de livraison.')
    if (!/^\d{5}$/.test(address.postalCode)) throw new CheckoutError('Indiquez un code postal à 5 chiffres.')
  }

  const c = (b.contact && typeof b.contact === 'object' ? b.contact : {}) as Record<string, unknown>
  const name = text(c.name, 80)
  const phone = normalizePhone(text(c.phone, 30))
  if (name.length <= 1) throw new CheckoutError('Indiquez votre nom.')
  if (!phone) throw new CheckoutError('Indiquez un numéro de mobile valide.')

  return {
    lines,
    mode,
    pickup: b.pickup === 'casier' && FULFILMENT.lockersAvailable ? 'casier' : 'comptoir',
    parcelOption: b.parcelOption === 'domicile' ? 'domicile' : 'relais',
    relayCode: text(b.relayCode, 40),
    address,
    contact: { name, phone },
    whatsappOptIn: b.whatsappOptIn === true,
    vehicle: text(b.vehicle, 120),
    shownTotalTTC: typeof b.totalTTC === 'number' && Number.isFinite(b.totalTTC) ? b.totalTTC : undefined,
  }
}

/** EA92-7K3Q9X2M: random, no look-alike characters, safe to read out on the phone. */
function newOrderRef() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  return 'EA92-' + [...randomBytes(8)].map((b) => alphabet[b % alphabet.length]).join('')
}

const MODE_LABEL: Record<FulfilmentMode, string> = {
  retrait: 'Retrait au magasin',
  coursier: 'Livraison par coursier',
  colis: 'Expédition colis',
  montage: 'Montage en garage partenaire',
}

/** Values of at most 500 characters, as Stripe's metadata requires; long lists are split over numbered keys. */
function chunked(key: string, parts: string[], out: Record<string, string>) {
  let n = 1
  let current = ''
  for (const part of parts) {
    if (current && current.length + part.length + 3 > 480) {
      out[`${key}_${n++}`] = current
      current = ''
    }
    current = current ? `${current} ; ${part}` : part
  }
  if (current) out[`${key}_${n}`] = current
}

/**
 * Re-prices the cart, and either creates the payment page or reports what
 * changed. `origin` is the address the customer is browsing the site at.
 */
export async function startCheckout(request: CheckoutRequest, origin: string): Promise<CheckoutOutcome> {
  if (!isStripeConfigured()) throw new CheckoutError('Le paiement en ligne n’est pas encore activé. Contactez-nous pour commander.', 503)
  if (!areOffersLive()) throw new CheckoutError('Les prix fournisseurs sont momentanément indisponibles. Réessayez dans quelques minutes.', 503)

  // 0. Relay delivery: the relay the customer chose is read again at Boxtal
  //    (name and address are never taken from the browser). Only when the shop
  //    has a Boxtal account connected; without one no relay is asked for.
  let relay: RelayPoint | null = null
  if (request.mode === 'colis' && request.parcelOption === 'relais' && isBoxtalConfigured()) {
    if (!request.relayCode) throw new CheckoutError('Choisissez votre point relais.')
    try {
      relay = await findRelayPoint(request.relayCode, request.address)
    } catch (err) {
      console.error('[checkout] relay lookup failed', err)
      throw new CheckoutError('Les points relais sont momentanément indisponibles. Réessayez dans quelques minutes, ou choisissez la livraison à domicile.', 503)
    }
    if (!relay) throw new CheckoutError('Ce point relais n’est plus proposé pour votre adresse. Choisissez-en un autre.')
  }

  // 1. Live price and availability of every line.
  const offers = await priceArticles(request.lines.map((l) => ({ artNr: l.artNr, dlNr: l.dlNr })))
  const kept: (RequestedLine & { priceTTC: number; depositTTC?: number })[] = []
  // What goes back to the browser names a line by its slug; `reference` is the (empty) one the cart holds.
  const removed: { slug: string; reference: string }[] = []
  let moved = false
  request.lines.forEach((line, i) => {
    const offer = offers[i]
    if (!offer) {
      removed.push({ slug: line.slug, reference: '' })
      return
    }
    if (line.shownPriceTTC === undefined || Math.abs(line.shownPriceTTC - offer.priceTTC) > 0.005) moved = true
    kept.push({ ...line, priceTTC: offer.priceTTC, depositTTC: offer.depositTTC })
  })

  const cartLines: CartLine[] = kept.map((l) => ({
    slug: l.slug,
    brand: l.brand,
    reference: '',
    name: l.name,
    image: l.image ?? '',
    href: l.href,
    priceTTC: l.priceTTC,
    depositTTC: l.depositTTC,
    qty: l.qty,
    weightKg: l.weightKg,
    parcelForbidden: l.parcelForbidden || undefined,
  }))
  const subtotalTTC = round2(kept.reduce((s, l) => s + l.priceTTC * l.qty, 0))
  const depositsTTC = round2(kept.reduce((s, l) => s + (l.depositTTC ?? 0) * l.qty, 0))

  // 2. Delivery, recomputed here from the weights sealed in the article tokens.
  if (request.mode === 'colis' && kept.some((l) => l.parcelForbidden)) {
    throw new CheckoutError('Votre panier contient une batterie : elle ne peut pas voyager en colis. Choisissez le retrait ou le coursier.')
  }
  if (request.mode === 'coursier' && kept.some((l) => l.weightKg > FULFILMENT.courier.maxItemKg)) {
    throw new CheckoutError(`Une pièce de votre panier dépasse ${FULFILMENT.courier.maxItemKg} kg : trop lourde pour un coursier. Choisissez le retrait ou l’expédition colis.`)
  }
  let quote: (QuoteEstimate & { source: string }) | undefined
  if (kept.length && request.mode === 'coursier') quote = await quoteCourier(request.address)
  if (kept.length && request.mode === 'colis') {
    quote = await quoteParcel({ postalCode: request.address.postalCode, weightKg: parcelWeightKg(kept), cartTotalTTC: subtotalTTC, option: request.parcelOption })
  }
  if (quote && !quote.available) throw new CheckoutError(quote.reason || 'Ce mode de livraison n’est pas disponible pour votre adresse.')
  const deliveryTTC = quote ? quote.feeTTC : 0
  const totalTTC = round2(subtotalTTC + depositsTTC + deliveryTTC)

  // 3. Anything the customer has not seen: stop here and show it.
  const totalMoved = request.shownTotalTTC === undefined || Math.abs(request.shownTotalTTC - totalTTC) > 0.005
  if (removed.length || moved || totalMoved) {
    const message = !kept.length
      ? 'Les pièces de votre panier ne sont plus disponibles en ligne pour le moment.'
      : removed.length
        ? `${removed.length > 1 ? `${removed.length} pièces ne sont` : 'Une pièce n’est'} plus disponible${removed.length > 1 ? 's' : ''} et ${removed.length > 1 ? 'ont été retirées' : 'a été retirée'} du panier. Vérifiez le nouveau total avant de payer.`
        : 'Les prix ont été mis à jour avec les tarifs du moment. Vérifiez le nouveau total avant de payer.'
    return { status: 'changed', message, lines: cartLines, removed, quote }
  }

  // 4. The payment page.
  const orderRef = newOrderRef()
  // The payment page and Stripe's receipt are read by the customer: part type
  // and brand only, no reference. The shop finds the references in the
  // session's metadata below, which the customer never sees.
  const lines: CheckoutLine[] = kept.map((l) => ({
    name: (l.brand ? `${l.name} — ${l.brand}` : l.name).slice(0, 250),
    image: l.image,
    unitAmount: cents(l.priceTTC),
    quantity: l.qty,
  }))
  if (depositsTTC > 0) {
    lines.push({ name: 'Consigne (remboursable)', description: 'Remboursée au retour de l’ancienne pièce', unitAmount: cents(depositsTTC), quantity: 1 })
  }
  if (deliveryTTC > 0) {
    const label = request.mode === 'coursier' ? 'Livraison par coursier' : `Expédition colis (${request.parcelOption === 'relais' ? 'point relais' : 'à domicile'})`
    lines.push({ name: label, unitAmount: cents(deliveryTTC), quantity: 1 })
  }

  const metadata: Record<string, string> = {
    order_ref: orderRef,
    mode: request.mode,
    reception:
      request.mode === 'retrait'
        ? request.pickup === 'casier' ? 'Retrait en casier' : 'Retrait au comptoir'
        : request.mode === 'colis'
          ? request.parcelOption === 'domicile'
            ? 'Colis à domicile'
            : relay
              ? `Colis en point relais : ${relay.name}, ${relay.city}`.slice(0, 500)
              : 'Colis en point relais'
          : MODE_LABEL[request.mode],
    customer_name: request.contact.name,
    customer_phone: request.contact.phone,
    whatsapp_optin: request.whatsappOptIn ? 'oui' : 'non',
    total_ttc: totalTTC.toFixed(2),
  }
  if (request.mode === 'coursier' || request.mode === 'colis') {
    metadata.address = `${request.address.street}, ${request.address.postalCode} ${request.address.city}`.slice(0, 500)
    metadata.delivery_ttc = deliveryTTC.toFixed(2)
    // What the shop weighs out for the label or the courier (parts + packaging, estimated when the catalogue has no weight).
    metadata.weight_kg = parcelWeightKg(kept).toFixed(1)
  }
  // What the shop needs to make the label: the carrier's code of the relay, then its name and address.
  if (relay) metadata.relay = `${relay.code} — ${relay.name}, ${relay.street}, ${relay.postalCode} ${relay.city}`.slice(0, 500)
  if (request.vehicle) metadata.vehicle = request.vehicle
  // What to order from the supplier: quantity × TecDoc brand code / reference @ unit price.
  // Metadata is only readable with the shop's Stripe account (dashboard, webhook, notification e-mail).
  chunked('items', kept.map((l) => `${l.qty} x ${l.dlNr}/${l.artNr} (${l.brand}) @ ${l.priceTTC.toFixed(2)}`), metadata)

  const session = await createCheckoutSession({
    orderRef,
    lines,
    successUrl: `${origin}/suivi-commande?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/panier?paiement=annule`,
    metadata,
    description: `Commande ${orderRef} — Espace Auto 92`,
  })
  if (!session.url) throw new CheckoutError('Le paiement n’a pas pu être préparé. Réessayez.', 502)
  return { status: 'ready', url: session.url, orderRef }
}

/* ------------------------------------------------------------------ */
/*  After the payment                                                  */
/* ------------------------------------------------------------------ */

export interface OrderConfirmation {
  orderRef: string
  mode: FulfilmentMode
  reception: string
  paid: boolean
  amountTTC: number
  lines: { label: string; qty: number; amountTTC: number }[]
  /** Paid with a test key: no money moved. */
  test: boolean
}

/** What a Checkout Session says about an order; null when the id is unknown or malformed. */
export async function getOrderConfirmation(sessionId: string): Promise<OrderConfirmation | null> {
  if (!isStripeConfigured() || !isCheckoutSessionId(sessionId)) return null
  let session
  try {
    session = await getCheckoutSession(sessionId)
  } catch (err) {
    console.error('[checkout] session lookup failed', err)
    return null
  }
  const mode = MODES.find((m) => m === session.metadata?.mode) ?? 'retrait'
  return {
    orderRef: session.client_reference_id ?? session.metadata?.order_ref ?? '',
    mode,
    reception: session.metadata?.reception ?? MODE_LABEL[mode],
    paid: isPaid(session),
    amountTTC: (session.amount_total ?? 0) / 100,
    lines: (session.line_items?.data ?? []).map((l) => ({ label: l.description ?? '', qty: l.quantity ?? 1, amountTTC: l.amount_total / 100 })),
    test: !session.livemode,
  }
}
