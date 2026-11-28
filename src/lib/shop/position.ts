// ---------------------------------------------------------------------------
//  Where on the car a part goes, as one short label: "Avant", "Arrière",
//  "Avant gauche", "Avant côté conducteur"…
//
//  Two sources, read the same way:
//   - TecDoc's fitting side, free French text ("Essieu avant gauche",
//     "avant / du côté conducteur", "gauche / droite");
//   - the maker's catalogue (YQ), English names of the part, its unit and its
//     category ("PAD-SET", "735487227 - FRONT CALIPER LH", "FRONT WHEEL BRAKES").
//  A text that names both ends (left AND right, front AND rear) says nothing
//  about that end: the part fits both.
// ---------------------------------------------------------------------------

export type Axle = 'Avant' | 'Arrière'
export type Side = 'gauche' | 'droit' | 'côté conducteur' | 'côté passager'

export interface Position {
  axle?: Axle
  side?: Side
}

const AXLES: [Axle, RegExp][] = [
  ['Avant', /\b(avant|front)\b/i],
  ['Arrière', /\b(arri[eè]re|rear)\b/i],
]
const SIDES: [Side, RegExp][] = [
  ['gauche', /\b(gauche|left|LH)\b/i],
  ['droit', /\b(droite?|right|RH)\b/i],
  ['côté conducteur', /\b(conducteur|driver)\b/i],
  ['côté passager', /\b(passager|passenger)\b/i],
]

/** The one value a text names, or nothing when it names none or several. */
function only<T>(text: string, table: [T, RegExp][]): T | undefined {
  const found = table.filter(([, re]) => re.test(text)).map(([v]) => v)
  return found.length === 1 ? found[0] : undefined
}

export function parsePosition(text: string | undefined): Position {
  if (!text) return {}
  return { axle: only(text, AXLES), side: only(text, SIDES) }
}

/** One position for several texts: a value they all agree on (the texts that say nothing do not count). */
export function agreed(positions: Position[]): Position {
  const pick = <K extends keyof Position>(key: K) => {
    const values = [...new Set(positions.map((p) => p[key]).filter(Boolean))]
    return values.length === 1 ? (values[0] as Position[K]) : undefined
  }
  return { axle: pick('axle'), side: pick('side') }
}

/**
 * Position from the maker's catalogue for one part, its most precise text
 * first (part name, then unit, then category): the first text that names an
 * axle gives the axle, the first that names a side gives the side.
 */
export function positionFromLevels(levels: (string | undefined)[]): Position {
  const parsed = levels.map(parsePosition)
  return { axle: parsed.find((p) => p.axle)?.axle, side: parsed.find((p) => p.side)?.side }
}

/** The maker's catalogue first (it knows the exact car), TecDoc for what it does not say. */
export const mergePosition = (maker: Position, tecdoc: Position): Position => ({
  axle: maker.axle ?? tecdoc.axle,
  side: maker.side ?? tecdoc.side,
})

export function positionLabel(p: Position): string {
  const label = [p.axle, p.side].filter(Boolean).join(' ')
  return label ? label[0].toUpperCase() + label.slice(1) : ''
}

const AXLE_ORDER: (Axle | undefined)[] = ['Avant', 'Arrière', undefined]
const SIDE_ORDER: (Side | undefined)[] = ['gauche', 'droit', 'côté conducteur', 'côté passager', undefined]

/** Front before rear, left before right, "no position" last. */
export const comparePositions = (a: Position, b: Position) =>
  AXLE_ORDER.indexOf(a.axle) - AXLE_ORDER.indexOf(b.axle) || SIDE_ORDER.indexOf(a.side) - SIDE_ORDER.indexOf(b.side)
