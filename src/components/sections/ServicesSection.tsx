import { SlidingServices } from './SlidingServices'

const whyChooseFeatures = [
  {
    icon: '/mechanic.gif',
    title: 'Expertise',
    description:
      'Depuis 2017, Espace Auto 92 met son expertise en pièces automobiles au service des garages et des particuliers, avec un large stock et un accompagnement personnalisé.',
  },
  {
    icon: '/delivery-truck.gif',
    title: 'Rapidité',
    description:
      'Rapidité, efficacité et respect des délais pour répondre à vos besoins en pièces automobiles.',
  },
  {
    icon: '/friendship.gif',
    title: 'Confiance',
    description:
      'Des pièces certifiées, des marques reconnues et un service fiable qui inspire la confiance depuis plus de 7 ans.',
  },
  {
    icon: '/entrepot.gif',
    title: 'En stock',
    description: 'Des milliers de références disponibles immédiatement.',
  },
]

export function ServicesSection() {

  return (
    <section id="services" className="py-8 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative scroll-mt-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-display font-bold leading-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-700">
              Nos Services
            </span>
          </h2>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-black max-w-3xl mx-auto leading-relaxed league-spartan" style={{fontSize: '1.425rem'}}>
            Explorez tout ce qu'Espace Auto 92 peut faire pour vous
          </p>
        </div>

        {/* Sliding Services */}
        <SlidingServices />

        {/* Why choose us */}
        <div className="mt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Heading + Store image */}
            <div>
              <h3 className="text-3xl lg:text-4xl font-display font-bold leading-tight mb-8">
                Pourquoi choisir
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-700">
                  {' '}
                  Espace Auto 92
                </span>{' '}
                ?
              </h3>
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-200/60 dark:ring-gray-700">
                  <img
                    src="/magasin.png"
                    alt="Magasin Espace Auto 92"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Depuis 2017 badge */}
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-gray-900/90 backdrop-blur rounded-full shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-secondary-500" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      Depuis 2017
                    </span>
                  </div>
                </div>
                {/* Decorative glow */}
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
                <div className="absolute -top-8 -right-8 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
              </div>
            </div>

            {/* Right — features */}
            <div className="space-y-6">
              {whyChooseFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-5 group">
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      className="w-11 h-11 object-contain mix-blend-multiply dark:mix-blend-normal"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

