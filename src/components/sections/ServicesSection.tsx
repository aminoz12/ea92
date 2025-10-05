import { SlidingServices } from './SlidingServices'

export function ServicesSection() {

  return (
    <section id="services" className="py-8 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative scroll-mt-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-red-600 mb-6 leading-tight">
            Nos Services
          </h2>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-black max-w-3xl mx-auto leading-relaxed league-spartan" style={{fontSize: '1.425rem'}}>
            Explorez tout ce qu'Espace Auto 92 peut faire pour vous
          </p>
        </div>

        {/* Sliding Services */}
        <SlidingServices />

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="p-8">
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                Pourquoi choisir 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-700"> Espace Auto 92</span> ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                <div className="text-center group">
                <div className="flex justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <img src="/mechanic.gif" alt="Expertise" className="w-24 h-24 object-contain bg-transparent mix-blend-multiply" />
                </div>
                  <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">Expertise</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Depuis 2017, Espace Auto 92 met son expertise et ses techniciens certifiés au service de votre satisfaction.</p>
                </div>
                <div className="text-center group">
                <div className="flex justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <img src="/delivery-truck.gif" alt="Rapidité" className="w-24 h-24 object-contain bg-transparent mix-blend-multiply" />
                </div>
                  <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">Rapidité</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Rapidité, efficacité et respect des délais : notre engagement au quotidien.</p>
                </div>
                <div className="text-center group">
                <div className="flex justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <img src="/friendship.gif" alt="Confiance" className="w-24 h-24 object-contain bg-transparent mix-blend-multiply" />
                </div>
                  <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">Confiance</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Des pièces certifiées, des marques reconnues et un service qui inspire la confiance depuis plus de 7 ans.</p>
                </div>
                <div className="text-center group">
                <div className="flex justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <img src="/entrepot.gif" alt="En stock" className="w-24 h-24 object-contain bg-transparent mix-blend-multiply" />
                </div>
                  <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">En stock</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Des milliers de références disponibles immédiatement.
                  </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

