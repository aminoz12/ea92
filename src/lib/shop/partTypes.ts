// Part types of the real catalogue the site links to directly.
//
// `genart` is the TecDoc generic-article number. It is the same for every
// vehicle (checked on a city car, a saloon and a van on 25 Nov 2026), so a link
// only needs the customer's vehicle type in front: /pieces/<ktype>/<genart>.
// A vehicle that has no such part simply gets an empty list page.

export const GENART = {
  brakePads: 402,
  brakeDiscs: 82,
  oilFilter: 7,
  airFilter: 8,
  cabinFilter: 424,
  wiperBlades: 298,
  battery: 1,
  shockAbsorbers: 854,
  /** Headlight bulb (H1, H4, H7…); the other bulbs have their own numbers. */
  headlightBulb: 107,
} as const

/** What customers ask for most at the counter, in the order shown on the home page. */
export const POPULAR_PART_TYPES: { genart: number; label: string }[] = [
  { genart: GENART.brakePads, label: 'Plaquettes de frein' },
  { genart: GENART.brakeDiscs, label: 'Disques de frein' },
  { genart: GENART.oilFilter, label: 'Filtre à huile' },
  { genart: GENART.airFilter, label: 'Filtre à air' },
  { genart: GENART.cabinFilter, label: 'Filtre d’habitacle' },
  { genart: GENART.wiperBlades, label: 'Balais d’essuie-glace' },
  { genart: GENART.battery, label: 'Batterie' },
  { genart: GENART.shockAbsorbers, label: 'Amortisseurs' },
]
