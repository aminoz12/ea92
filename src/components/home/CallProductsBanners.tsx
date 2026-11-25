import Link from 'next/link'
import { GENART } from '@/lib/shop/partTypes'
import { CatalogLink } from '../shop/CatalogLink'
import { Icon } from '../ui/Icon'

// "Produits d'appel" — cheap, frequent, urgent purchases that bring
// customers in (bulbs, wipers) + the winter battery push.
//
// Two neutral cards around one signal-yellow card. The product images have a
// white background (to match the product photos): it blends away with
// mix-blend-multiply on these light surfaces, so no dark cards here.
//
// No price here: prices come live from the suppliers, per vehicle. `note` is
// for an offer the store really runs, never for a "dès … €".
const BANNERS: { href?: string; genart?: number; label: string; title: string; text: string; note?: string; image: string; accent: boolean }[] = [
  {
    href: '/essuie-glaces',
    label: 'Promo hiver',
    title: 'Essuie-glaces',
    text: 'Une paire achetée = un dégivrant Holts offert',
    image: '/images/products/balais-essuie-glace.svg',
    accent: false,
  },
  {
    href: '/ampoules',
    label: 'Petit prix',
    title: 'Ampoules H1, H4, H7',
    text: 'Toutes les références en stock au magasin',
    image: '/images/products/ampoule.svg',
    accent: true,
  },
  {
    // The batteries that fit the visitor's vehicle, in the real catalogue.
    genart: GENART.battery,
    label: 'Spécial froid',
    title: 'Batteries',
    text: 'Varta, Bosch, Fulmen — reprise de l’ancienne',
    note: 'test gratuit au magasin',
    image: '/demarage.png',
    accent: false,
  },
]

export function CallProductsBanners() {
  return (
    // Phones: swipeable row (next banner peeks in); tablet+: 3 columns.
    <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
      {BANNERS.map((b) => {
        const className = `group relative flex min-h-[200px] w-[82%] shrink-0 snap-start overflow-hidden rounded-xl p-6 md:w-auto ${b.accent ? 'bg-signal-500' : 'bg-gray-100'}`
        const content = (
          <>
            <div className="relative z-10 flex max-w-[58%] flex-col">
              <span className="self-start font-display text-xs font-bold uppercase tracking-[0.12em] text-gray-900/70">{b.label}</span>
              <h3 className="mt-1 font-display text-xl font-bold leading-tight text-gray-900 sm:text-2xl">{b.title}</h3>
              <p className={`mt-1.5 text-sm leading-snug ${b.accent ? 'text-gray-900/80' : 'text-gray-600'}`}>{b.text}</p>
              {b.note && <p className={`mt-2 font-display text-lg font-bold ${b.accent ? 'text-gray-900' : 'text-secondary-600'}`}>{b.note}</p>}
              <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-gray-900 underline decoration-gray-900/30 underline-offset-4 group-hover:decoration-gray-900">
                J’en profite
                <Icon name="arrow-right" className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
              </span>
            </div>
            <img
              src={b.image}
              alt=""
              loading="lazy"
              className="absolute -right-4 bottom-0 h-[85%] w-1/2 object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            />
          </>
        )
        return b.href ? (
          <Link key={b.title} href={b.href} className={className}>
            {content}
          </Link>
        ) : (
          <CatalogLink key={b.title} genart={b.genart} className={className}>
            {content}
          </CatalogLink>
        )
      })}
    </div>
  )
}
