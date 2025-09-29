import React from 'react'
import { Button } from '../ui/Button'

export function CarteGriseSection() {
  const handleOrderNow = () => {
    // This will open the external website in a new tab
    window.open('https://example.com', '_blank')
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-secondary-500/10 to-secondary-600/10 dark:from-secondary-500/20 dark:to-secondary-600/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-primary-500/10 to-primary-600/10 dark:from-primary-500/20 dark:to-primary-600/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-accent-500/5 to-accent-600/5 dark:from-accent-500/10 dark:to-accent-600/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1.5 bg-secondary-100 text-secondary-700 rounded-full text-xs font-display font-semibold">
                ⚡ Service Express
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                Carte Grise & 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-700">
                  Plaque d'immatriculation
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Obtenez votre carte grise et votre plaque d'immatriculation en 
                <span className="font-display font-bold text-secondary-600"> 10 minutes seulement</span>. 
                Service rapide, sécurisé et garanti.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1">Livraison Express</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Réception en 10 minutes par email</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1">100% Sécurisé</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Données protégées et cryptées</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1">Processus Simple</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">3 étapes seulement</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1">Support 24/7</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Assistance disponible à tout moment</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleOrderNow}
                className="btn-modern text-base px-8 py-3"
              >
                Commandez Maintenant
                <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right side - Animated Carte Grise Image */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main animated image container */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-modern p-4 group">
                <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                  <img
                    src="/cartegrise.png"
                    alt="Carte Grise & Plaque d'immatriculation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Animated overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                </div>
                
              </div>

              {/* Floating secondary element with animation */}
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-modern p-4 animate-float">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-800 dark:to-secondary-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl mb-1 animate-pulse">⚡</div>
                    <p className="text-xs text-gray-500 dark:text-gray-300 font-display font-semibold">10 min</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-display font-bold text-secondary-600 mb-1">10 min</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium text-sm">Délai de traitement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-display font-bold text-secondary-600 mb-1">24/7</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium text-sm">Disponibilité</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-display font-bold text-secondary-600 mb-1">100%</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium text-sm">Satisfaction client</div>
          </div>
        </div>
      </div>
    </section>
  )
}
