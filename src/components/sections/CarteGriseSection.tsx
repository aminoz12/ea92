
export function CarteGriseSection() {
  const handleOrderNow = () => {
    // This will open the external website in a new tab
    window.open('https://ematricule.fr', '_blank')
  }

  const handleOrderInStore = () => {
    // This will handle in-store ordering (could open contact page or show modal)
    window.open('#contact', '_self')
  }

  return (
    <section className="py-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
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
                <img src="/delivery-courier.gif" alt="Livraison Express" className="w-12 h-12 object-cover" />
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1">Livraison Express</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Réception en 10 minutes par email</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <img src="/data-safety.gif" alt="100% Sécurisé" className="w-12 h-12 object-cover" />
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1">100% Sécurisé</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Données protégées et cryptées</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <img src="/customs-clearance.gif" alt="Processus Simple" className="w-12 h-12 object-cover" />
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1">Processus Simple</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">3 étapes seulement</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <img src="/virtual-assistant.gif" alt="Support 24/7" className="w-12 h-12 object-cover" />
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1">Support 24/7</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Assistance disponible à tout moment</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleOrderNow}
                  className="btn-modern text-sm px-8 py-3 flex-1 min-w-[200px]"
                >
                  Commander Online
                  <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={handleOrderInStore}
                  className="group relative bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-sm px-8 py-3 flex-1 min-w-[200px] rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 border-2 border-green-500/20"
                >
                  <span className="flex items-center justify-center whitespace-nowrap">
                    <svg className="w-5 h-5 mr-2 group-hover:animate-bounce flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="bg-gradient-to-r from-green-100 to-green-200 bg-clip-text text-transparent font-bold">
                      Commander en magasin
                    </span>
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
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
                <div className="text-center">
                  <img src="/session.gif" alt="10 min" className="w-8 h-8 mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-300 font-display font-semibold">10 min</p>
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
