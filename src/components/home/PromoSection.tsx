import Link from 'next/link'
import { LOYALTY, PROMOS } from '@/lib/shop/config'
import type { PublicProduct } from '@/lib/shop/types'
import { ProductCard } from '../shop/ProductCard'
import { Icon } from '../ui/Icon'
import { CallProductsBanners } from './CallProductsBanners'
import { PromoCountdown } from './PromoCountdown'

const isDeal = (p: PublicProduct) => !!p.compareAtTTC && p.compareAtTTC > p.offers[0].priceTTC
const isSeasonal = (p: PublicProduct) => p.tags.some((t) => t === 'promo' || t === 'hiver' || t === 'appel')

// Home, right under the hero: "Promos de la semaine" with countdown, the
// season's banners, the parts at a crossed-out price, and the club offer.
export function PromoSection({ products }: { products: PublicProduct[] }) {
  const deals = [...products.filter(isDeal), ...products.filter((p) => !isDeal(p) && isSeasonal(p))].slice(0, 4)
  const welcome = LOYALTY.particulier.welcomePoints

  return (
    <section id="promos" className="scroll-mt-32 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading: title + countdown + subtitle, link on the right */}
        <div className="mb-6 flex flex-col gap-3 border-b-2 border-gray-900 pb-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h2 className="font-display text-3xl font-bold text-gray-900 lg:text-4xl">
              Promos <span className="text-secondary-600">de la semaine</span>
            </h2>
            <PromoCountdown />
            <p className="w-full text-sm text-gray-500 xl:w-auto">Prix barrés et offres de saison, en stock au magasin de Nanterre.</p>
          </div>
          <Link href="/boutique?promo=1" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-gray-900 hover:text-secondary-600">
            Toutes les promos <Icon name="arrow-right" className="w-4 h-4" strokeWidth={2.2} />
          </Link>
        </div>

        <CallProductsBanners />

        {deals.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {deals.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}

        {/* Dashed "coupon" strip — the club welcome offer */}
        {PROMOS.welcomeStrip && (
          <Link
            href="/fidelite"
            className="group relative mt-6 flex flex-col items-start gap-3 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-white px-5 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-8"
          >
            <span className="font-display text-5xl font-extrabold leading-none text-secondary-600">
              +{welcome}
              <span className="ml-1 text-xl">pts</span>
            </span>
            <span className="relative flex-1">
              <span className="block font-display text-xl font-bold text-gray-900">Offerts à l’inscription au club fidélité</span>
              <span className="block text-sm text-gray-600">
                Puis 1 point par euro, en ligne comme au comptoir. Inscription gratuite avec votre numéro de mobile.
              </span>
            </span>
            <span className="relative inline-flex h-11 items-center gap-2 rounded-lg bg-gray-900 px-5 font-display text-sm font-bold uppercase tracking-wide text-white group-hover:bg-secondary-600">
              Je m’inscris <Icon name="arrow-right" className="w-4 h-4" strokeWidth={2.4} />
            </span>
          </Link>
        )}
      </div>
    </section>
  )
}
