import { useLocale } from '../../hooks/useLocale'

export function BrandsSection() {
  const { t } = useLocale()

  // Brand data with actual logos
  const brands = [
    { name: 'Bosch', logo: '/images/brands/bosch.png', alt: 'Bosch' },
    { name: 'Delphi', logo: '/images/brands/delphi.png', alt: 'Delphi' },
    { name: 'Brembo', logo: '/images/brands/brembo.png', alt: 'Brembo' },
    { name: 'Castrol', logo: '/images/brands/castrol.png', alt: 'Castrol' },
    { name: 'Dolz', logo: '/images/brands/dolz.png', alt: 'Dolz' },
    { name: 'Ferodo', logo: '/images/brands/ferodo.png', alt: 'Ferodo' },
    { name: 'Mecafilter', logo: '/images/brands/mecafilter.png', alt: 'Mecafilter' },
    { name: 'Moog', logo: '/images/brands/moog.png', alt: 'Moog' },
  ]

  return (
    <section className="py-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 relative">
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                {t('brands.title')}
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
            {t('brands.subtitle')}
          </p>
        </div>

        {/* Scrolling Brands */}
        <div className="overflow-hidden">
          {/* First row - scroll right to left */}
          <div className="flex animate-scroll-right-left">
            {/* Duplicate brands for seamless loop */}
            {[...brands, ...brands].map((brand, index) => (
              <div key={`row1-${index}`} className="flex-shrink-0 mx-8 group">
                <div className="relative w-32 h-20 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.alt}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement
                      if (fallback) {
                        fallback.style.display = 'flex'
                      }
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center transition-colors duration-300 hidden">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-300 text-center">
                      {brand.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second row - scroll left to right */}
          <div className="flex animate-scroll-left-right mt-8">
            {/* Duplicate brands for seamless loop */}
            {[...brands, ...brands].map((brand, index) => (
              <div key={`row2-${index}`} className="flex-shrink-0 mx-8 group">
                <div className="relative w-32 h-20 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.alt}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement
                      if (fallback) {
                        fallback.style.display = 'flex'
                      }
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center transition-colors duration-300 hidden">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-300 text-center">
                      {brand.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl border border-red-200/60 dark:border-red-700/40 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-base font-medium text-red-800 dark:text-red-300">
                {t('brands.note')}
              </p>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
