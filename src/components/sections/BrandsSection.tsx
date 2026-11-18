'use client'

import { useLocale } from '../../hooks/useLocale'
import { SectionHeading } from '../ui/SectionHeading'

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
  // One visual size for every logo (wide wordmarks are capped by width).
  const sizeClass = small || brand.keepSmaller ? 'max-h-10 max-w-[120px]' : 'max-h-14 max-w-[140px]'

  // Reserve horizontal space so the card never collapses to 0 width while the
  // logo is loading. Without this the w-max marquee track shrinks and rows
  // look empty or show only one logo (very visible on mobile).
  const minWidthClass = 'min-w-[120px]'

  return (
    <div className={`group/card shrink-0 mx-6 h-20 flex items-center justify-center ${minWidthClass}`}>
      <img
        src={brand.logo}
        alt={brand.name}
        // Eager: the marquee scrolls via transform, so off-screen logos would
        // never enter the viewport and lazy loading would leave them blank.
        loading="eager"
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
      style={{ animationDuration: '70s' }}
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
    <section className="bg-white py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t('brands.title')} subtitle={t('brands.subtitle')} />

        {/* One scrolling row of logos, all at the same visual size */}
        <div className="rounded-xl border border-gray-200 py-2">
          <MarqueeRow items={[...rowOne, ...rowTwo]} direction="left" />
        </div>
        <p className="mt-4 text-sm text-gray-500">{t('brands.note')}</p>
      </div>
    </section>
  )
}
