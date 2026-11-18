import { NextResponse } from 'next/server'
import { decodeCartToken } from '@/lib/loyalty/cartRecovery'
import { priceCartItems } from '@/lib/shop/cart.server'

// GET ?panier=<token from the WhatsApp reminder link> → { lines }
// Lines are re-priced from the catalogue: today's price, not the old one.
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('panier') ?? ''
  const items = token.length <= 4000 ? decodeCartToken(token) : null
  if (!items) return NextResponse.json({ error: 'Lien de panier invalide' }, { status: 400 })
  return NextResponse.json({ lines: priceCartItems(items) })
}
