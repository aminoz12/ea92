// ---------------------------------------------------------------------------
//  BUSINESS RULES — single place for every number the e-shop, the PRO side
//  and the loyalty programme rely on.
//
//  ⚠️  Every value below is a PLACEHOLDER chosen for the mockup. Validate each
//  one (prices, delays, rates, limits) before the shop goes live: they are
//  shown to customers as commitments.
// ---------------------------------------------------------------------------

export const VAT_RATE = 0.2

/* ------------------------------------------------------------------ */
/*  Public price of a catalogue part (real articles, supplier prices)  */
/* ------------------------------------------------------------------ */
// What the supplier platform (EasyOrder) really answers, excl. VAT: what the
// part costs us, and for some suppliers the manufacturer's public price. It
// gives NO selling price for our account, so the shop's price comes from the
// rule below.
export const CATALOG_PRICING = {
  // The retail rule, as a mark-up on what the part costs us: 0.55 means
  // purchase price excl. VAT × 1.55 = selling price excl. VAT, VAT added on
  // top. The result never goes above the manufacturer's public price when one
  // is known. null = no rule, see fallbackToPublicPrice.
  // Coefficient 1.55 given by the owner on 26 Nov 2026.
  markupOnPurchase: 0.55 as number | null,
  // No mark-up decided (or no purchase price in the answer): show the
  // manufacturer's public price when a supplier gives it.
  // false = such parts stay "sur demande".
  fallbackToPublicPrice: true,
  // A part is shown with a price only if that price is at least this much
  // above what it costs us (0 = simply never below cost).
  minMarkupOnPurchase: 0,
} as const

/* ------------------------------------------------------------------ */
/*  Plate lookup — protecting the paid credits                         */
/* ------------------------------------------------------------------ */
// Each lookup costs one credit and the account is allowed 300 a day. These
// limits apply to /api/vehicle/identify; past them the visitor is told to pick
// the vehicle by make and model, which costs nothing.
// See lib/rateLimit.server.ts for what an in-memory limit can and cannot stop.
export const PLATE_LOOKUP = {
  // One visitor = one network address. Kept loose on purpose: a mobile
  // operator can put many customers behind the same address.
  perVisitor: [
    { limit: 6, windowMinutes: 10 },
    { limit: 40, windowMinutes: 24 * 60 },
  ],
  // Everybody together: stays under the account's 300 a day.
  everyone: [{ limit: 250, windowMinutes: 24 * 60 }],
} as const

/* ------------------------------------------------------------------ */
/*  Brand ranking ("Meilleur choix")                                  */
/* ------------------------------------------------------------------ */
// Among equivalent offers (same part, several brands), the shop pushes the
// brand that earns the most — RFA included — as long as its public price stays
// in the "cheapest band": at most `relativeTolerance` above the cheapest offer,
// or `absoluteToleranceTTC` euros above it, whichever is larger.
// Set both to 0 to only ever push the strictly cheapest offer.
export const RANKING = {
  relativeTolerance: 0.05, // +5 % above the cheapest offer
  absoluteToleranceTTC: 1.5, // or +1,50 € TTC, whichever is larger
} as const

