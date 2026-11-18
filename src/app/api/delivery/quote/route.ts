import { NextResponse } from 'next/server'
import { quoteCourier } from '@/lib/integrations/uberDirect.server'
import { quoteParcel } from '@/lib/integrations/boxtal.server'

// POST { mode: 'coursier' | 'colis', street, postalCode, city, cartTotalTTC, weightKg, option }
// → { quote }   (source: 'uber-direct' | 'boxtal' | 'estimate')
export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const str = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim() : '')
  const num = (k: string) => (typeof body[k] === 'number' && Number.isFinite(body[k]) ? (body[k] as number) : 0)

  const postalCode = str('postalCode')
  if (!/^\d{5}$/.test(postalCode)) {
    return NextResponse.json({ error: 'Code postal invalide' }, { status: 400 })
  }

  if (body.mode === 'coursier') {
    const quote = await quoteCourier({ street: str('street'), postalCode, city: str('city') })
    return NextResponse.json({ quote })
  }

  if (body.mode === 'colis') {
    const option = body.option === 'domicile' ? 'domicile' : 'relais'
    const quote = await quoteParcel({
      postalCode,
      weightKg: Math.max(0.1, num('weightKg')),
      cartTotalTTC: Math.max(0, num('cartTotalTTC')),
      option,
    })
    return NextResponse.json({ quote })
  }

  return NextResponse.json({ error: 'Mode de livraison inconnu' }, { status: 400 })
}
