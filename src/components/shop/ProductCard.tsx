'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useShop } from '@/providers/ShopProvider'
import { formatEUR } from '@/lib/shop/format'
import type { PublicProduct } from '@/lib/shop/types'
import { StockBadge } from './StockBadge'
import { CompatBadge } from './CompatBadge'
import { Icon } from '../ui/Icon'

// One label per card. Colour is reserved for the discount (signal yellow);
// every other label is plain ink.
const TAG_LABEL = {
  'best-seller': 'Top vente',
  promo: 'Promo',
  hiver: 'Spécial hiver',
  appel: 'Petit prix',
} as const

// Shop card: framed image with one label, brand + reference, title, status
// lines, then price (crossed-out "before" price above) and the cart button.
export function ProductCard({ product }: { product: PublicProduct }) {
  const { addToCart } = useShop()
  const best = product.offers[0]
  const others = product.offers.length - 1
  const href = `/boutique/${product.slug}`
  const tag = product.tags[0]
  // Crossed-out price only when it is really above the price shown.
  const before = product.compareAtTTC && product.compareAtTTC > best.priceTTC ? product.compareAtTTC : null
  const discount = before ? Math.round((1 - best.priceTTC / before) * 100) : 0

  const add = () =>
    addToCart({
      slug: product.slug,
      brand: best.brand,
      reference: best.reference,
      name: product.name,
      image: product.image,
      priceTTC: best.priceTTC,
      fittingJob: product.fittingJob,
      wearPart: product.wearPart,
      weightKg: product.weightKg,
      parcelForbidden: product.parcelForbidden,
      depositTTC: product.depositTTC,
    })

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-3 transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(23,23,22,0.35)] sm:p-4">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-white" aria-label={product.name}>
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 240px, (min-width: 768px) 30vw, 45vw"
          unoptimized={product.image.endsWith('.svg')}
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
        {discount > 0 ? (
          <span className="absolute left-0 top-0 rounded-md bg-signal-500 px-2 py-1 font-display text-sm font-bold leading-none text-gray-900">
            −{discount} %
          </span>
        ) : (
          tag && (
            <span className="absolute left-0 top-0 rounded-md bg-gray-900 px-2 py-1 font-display text-xs font-semibold uppercase leading-none tracking-wide text-white">
              {TAG_LABEL[tag]}
            </span>
          )
        )}
      </Link>

      <div className="mt-3 flex flex-1 flex-col border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 text-xs">
          {best.brandLogo ? (
            <img src={best.brandLogo} alt={best.brand} className="h-3.5 w-auto max-w-[64px] object-contain" />
          ) : (
            <span className="font-display font-bold uppercase tracking-wide text-gray-800">{best.brand}</span>
          )}
          <span className="truncate text-gray-400">{best.reference}</span>
        </div>

        <h3 className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-[15px] font-semibold leading-snug text-gray-900">
          <Link href={href} className="hover:text-secondary-600">
            {product.name}
          </Link>
        </h3>

        <div className="mt-2 flex flex-col gap-1">
          <StockBadge availability={best.availability} />
          <CompatBadge product={product} />
        </div>

        {/* Price + cart */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0 leading-tight">
            {before && <span className="block text-xs text-gray-400 line-through">{formatEUR(before)}</span>}
            <span className={`block font-display text-2xl font-bold leading-none ${before ? 'text-secondary-600' : 'text-gray-900'}`}>
              {formatEUR(best.priceTTC)}
            </span>
            <span className="mt-1 block text-[11px] text-gray-500">
              {others > 0 ? `+ ${others} autre${others > 1 ? 's' : ''} marque${others > 1 ? 's' : ''}` : 'Prix TTC'}
              {product.depositTTC ? ` · + ${formatEUR(product.depositTTC)} consigne` : ''}
            </span>
          </div>
          <button
            type="button"
            onClick={add}
            aria-label={`Ajouter ${product.name} au panier`}
            title="Ajouter au panier"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white transition-colors hover:bg-secondary-600 active:translate-y-px"
          >
            <Icon name="cart" weight="bold" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  )
}