/* ------------------------------------------------------------------ */
/*  Fulfilment                                                        */
/* ------------------------------------------------------------------ */
export const FULFILMENT = {
  // Store pickup
  pickupReadyMinutes: 30, // in-stock parts ready at the counter
  supplierLeadHours: 4, // "fournisseur_4h" parts reach the store in ~4 h
  // Click & collect lockers in front of the store (not installed yet)
  lockersAvailable: false,
  // Fitting at a partner garage. The garages in lib/shop/garages.ts are
  // placeholders: keep false until real partners are signed. The mode is then
  // shown as "bientôt disponible" in the cart and cannot be paid for.
  partnerGaragesAvailable: false,

  // Courier (Uber Direct) — fallback estimate used until the API is wired.
  courier: {
    baseFeeTTC: 6.9,
    zones: [
      // Postal-code prefixes, extra fee and indicative ETA in minutes.
      { label: 'Nanterre & communes voisines', prefixes: ['92000', '92500', '92700', '92400', '92800', '92250', '92390'], extraTTC: 0, etaMinutes: 45 },
      { label: 'Hauts-de-Seine (92)', prefixes: ['92'], extraTTC: 3, etaMinutes: 60 },
      { label: 'Paris & petite couronne', prefixes: ['75', '93', '94'], extraTTC: 6, etaMinutes: 75 },
      { label: 'Yvelines / Val-d’Oise', prefixes: ['78', '95'], extraTTC: 9, etaMinutes: 90 },
    ],
  },

  // Parcel shipping (Boxtal). Boxtal's API v3 gives no price (its guide says a
  // quote is "not currently possible"), so the delivery price charged to the
  // customer is this grid. ⚠️ Figures to be validated by the shop.
  parcel: {
    relayFromTTC: 4.9,
    homeFromTTC: 7.9,
    perExtraKgTTC: 0.8, // above 2 kg
    freeAboveTTC: 89,
    delay: '24 à 72 h ouvrées',
    // The Boxtal offer used for relay delivery: it decides which relay network
    // the customer chooses from. MONR-CpourToi = Mondial Relay "Points Relais".
    // Others (Boxtal guide, "transport offer codes"): CHRP-ChronoRelais,
    // POFR-ColissimoPickupStation, SOGP-RelaisColis, UPSE-StandardAP…
    // ⚠️ To be validated by the shop: it must be an offer of its Boxtal account.
    relayOfferCode: 'MONR-CpourToi',
    relayPointsShown: 8,
  },
} as const

/* ------------------------------------------------------------------ */
/*  Fitting at partner garages — fixed price per job (TTC)            */
/* ------------------------------------------------------------------ */
export type FittingJobId =
  | 'plaquettes-av'
  | 'plaquettes-ar'
  | 'disques-plaquettes-av'
  | 'vidange'
  | 'batterie'
  | 'amortisseurs-av'
  | 'distribution'
  | 'embrayage'
  | 'essuie-glaces'
  | 'ampoule'
  | 'etrier'
  | 'demarreur'
  | 'alternateur'

export interface FittingJob {
  id: FittingJobId
  label: string
  // null = quoted by the garage (job too dependent on the engine)
  priceTTC: number | null
  durationLabel: string
}

export const FITTING_JOBS: FittingJob[] = [
  { id: 'plaquettes-av', label: 'Plaquettes de frein avant', priceTTC: 40, durationLabel: '45 min' },
  { id: 'plaquettes-ar', label: 'Plaquettes de frein arrière', priceTTC: 45, durationLabel: '1 h' },
  { id: 'disques-plaquettes-av', label: 'Disques + plaquettes avant', priceTTC: 79, durationLabel: '1 h 15' },
  { id: 'vidange', label: 'Vidange + filtre à huile', priceTTC: 35, durationLabel: '30 min' },
  { id: 'batterie', label: 'Remplacement batterie', priceTTC: 15, durationLabel: '20 min' },
  { id: 'amortisseurs-av', label: 'Amortisseurs avant (la paire)', priceTTC: 119, durationLabel: '2 h' },
  { id: 'embrayage', label: 'Kit embrayage', priceTTC: null, durationLabel: '4 à 6 h' },
  { id: 'distribution', label: 'Kit de distribution', priceTTC: null, durationLabel: '3 à 5 h' },
  { id: 'essuie-glaces', label: 'Balais d’essuie-glace', priceTTC: 5, durationLabel: '5 min' },
  { id: 'ampoule', label: 'Ampoule de phare', priceTTC: 10, durationLabel: '10 à 30 min' },
  { id: 'etrier', label: 'Étrier de frein (+ purge)', priceTTC: 55, durationLabel: '1 h' },
  { id: 'demarreur', label: 'Démarreur', priceTTC: null, durationLabel: '1 à 3 h' },
  { id: 'alternateur', label: 'Alternateur', priceTTC: null, durationLabel: '1 à 3 h' },
]

/* ------------------------------------------------------------------ */
/*  Old-part deposit ("consigne") on exchange parts (échange standard) */
/* ------------------------------------------------------------------ */
// Starters, alternators, calipers… are sold "échange standard": the customer
// pays a refundable deposit on top of the price, refunded when the old part
// comes back. The deposit amount is set per product in the catalogue.
export const DEPOSIT = {
  returnDays: 30, // the old part must come back within this delay
  refundDays: 5, // refund once the old part has been checked
  conditions: [
    'Même type de pièce que la pièce achetée, complète',
    'Non démontée, carter et fixations intacts',
    'Vidangée, sans fuite, idéalement dans le carton de la pièce neuve',
  ],
} as const

