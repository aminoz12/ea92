import { motion } from 'framer-motion'
import { scrollToElement } from '../../lib/utils'

export function ModernHero() {
  const handleCTAClick = () => {
    scrollToElement('services', 80)
  }

  const handleSecondaryCTAClick = () => {
    scrollToElement('contact', 80)
  }

  const handleCallNow = () => {
    window.location.href = 'tel:0147851000'
  }

  return (
    <div className="relative z-10 flex items-center justify-center h-full">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Automotive parts floating animation */}
        <motion.div
          className="absolute top-1/4 left-1/6 w-12 h-12 opacity-10"
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-red-500">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/6 w-10 h-10 opacity-8"
          animate={{ 
            y: [10, -10, 10],
            rotate: [0, -360],
            scale: [1.1, 1, 1.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-400">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-1/3 w-8 h-8 opacity-12"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-red-600">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 13.5L8.5 16 12 18.5 15.5 16 12 13.5z"/>
          </svg>
        </motion.div>

        {/* Floating parts elements */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-6 h-6 opacity-15"
          animate={{ 
            y: [-8, 8, -8],
            x: [-4, 4, -4],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-500">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </motion.div>

        {/* Animated gear elements */}
        <motion.div
          className="absolute top-1/5 right-1/5 w-12 h-12 opacity-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-red-400">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 8v6m11-7h-6m-8 0H1m15.5-8.5l-4.24 4.24m-5.66 0L2.5 3.5m15 15l-4.24-4.24m-5.66 0L2.5 20.5"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-1/5 left-1/5 w-8 h-8 opacity-10"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-gray-400">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="6"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
        </motion.div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Main Title */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Sophisticated decorative elements */}
              <motion.div 
                className="absolute -top-8 -left-8 w-16 h-16 border-2 border-red-500/20 rounded-full"
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute -top-4 -right-12 w-12 h-12 bg-gradient-to-r from-gray-400/20 to-red-400/20 rounded-full blur-sm"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
              <motion.div 
                className="absolute -bottom-6 -left-10 w-8 h-8 bg-red-600/30 rotate-45"
                animate={{ rotate: [45, 90, 45], scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              />
              
              {/* Main title with sophisticated styling */}
              <div className="text-center">
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="inline-block px-6 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm rounded-full border border-red-500/30 text-red-300 text-sm font-bold tracking-wider uppercase mb-6">
                    ✨ Votre partenaire automobile
                  </span>
                </motion.div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-8 leading-[0.9] tracking-tight">
                  <motion.div 
                    className="mb-2"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <span className="block bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent drop-shadow-2xl relative">
                      DISTRIBUTEUR
                      <motion.div
                        className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                      />
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <span className="block bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent drop-shadow-2xl">
                      PIÈCES
                </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <span className="block bg-gradient-to-r from-gray-300 via-gray-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
                      DÉTACHÉES
                </span>
                  </motion.div>
              </h1>

                {/* Target Audience with elegant styling */}
                <motion.div 
                  className="relative mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                  <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-gray-800/50 to-black/50 backdrop-blur-xl rounded-2xl px-8 py-4 border border-gray-600/30">
                    <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
                      <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                        Particuliers
                      </span>
                      <span className="mx-4 text-red-500 font-black">&</span>
                      <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                        Professionnels
                      </span>
                    </h2>
                    <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full animate-pulse"></div>
                  </div>
                </motion.div>
            </div>
          </div>
          </motion.div>

          {/* Value Proposition with sophisticated design */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-gray-500/5 rounded-3xl blur-xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 md:p-16 border border-white/20 shadow-2xl">
                {/* Main slogan */}
                <div className="text-center mb-12">
                  <motion.p 
                    className="text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight mb-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                  >
                    <span className="block bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                      « Vous réparez,
                    </span>
                    <span className="block bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent drop-shadow-lg mt-2">
                      on vous équipe. »
                </span>
                  </motion.p>
                </div>
                
                {/* Enhanced benefits grid */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                >
                  <motion.div 
                    className="text-center group"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <motion.div
                        className="absolute -inset-2 bg-red-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-2">
                      Prix pro
                    </h3>
                    <p className="text-gray-300 font-medium">Tarifs professionnels pour tous</p>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center group"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-green-500/30 transition-all duration-300">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <motion.div
                        className="absolute -inset-2 bg-green-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
                      Dispo immédiate
                    </h3>
                    <p className="text-gray-300 font-medium">Stock permanent & livraison rapide</p>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center group"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <motion.div
                        className="absolute -inset-2 bg-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                      Service réactif
                    </h3>
                    <p className="text-gray-300 font-medium">Conseil expert & assistance</p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Contact Information */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <div className="max-w-5xl mx-auto">
              {/* Premium phone section */}
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-600/5 to-red-500/10 rounded-3xl blur-xl"></div>
                
                <div className="relative bg-gradient-to-br from-red-500/20 via-red-600/15 to-red-700/20 backdrop-blur-xl rounded-3xl p-10 border border-red-500/30 shadow-2xl">
                  <div className="text-center">
                    {/* Animated phone icon */}
                    <motion.div 
                      className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                      animate={{ 
                        boxShadow: [
                          "0 10px 30px rgba(239, 68, 68, 0.3)",
                          "0 20px 40px rgba(239, 68, 68, 0.5)",
                          "0 10px 30px rgba(239, 68, 68, 0.3)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <motion.svg 
                        className="w-12 h-12 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </motion.svg>
                    </motion.div>
                    
                    {/* Phone number with sophisticated styling */}
                    <div className="mb-6">
                      <motion.h3 
                        className="text-5xl md:text-6xl font-black tracking-wider mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 2.0 }}
                      >
                        <span className="bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                          01 47 85 10 00
                </span>
                      </motion.h3>
                      
                      <motion.p 
                        className="text-lg text-red-200 font-medium tracking-wide"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.2 }}
                      >
                        ✨ Ligne directe - Réponse immédiate
                      </motion.p>
                    </div>

                    {/* Call to action button */}
                    <motion.button
                      onClick={handleCallNow}
                      className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white text-red-700 font-black text-xl rounded-2xl shadow-2xl transition-all duration-300 border-2 border-white/50"
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 25px 50px rgba(255, 255, 255, 0.3)",
                        y: -3
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.4 }}
                    >
                      <motion.svg 
                        className="w-6 h-6 mr-3" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </motion.svg>
                      Appelez-nous maintenant
                    </motion.button>
                  </div>
                </div>
            </div>
            
              {/* Elegant address section */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.6 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 via-black/5 to-gray-500/10 rounded-3xl blur-xl"></div>
                
                <div className="relative bg-gradient-to-br from-gray-600/20 via-gray-700/15 to-black/20 backdrop-blur-xl rounded-3xl p-8 border border-gray-500/30 shadow-xl">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Location icon and info */}
                    <div className="flex items-center space-x-6 mb-6 md:mb-0">
                      <motion.div 
                        className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </motion.div>
                      
                      <div className="text-left">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">
                          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                            426 Avenue de la République
              </span>
                        </h3>
                        <p className="text-xl md:text-2xl font-bold">
                          <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent">
                            92000 Nanterre
              </span>
                        </p>
                        <p className="text-sm text-gray-400 mt-2">📍 Facilement accessible - Parking disponible</p>
            </div>
          </div>

                    {/* Map button */}
                    <motion.a
                      href="https://maps.google.com/?q=426+Avenue+de+la+République,+92000+Nanterre"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold rounded-xl shadow-lg transition-all duration-300 border border-gray-600"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Voir sur la carte
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.button
              onClick={handleCTAClick}
              className="w-full sm:w-auto px-10 py-5 text-xl font-display font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-2xl rounded-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(220, 38, 38, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Découvrir nos services
              </span>
            </motion.button>
            
            <motion.button
              onClick={handleSecondaryCTAClick}
              className="w-full sm:w-auto px-10 py-5 text-xl font-display font-bold border-2 border-white text-white hover:bg-white hover:text-red-600 transition-all duration-300 rounded-2xl backdrop-blur-sm bg-white/10"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Nous contacter
              </span>
            </motion.button>
          </motion.div>

          {/* Professional CTA */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <motion.a 
              href="/pro"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Espace Professionnel
            </motion.a>
          </motion.div>


          {/* Enhanced Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <motion.div 
                className="w-1 h-3 bg-white rounded-full mt-2"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
