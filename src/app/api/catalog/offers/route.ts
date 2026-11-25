import { NextResponse } from 'next/server'
import { areOffersLive, getArticleOffers } from '@/lib/shop/offers.server'

/** One page of the catalogue at most: each call asks every supplier of the account. */
const MAX_ARTICLES = 30

// The suppliers get about 6 s to answer: leave the function room for that on Vercel.
export const maxDuration = 15

// POST { articles: [token, …] } → { live, offers }
// The browser only knows articles by their opaque token (never a reference).
// `offers` lists the ones that can be sold online right now: token, public
// price incl. VAT, lead time. Never a reference, never a purchase price.
export async function POST(req: Request) {
  let tokens: string[]
  try {
    const list = ((await req.json()) as { articles?: unknown }).articles
    tokens = Array.isArray(list) ? list.slice(0, MAX_ARTICLES).filter((t): t is string => typeof t === 'string' && t.length >= 40 && t.length <= 200) : []
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }
  if (!tokens.length) return NextResponse.json({ error: 'Aucun article' }, { status: 400 })
  if (!areOffersLive()) return NextResponse.json({ live: false, offers: [] })

  try {
    return NextResponse.json({ live: true, offers: await getArticleOffers(tokens) }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    // The supplier platform is down: the page falls back to "sur demande".
    console.error('[api/catalog/offers]', err)
    return NextResponse.json({ live: true, offers: [], error: 'Prix momentanément indisponibles' }, { status: 502 })
  }
}
