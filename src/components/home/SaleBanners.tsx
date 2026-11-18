import Image from 'next/image'
import Link from 'next/link'
import { formatEUR } from '@/lib/shop/format'
import type { CategoryId, PublicProduct } from '@/lib/shop/types'
import { Icon } from '../ui/Icon'

const BANNERS: { category: CategoryId; kicker: string; title: string; text: string; image: string; position: string }[] = [
  {
    category: 'freinage',
    kicker: 'Freinage',
    title: 'Plaquettes & disques',
    text: 'Montage à prix fixe possible en garage partenaire.',
    image: '/blog1.jpeg',
    position: 'center 40%',
  },
  {
    category: 'entretien',
    kicker: 'Révision maison',
    title: 'Huile & filtres',
    text: 'La bonne référence pour votre moteur, avec votre plaque.',
    image: '/blog2.jpeg',
    position: 'center 55%',
  },
]

// Two large photo banners; "dès" = cheapest offer of the department.
export function SaleBanners({ products }: { products: PublicProduct[] }) {
  const from = (c: CategoryId) => {
    const prices = products.filter((p) => p.category === c).flatMap((p) => p.offers.map((o) => o.priceTTC))
    return prices.length ? Math.min(...prices) : null
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {BANNERS.map((b) => {
          const price = from(b.category)
          return (
            <Link
              key={b.category}
              href={`/boutique?categorie=${b.category}`}
              className="group relative flex min-h-[260px] flex-col justify-center overflow-hidden rounded-xl bg-gray-950 p-7 text-white sm:p-9"
            >
              <Image
                src={b.image}
                alt=""
                fill
                sizes="(min-width: 768px) 600px, 100vw"
                className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: b.position }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/70 to-transparent" />
              <div className="relative max-w-xs">
                {price !== null && (
                  <p className="font-display text-sm font-bold">
                    Dès <span className="text-signal-400">{formatEUR(price)}</span>
                  </p>
                )}
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-white/80">{b.kicker}</p>
                <p className="font-display text-3xl font-extrabold uppercase leading-tight sm:text-4xl">{b.title}</p>
                <p className="mt-2 text-sm text-white/75">{b.text}</p>
                <span className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-secondary-600 px-5 font-display text-sm font-bold uppercase tracking-wide group-hover:bg-secondary-700">
                  J’en profite <Icon name="arrow-right" className="w-4 h-4" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
