import type { PublicOffer, PublicProduct } from './types'

// Lower-case + strip accents: "etrier" matches "Étrier".
export const deburr = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

const compact = (s: string) => deburr(s).replace(/[^a-z0-9]/g, '')

/** Free-text match on name, department, brands, references and OE numbers. */
export function matchesQuery(p: PublicProduct, query: string) {
  const q = deburr(query.trim())
  if (!q) return true
  const haystack = deburr(
    [p.name, p.categoryName, p.description, ...p.offers.map((o) => `${o.brand} ${o.reference}`)].join(' '),
  )
  const words = q.split(/\s+/).filter(Boolean)
  if (words.every((w) => haystack.includes(w))) return true
  // References are often typed without spaces/dots: "0986494262", "09A72711".
  const cq = compact(query)
  return cq.length >= 4 && [...p.oe, ...p.offers.map((o) => o.reference)].some((r) => compact(r).includes(cq))
}

/** Put the first offer matching `prefer` in front (keeps the ranking otherwise). */
export function preferOffer(p: PublicProduct, prefer: (o: PublicOffer) => boolean): PublicProduct {
  const idx = p.offers.findIndex(prefer)
  if (idx <= 0) return p
  const offers = [p.offers[idx], ...p.offers.filter((_, i) => i !== idx)]
  return { ...p, offers }
}
