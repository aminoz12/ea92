import { NextResponse } from 'next/server'
import { areOffersLive, getArticleOffers, type ArticleRef } from '@/lib/shop/offers.server'

/** One page of the catalogue at most: each call asks every supplier of the account. */
const MAX_ARTICLES = 30

// The suppliers get about 6 s to answer: leave the function room for that on Vercel.
export const maxDuration = 15

function parseRefs(value: unknown): ArticleRef[] {
  if (!Array.isArray(value)) return []
  const refs: ArticleRef[] = []
  for (const v of value.slice(0, MAX_ARTICLES)) {
    if (!v || typeof v !== 'object') continue
    const { artNr, dlNr } = v as { artNr?: unknown; dlNr?: unknown }
    if (typeof artNr !== 'string' || !artNr.trim() || artNr.length > 60) continue
    if (typeof dlNr !== 'number' || !Number.isInteger(dlNr) || dlNr < 1 || dlNr > 999_999) continue
    refs.push({ artNr: artNr.trim(), dlNr })
  }
  return refs
}

// POST { articles: [{ artNr, dlNr }] } → { live, offers }
// `offers` only lists the articles that can be sold online right now, each
// with its public price incl. VAT and its lead time. Never a purchase price.
export async function POST(req: Request) {
  let refs: ArticleRef[]
  try {
    refs = parseRefs(((await req.json()) as { articles?: unknown }).articles)
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }
  if (!refs.length) return NextResponse.json({ error: 'Aucun article' }, { status: 400 })
  if (!areOffersLive()) return NextResponse.json({ live: false, offers: [] })

  try {
    const offers = (await getArticleOffers(refs)).filter((o) => o !== null)
    return NextResponse.json({ live: true, offers }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    // The supplier platform is down: the page falls back to "sur demande".
    console.error('[api/catalog/offers]', err)
    return NextResponse.json({ live: true, offers: [], error: 'Prix momentanément indisponibles' }, { status: 502 })
  }
}
