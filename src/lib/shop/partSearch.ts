// ---------------------------------------------------------------------------
//  "Plaquettes de frein avant" → the part types of a vehicle the customer means.
//
//  The search always starts from the vehicle: the catalogue tells which part
//  types exist for it, and the customer's words are matched against their
//  names. There is no search by reference, on purpose: the site does not give
//  references away (see articleToken.server.ts).
//
//  Customers do not speak like the TecDoc catalogue ("phare" is a "projecteur
//  principal", the "courroie de distribution" a "courroie crantée", the
//  "filtre à pollen" the "filtre, air de l'habitacle"), so the matching ignores
//  accents, plurals and small words, knows a few everyday synonyms, and maps
//  the most common requests straight to their part type.
// ---------------------------------------------------------------------------

import { GENART } from './partTypes'

export interface PartType {
  id: number
  name: string
}

export interface PartSearchResult {
  /** The one part type the words name without doubt: the page can go straight to it. */
  exact: PartType | null
  /** Part types that match, best first (includes `exact`). */
  matches: PartType[]
  /** No part type has all the words: `matches` are only the nearest ones. */
  approximate: boolean
}

const MAX_RESULTS = 24

const plain = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

/** Small words that carry no meaning in a part name. */
const SMALL = new Set(['de', 'du', 'des', 'd', 'la', 'le', 'les', 'l', 'a', 'au', 'aux', 'en', 'et', 'ou', 'pour', 'un', 'une', 'mon', 'ma', 'mes', 'avec', 'sur', 'je', 'cherche', 'jeu', 'paire'])

/** Where the part goes on the car. Most part type names do not say it: the list page has a filter for it. */
const POSITION = new Set(['avant', 'arriere', 'av', 'ar', 'gauche', 'droit', 'droite', 'cote', 'conducteur', 'passager', 'superieur', 'inferieur'])

/** Singular form, roughly: enough to put "plaquettes" and "plaquette" together. */
const stem = (w: string) => (w.length > 3 && /[sx]$/.test(w) ? w.slice(0, -1) : w)

const words = (s: string) =>
  plain(s)
    .split(' ')
    .filter((w) => w && !SMALL.has(w))
    .map(stem)

/** Everyday word → the words the catalogue uses for it (the word itself always counts too). */
const SYNONYMS: Record<string, string[]> = {
  phare: ['projecteur'],
  optique: ['projecteur'],
  pollen: ['habitacle'],
  gasoil: ['carburant'],
  gazole: ['carburant'],
  gasoile: ['carburant'],
  diesel: ['carburant'],
  essence: ['carburant'],
  pot: ['silencieux'],
  cardan: ['transmission'],
  biellette: ['stabilisateur', 'entretoise'],
  stabilisatrice: ['stabilisateur'],
  triangle: ['bras'],
  cremaillere: ['cremailliere', 'mecanisme'],
  abs: ['vitesse'],
  fap: ['particule', 'suie'],
  vidange: ['carter'],
  embrayage: ['debrayage'],
  galet: ['poulie'],
  tendeur: ['tension'],
  distribution: ['crantee'],
  accessoire: ['nervure', 'trapezoidale'],
  main: ['stationnement'],
  silentbloc: ['silent', 'suspension'],
  pmh: ['vilebrequin'],
}

/** What customers ask for every day, straight to the part type (TecDoc numbers are the same for every vehicle). */
const DIRECT: Record<string, number> = {
  'plaquette frein': GENART.brakePads,
  plaquette: GENART.brakePads,
  'disque frein': GENART.brakeDiscs,
  disque: GENART.brakeDiscs,
  'filtre huile': GENART.oilFilter,
  'filtre air': GENART.airFilter,
  'filtre habitacle': GENART.cabinFilter,
  'filtre habitacle pollen': GENART.cabinFilter,
  'filtre pollen': GENART.cabinFilter,
  'balai essuie glace': GENART.wiperBlades,
  'essuie glace': GENART.wiperBlades,
  batterie: GENART.battery,
  amortisseur: GENART.shockAbsorbers,
  'ampoule phare': GENART.headlightBulb,
}

const matchesWord = (queryWord: string, nameWords: string[]) => {
  const candidates = [queryWord, ...(SYNONYMS[queryWord] ?? []).map(stem)]
  // A word also matches the start of a longer one: "amort" finds "amortisseur".
  return candidates.some((c) => nameWords.some((n) => n === c || (c.length >= 3 && n.startsWith(c))))
}

/** The part types of `available` (the ones that exist for the vehicle) that the customer's words point to. */
export function findPartTypes(query: string, available: PartType[]): PartSearchResult {
  const all = words(query)
  // Position words are rarely in the part type names: without them "plaquettes avant" still finds the pads.
  const meaningful = all.filter((w) => !POSITION.has(w))
  const wanted = meaningful.length ? meaningful : all
  if (!wanted.length) return { exact: null, matches: [], approximate: false }

  const named = available.map((type) => ({ type, nameWords: words(type.name) }))
  const key = wanted.join(' ')
  const joined = wanted.join('')

  // Sure answers: a part type that has the whole phrase as its name ("Feu arrière"), or an everyday request.
  const whole = named.filter((n) => n.nameWords.join(' ') === all.join(' '))
  const direct = DIRECT[key]
  const sure = whole.length === 1 ? whole[0].type : direct ? available.find((t) => t.id === direct) : undefined

  const scored = named
    .map(({ type, nameWords }) => {
      const hits = wanted.filter((w) => matchesWord(w, nameWords)).length
      // "silentbloc" for "Silent bloc", "maitre cylindre" for "Maître-cylindre".
      const glued = joined.length >= 5 && nameWords.join('').includes(joined)
      const first = nameWords.findIndex((n) => matchesWord(wanted[0], [n]))
      // the name begins with the words searched, in their order: "Kit de freins, frein à disques" for "kit de freins"
      const leads = wanted.every((w, i) => nameWords[i] !== undefined && matchesWord(w, [nameWords[i]]))
      return { type, nameWords, hits: glued ? wanted.length : hits, first: first < 0 ? 99 : first, leads }
    })
    .filter((s) => s.hits > 0)

  const full = scored.filter((s) => s.hits === wanted.length)
  // All the words when something has them all. Otherwise the nearest: at least half of the words, the
  // first one among them (in French the name of the part comes first: "pot", "radiateur", "pompe").
  const pool = full.length ? full : scored.filter((s) => s.hits * 2 >= wanted.length && s.first < 99)
  pool.sort(
    (a, b) =>
      Number(b.type === sure) - Number(a.type === sure) ||
      b.hits - a.hits ||
      Number(b.leads) - Number(a.leads) ||
      // the searched word early in the name ("Disque de frein" before "Jeu de vis, disque de frein")
      a.first - b.first ||
      a.nameWords.length - b.nameWords.length ||
      a.type.name.localeCompare(b.type.name, 'fr'),
  )

  const sameName = full.filter((s) => s.nameWords.join(' ') === key)
  const exact = sure ?? (sameName.length === 1 ? sameName[0].type : full.length === 1 ? full[0].type : null)
  const matches = pool.map((s) => s.type)
  if (sure && !matches.includes(sure)) matches.unshift(sure)
  return { exact, matches: matches.slice(0, MAX_RESULTS), approximate: !exact && !full.length }
}
