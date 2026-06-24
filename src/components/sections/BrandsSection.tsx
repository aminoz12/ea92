'use client'

import { useLocale } from '../../hooks/useLocale'

interface Brand {
  name: string
  logo: string
  // Keep this logo at the smaller size even in the second (bigger) row
  keepSmaller?: boolean
}

// First row — bigger logos
const rowOne: Brand[] = [
  { name: 'Delphi', logo: '/images/brands/delphi.png' },
  { name: 'SKF', logo: '/images/brands/skf.png' },
  { name: 'Gates', logo: '/images/brands/gates.png' },
  { name: 'LuK', logo: '/images/brands/luk.png' },
  { name: 'Sachs', logo: '/images/brands/sachs.png' },
  { name: 'TRW', logo: '/images/brands/trw.png' },
  { name: 'Dolz', logo: '/images/brands/dolz.png' },
  { name: 'Febi', logo: '/images/brands/febi.png' },
]

// Second row — smaller logos
const rowTwo: Brand[] = [
  { name: 'Ferodo', logo: '/images/brands/ferodo.png', keepSmaller: true },
  { name: 'MAHLE', logo: '/images/brands/MAHLE.png', keepSmaller: true },
  { name: 'Moog', logo: '/images/brands/moog.png' },
  { name: 'Mecafilter', logo: '/images/brands/mecafilter.png' },
  { name: 'Purflux', logo: '/images/brands/purflux.png' },
  { name: 'Castrol', logo: '/images/brands/castrol.png' },
  { name: 'Varta', logo: '/images/brands/varta.png' },
  { name: 'Valeo', logo: '/images/brands/valeo.png' },
  { name: 'Bosch', logo: '/images/brands/bosch.png' },
  { name: 'Denso', logo: '/images/brands/denso.png' },
  { name: 'Brembo', logo: '/images/brands/brembo.png', keepSmaller: true },
]

const BrandCard = ({ brand, small }: { brand: Brand; small?: boolean }) => {
  // Row 1 -> small; row 2 -> bigger, except logos flagged keepSmaller
  const sizeClass = small
    ? 'max-h-20 max-w-[200px]'
    : brand.keepSmaller
      ? 'max-h-28 max-w-[260px]'
      : 'max-h-32 max-w-[300px]'

  return (
    <div className="group/card shrink-0 mx-9 h-36 flex items-center justify-center">
      <img
        src={brand.logo}
        alt={brand.name}
        loading="lazy"
        decoding="async"
        className={`w-auto object-contain transition-transform duration-300 group-hover/card:scale-110 ${sizeClass}`}
      />
    </div>
  )
}

// One auto-scrolling row. The list is duplicated so the -50% loop is seamless.
// Pure CSS animation -> renders as static HTML, no hydration risk.
const MarqueeRow = ({
  items,
  direction,
  small,
}: {
  items: Brand[]
  direction: 'left' | 'right'
  small?: boolean
}) => (
  <div className="group relative overflow-hidden marquee-mask">
    <div
      className={`flex w-max will-change-transform ${
        direction === 'left' ? 'animate-scroll-right-left' : 'animate-scroll-left-right'
      } [@media(hover:hover)]:group-hover:[animation-play-state:paused]`}
      style={{ animationDuration: '40s' }}
    >
      {[...items, ...items].map((brand, i) => (
        <BrandCard key={`${brand.name}-${i}`} brand={brand} small={small} />
      ))}
    </div>
  </div>
)

export function BrandsSection() {
  const { t } = useLocale()

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-display font-bold leading-tight mb-5">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-700">
              {t('brands.title')}
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('brands.subtitle')}
          </p>
        </div>

        {/* Scrolling brand logo wall — first half / second half */}
        <div className="space-y-5">
          <MarqueeRow items={rowOne} direction="left" small />
          <MarqueeRow items={rowTwo} direction="right" />
        </div>

        {/* Quality guarantee */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">
              Garantie qualité
            </p>
            <p className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-200 leading-snug">
              {t('brands.note')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
