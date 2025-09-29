import { useLocale } from '../../hooks/useLocale'
import { Button } from '../ui/Button'
import { scrollToElement } from '../../lib/utils'

export function HeroSection() {
  const { t } = useLocale()

  const handleCTAClick = () => {
    scrollToElement('services', 80)
  }

  const handleSecondaryCTAClick = () => {
    scrollToElement('products', 80)
  }

  return (
    <div className="relative z-10 flex items-center justify-center h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="block">{t('hero.title')}</span>
            <span className="block text-2xl md:text-3xl lg:text-4xl font-normal text-primary-200 mt-2">
              {t('hero.subtitle')}
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={handleCTAClick}
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {t('hero.cta')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleSecondaryCTAClick}
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
            >
              {t('hero.ctaSecondary')}
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





