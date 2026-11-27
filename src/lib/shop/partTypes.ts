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

/**
 * TecDoc part type → the groups of YQ's universal tree that hold the same
 * parts, in order of preference (a vehicle has one or the other). Codes read
 * in YQ's tree on 27 Nov 2026; they are the same for every make. A part type
 * that is not listed here is shown as TecDoc gives it.
 */
export const YQ_GROUPS: Record<number, string[]> = {
  [GENART.brakePads]: ['10130'], // Brake Pad Set
  [GENART.brakeDiscs]: ['10132'], // Brake Disc
  [GENART.oilFilter]: ['10359', '10570'], // Oil Filter (Filters / Lubrication)
  [GENART.airFilter]: ['10360', '10484'], // Air Filter / Air Filter Housing
  [GENART.cabinFilter]: ['10363', '10446'], // Air Filter, passenger compartment
  [GENART.wiperBlades]: ['10233'], // Wiper Blade
  [GENART.battery]: ['10142'], // Battery
  [GENART.shockAbsorbers]: ['10221'], // Shock Absorber
  [GENART.headlightBulb]: ['10527', '11758', '11567'], // Bulb, headlight
  479: ['10151'], // Kit d'embrayage → Repair Kit, clutch complete
  686: ['10251'], // Bougie d'allumage → Spark Plug
  307: ['10553', '10505'], // Kit de courroie crantée → Timing Belt Set
}

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
