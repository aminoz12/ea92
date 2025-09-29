import React from 'react'
import { Button } from '../ui/Button'
import { scrollToElement } from '../../lib/utils'

export function ModernHero() {
  const handleCTAClick = () => {
    scrollToElement('services', 80)
  }

  const handleSecondaryCTAClick = () => {
    scrollToElement('contact', 80)
  }

  return (
    <div className="relative z-10 flex items-center justify-center h-full">
      {/* Additional background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle automotive-themed patterns */}
        <div className="absolute top-1/4 left-1/6 w-1 h-16 bg-gradient-to-b from-transparent via-secondary-400/20 to-transparent rotate-45"></div>
        <div className="absolute top-1/3 right-1/6 w-1 h-12 bg-gradient-to-b from-transparent via-red-400/20 to-transparent -rotate-45"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-20 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent rotate-12"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-14 bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent -rotate-12"></div>
        
        {/* Gear-like decorative elements */}
        <div className="absolute top-1/5 right-1/5 w-8 h-8 border border-white/10 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-1/5 left-1/5 w-6 h-6 border border-secondary-400/20 rounded-full animate-spin" style={{animationDuration: '15s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Main Title with Enhanced Design */}
          <div className="mb-12">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-secondary-500/30 rounded-full animate-pulse"></div>
              <div className="absolute -top-2 -right-6 w-6 h-6 bg-red-500/30 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute -bottom-2 -left-6 w-4 h-4 bg-blue-500/30 rounded-full animate-pulse delay-500"></div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black mb-8 leading-tight tracking-tight">
                <span className="block bg-gradient-to-r from-white via-gray-50 to-gray-100 bg-clip-text text-transparent drop-shadow-2xl">
                  VOTRE AUTO,
                </span>
                <span className="block bg-gradient-to-r from-secondary-300 via-secondary-400 to-secondary-500 bg-clip-text text-transparent drop-shadow-2xl mt-2">
                  NOTRE PRIORITÉ.
                </span>
              </h1>
            </div>
          </div>

          {/* Enhanced Subtitle */}
          <div className="mb-16">
            <div className="relative mb-8">
              {/* Decorative line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-24 h-1 bg-gradient-to-r from-transparent via-secondary-500 to-transparent"></div>
              
              <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-semibold text-gray-300 mb-4 tracking-widest uppercase">
                <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-200 bg-clip-text text-transparent relative">
                  ESPACE-AUTO92
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-secondary-400 via-secondary-500 to-secondary-400 rounded-full"></div>
                </span>
              </h2>
              
              <p className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-gray-200 tracking-wider">
                <span className="bg-gradient-to-r from-gray-200 via-gray-300 to-white bg-clip-text text-transparent">
                  VOTRE PARTENAIRE D'EXCELLENCE
                </span>
              </p>
            </div>
            
            {/* Keywords with different colors */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base font-semibold">
              <span className="px-4 py-2 bg-red-500/20 text-red-300 rounded-full border border-red-400/30 backdrop-blur-sm">
                🔧 Réparation
              </span>
              <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30 backdrop-blur-sm">
                ⚙️ Entretien
              </span>
              <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full border border-green-400/30 backdrop-blur-sm">
                🚗 Pièces
              </span>
              <span className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-400/30 backdrop-blur-sm">
                🛠️ Diagnostic
              </span>
              <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full border border-purple-400/30 backdrop-blur-sm">
                🏆 Qualité
              </span>
              <span className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full border border-orange-400/30 backdrop-blur-sm">
                ⚡ Rapidité
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={handleCTAClick}
              className="w-full sm:w-auto px-10 py-5 text-xl font-display font-bold bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white shadow-red hover:shadow-red-lg transition-all duration-300 transform hover:scale-105 rounded-2xl"
            >
              <span className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Découvrir nos services
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleSecondaryCTAClick}
              className="w-full sm:w-auto px-10 py-5 text-xl font-display font-bold border-2 border-white text-white hover:bg-white hover:text-secondary-600 transition-all duration-300 transform hover:scale-105 rounded-2xl backdrop-blur-sm bg-white/10"
            >
              <span className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Nous contacter
              </span>
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