/* ------------------------------------------------------------------ */
/*  Abandoned-cart WhatsApp reminder (only with explicit consent)      */
/* ------------------------------------------------------------------ */
export const CART_RECOVERY = {
  // Sent after the cart was last updated, never between quietFromHour and
  // quietUntilHour, never on Sunday. Two messages maximum, then forgotten.
  delaysHours: [1, 24],
  quietFromHour: 20,
  quietUntilHour: 9,
  retentionDays: 7, // phone + cart deleted after this, or on purchase / STOP
} as const

/* ------------------------------------------------------------------ */
/*  Promotions of the week (home "Promos de la semaine" + countdown)  */
/* ------------------------------------------------------------------ */
export const PROMOS = {
  // Real end of the current promotions, ISO date-time (e.g. '2026-11-23T23:59:59+01:00').
  // null = end of the current week (Sunday 23:59, Paris). The countdown must
  // match the real end of the offers: a fake countdown is a misleading practice.
  endsAt: null as string | null,
  // Welcome offer shown in the dashed "coupon" strip (club fidélité).
  welcomeStrip: true,
}

/* ------------------------------------------------------------------ */
/*  Google Merchant Center — products + local (in-store) inventory    */
/* ------------------------------------------------------------------ */
export const GOOGLE_MERCHANT = {
  // Store code exactly as set in Google Business Profile (case-sensitive).
  storeCode: 'EA92-NANTERRE',
  // Keep false while the catalogue is demo data: the feeds answer 404, and
  // can only be previewed with ?apercu=1. Switch on once real prices are live.
  enabled: false,
} as const

export const getFittingJob = (id?: FittingJobId) =>
  id ? FITTING_JOBS.find((j) => j.id === id) : undefined

/* ------------------------------------------------------------------ */
/*  PRO accounts                                                      */
/* ------------------------------------------------------------------ */
export const PRO = {
  // Mark-up applied on the net purchase price (HT). NB: a 15 % mark-up is a
  // 13 % margin on the selling price — see docs/specs/encours-et-blocage.md.
  markupDefault: 0.13,
  markupMin: 0.12,
  markupMax: 0.15,
  creditLimitDefaultTTC: 1500,
  alertThreshold: 0.8, // warn the garage at 80 % of the limit
  debitWeekday: 1, // weekly SEPA direct debit on Monday (0 = Sunday)
} as const

/* ------------------------------------------------------------------ */
/*  Loyalty                                                           */
/* ------------------------------------------------------------------ */
export const LOYALTY = {
  particulier: {
    pointsPerEuro: 1,
    voucherEveryPoints: 300,
    voucherValueTTC: 10,
    welcomePoints: 50,
    reviewPoints: 30, // Google review left after the D+2–4 WhatsApp message
    tiers: [
      { id: 'essentiel', name: 'Essentiel', fromYearlyTTC: 0, perks: ['1 point par euro dépensé', 'Carnet d’entretien digital', 'Rappels WhatsApp pièces d’usure'] },
      { id: 'plus', name: 'Plus', fromYearlyTTC: 400, perks: ['Points doublés le premier samedi du mois', 'Une livraison coursier offerte par trimestre'] },
      { id: 'premium', name: 'Premium', fromYearlyTTC: 1200, perks: ['Montage garage partenaire −10 %', 'Accès aux ventes privées 24 h avant tout le monde'] },
    ],
  },
  pro: {
    // Customer year-end rebate (the garage's own "RFA" on its purchases).
    rebateTiers: [
      { fromYearlyHT: 5000, rate: 0.01 },
      { fromYearlyHT: 15000, rate: 0.02 },
      { fromYearlyHT: 30000, rate: 0.03 },
    ],
    perks: [
      'Encours relevé après 3 mois sans incident de paiement',
      'Préparation prioritaire et livraison atelier groupée',
      'Interlocuteur dédié sur WhatsApp',
    ],
  },
} as const
