import { SlidingServices } from './SlidingServices'

export function ServicesSection() {

  return (
    <section id="services" className="py-8 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative scroll-mt-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
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
          <div className="p-8">
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                Pourquoi choisir 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-700"> EspaceAuto92</span> ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="text-center group">
                <div className="flex justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <img src="/mechanic.gif" alt="Expertise" className="w-24 h-24 object-contain" />
                </div>
                  <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">Expertise</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Plus de 10 ans d'expérience dans l'automobile avec des techniciens certifiés</p>
                </div>
                <div className="text-center group">
                <div className="flex justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <img src="/delivery-truck.gif" alt="Rapidité" className="w-24 h-24 object-contain" />
                </div>
                  <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">Rapidité</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Service rapide et efficace avec des délais respectés</p>
                </div>
                <div className="text-center group">
                <div className="flex justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <img src="/friendship.gif" alt="Confiance" className="w-24 h-24 object-contain" />
                </div>
                  <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">Confiance</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Partenaires de confiance depuis 2010 avec garantie sur tous nos services</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

