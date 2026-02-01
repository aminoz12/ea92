import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'

export function ContactSection() {
  const [showDirectionsModal, setShowDirectionsModal] = useState(false)

  const openDirections = (app: 'google' | 'waze' | 'apple') => {
    const address = "426 Avenue de la République, 92000 Nanterre, France"
    const encodedAddress = encodeURIComponent(address)
    
    switch (app) {
      case 'google':
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank')
        break
      case 'waze':
        window.open(`https://waze.com/ul?q=${encodedAddress}`, '_blank')
        break
      case 'apple':
        window.open(`http://maps.apple.com/?q=${encodedAddress}`, '_blank')
        break
    }
    setShowDirectionsModal(false)
  }

  return (
    <section id="contact" className="py-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
            Notre Localisation
          </h2>
        </div>

        {/* Map and Contact Information */}
        <div className="max-w-4xl mx-auto">
          {/* Live Map */}
          <Card className="card-modern shadow-red hover:shadow-red-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 p-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                    Notre localisation
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                    Trouvez-nous facilement à Nanterre
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-96 rounded-b-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2621.123456789!2d2.213749!3d48.896563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0xe8a5e27333b66803!2sEspace+Auto+92!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-b-2xl"
                  title="Localisation Espace Auto 92 - 426 Avenue de la République, 92000 Nanterre"
                ></iframe>
                
                {/* Map overlay with address */}
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Espace Auto 92</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">426 Avenue de la République<br/>92000 Nanterre, France</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Directions Button */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex justify-center">
                <button
                  onClick={() => setShowDirectionsModal(true)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-display font-semibold rounded-xl shadow-red hover:shadow-red-lg transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Obtenir l'itinéraire
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Directions Modal - Modernized */}
        {showDirectionsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-white">
                        Choisir une application
                      </h3>
                      <p className="text-secondary-100 text-sm">Sélectionnez votre app de navigation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDirectionsModal(false)}
                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Google Maps */}
                <button
                  onClick={() => openDirections('google')}
                  className="w-full flex items-center p-5 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/30 dark:hover:to-red-800/30 rounded-2xl transition-all duration-300 group shadow-md hover:shadow-lg"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-display font-bold text-gray-900 dark:text-white text-lg">Google Maps</p>
                    <p className="text-gray-600 dark:text-gray-300">Navigation et trafic en temps réel</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Waze */}
                <button
                  onClick={() => openDirections('waze')}
                  className="w-full flex items-center p-5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 rounded-2xl transition-all duration-300 group shadow-md hover:shadow-lg"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-display font-bold text-gray-900 dark:text-white text-lg">Waze</p>
                    <p className="text-gray-600 dark:text-gray-300">Navigation communautaire</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Apple Maps */}
                <button
                  onClick={() => openDirections('apple')}
                  className="w-full flex items-center p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-2xl transition-all duration-300 group shadow-md hover:shadow-lg"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-display font-bold text-gray-900 dark:text-white text-lg">Apple Maps</p>
                    <p className="text-gray-600 dark:text-gray-300">Navigation native iOS</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </section>
  )
}

