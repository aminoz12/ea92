import Link from 'next/link'
import { LOYALTY, PROMOS } from '@/lib/shop/config'
import { Icon } from '../ui/Icon'
import { CallProductsBanners } from './CallProductsBanners'

// Home, right under the hero: the season's offers and the club offer.
//
// No product cards and no countdown here: the shop sells the real catalogue,
// whose prices come live from the suppliers, so there is no list of
// crossed-out prices to show. PromoCountdown is still in the folder: bring it
// back next to the title when a promotion has a real end date (PROMOS.endsAt).
export function PromoSection() {
  const welcome = LOYALTY.particulier.welcomePoints

  return (
    <section id="promos" className="scroll-mt-32 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 border-b-2 border-gray-900 pb-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h2 className="font-display text-3xl font-bold text-gray-900 lg:text-4xl">
              Promos <span className="text-secondary-600">du moment</span>
            </h2>
            <p className="w-full text-sm text-gray-500 xl:w-auto">Les offres de saison du magasin de Nanterre.</p>
          </div>
        </div>

        <CallProductsBanners />

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
