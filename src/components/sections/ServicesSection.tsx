import { SlidingServices } from './SlidingServices'

export function ServicesSection() {

  return (
    <section id="services" className="py-16 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-xs font-display font-semibold mb-6">
            🔧 Services Professionnels
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Nos Services
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-700">
              Automobiles
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Découvrez notre gamme complète de services automobiles professionnels pour tous vos besoins. 
            <span className="font-display font-semibold text-gray-800 dark:text-gray-200"> Expertise, qualité et rapidité garanties.</span>
          </p>
        </div>

        {/* Sliding Services */}
        <SlidingServices />

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="card-modern p-8 relative">
            <div>
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                Pourquoi choisir 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-700"> EspaceAuto92</span> ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-modern">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">Expertise</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Plus de 10 ans d'expérience dans l'automobile avec des techniciens certifiés</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-modern">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">Rapidité</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Service rapide et efficace avec des délais respectés</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-modern">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">Confiance</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Partenaires de confiance depuis 2010 avec garantie sur tous nos services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

