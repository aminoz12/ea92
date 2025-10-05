import { motion } from 'framer-motion'
import { useState } from 'react'

export const AnimatedLocationMap = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [showDirections, setShowDirections] = useState(false)

  const address = "426 Avenue de la République, 92000 Nanterre, France"
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.2847663864124!2d2.2166!3d48.8922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e664f5e1234567%3A0x1234567890abcdef!2s426%20Avenue%20de%20la%20République%2C%2092000%20Nanterre!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr`

  const openDirections = (app: 'google' | 'waze' | 'apple') => {
    const encodedAddress = encodeURIComponent(address)
    const urls = {
      google: `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`,
      waze: `https://waze.com/ul?q=${encodedAddress}`,
      apple: `http://maps.apple.com/?q=${encodedAddress}`
    }
    window.open(urls[app], '_blank')
    setShowDirections(false)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const mapVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  }

  return (
    <section className="py-24 bg-white dark:bg-gray-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Map pins floating */}
        {['📍', '🗺️', '🧭', '📌'].map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl opacity-10"
            style={{
              left: `${10 + index * 25}%`,
              top: `${20 + index * 20}%`,
            }}
            animate={{
              y: [-15, -25, -15],
              rotate: [-5, 5, -5],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3 + index * 0.5,
              repeat: Infinity,
              delay: index * 0.8
            }}
          >
            {emoji}
          </motion.div>
        ))}

        {/* Pulsing location indicator */}
        <motion.div
          className="absolute top-20 right-20 w-24 h-24"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-full h-full bg-red-500 rounded-full opacity-20"></div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl mb-8 shadow-2xl"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -10, 10, -10, 0],
                transition: { duration: 0.6 }
              }}
              animate={{
                boxShadow: [
                  "0 20px 25px -5px rgba(239, 68, 68, 0.1)",
                  "0 20px 25px -5px rgba(239, 68, 68, 0.3)",
                  "0 20px 25px -5px rgba(239, 68, 68, 0.1)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </motion.div>
            </motion.div>

            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Notre Localisation
              </span>
            </motion.h2>

          </div>

          {/* Map and info grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Map container */}
            <motion.div
              className="relative"
              variants={mapVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="bg-white dark:bg-gray-700 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-600">
                {/* Map header */}
                <motion.div 
                  className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white"
                  initial={{ x: -100 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">EspaceAuto92</h3>
                      <p className="text-red-100">{address}</p>
                    </div>
                    <motion.div
                      className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Interactive map */}
                <motion.div 
                  className="relative h-80 bg-gray-200 dark:bg-gray-600"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {!isMapLoaded && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: isMapLoaded ? 0 : 1 }}
                    >
                      <motion.div
                        className="text-center"
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Chargement de la carte...</p>
                      </motion.div>
                    </motion.div>
                  )}
                  
                  <iframe
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={() => setIsMapLoaded(true)}
                    className="rounded-b-3xl"
                  />
                </motion.div>
              </div>

              {/* Floating action button */}
              <motion.button
                onClick={() => setShowDirections(!showDirections)}
                className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  y: [-2, 2, -2],
                  boxShadow: [
                    "0 10px 25px rgba(239, 68, 68, 0.3)",
                    "0 15px 35px rgba(239, 68, 68, 0.4)",
                    "0 10px 25px rgba(239, 68, 68, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </motion.button>
            </motion.div>

            {/* Contact info */}
            <motion.div 
              className="space-y-8"
              variants={itemVariants}
            >
              {/* Contact details */}
              <div className="bg-white dark:bg-gray-700 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-600">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Informations de contact
                </h3>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
                      title: "Adresse",
                      content: address,
                      color: "red"
                    },
                    {
                      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                      title: "Téléphone",
                      content: "01 47 85 10 00",
                      color: "green"
                    },
                    {
                      icon: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                      title: "Email",
                      content: "contact@espaceauto92.fr",
                      color: "blue"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors duration-300"
                      whileHover={{ x: 10, scale: 1.02 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </motion.div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300">{item.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Directions panel */}
              <motion.div
                className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-3xl p-8 border border-red-200 dark:border-red-700/40"
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: showDirections ? 'auto' : 120,
                  opacity: 1 
                }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-4">
                  Itinéraires
                </h3>
                
                {showDirections ? (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[
                      { name: 'Google Maps', app: 'google', color: 'bg-blue-500', icon: '🗺️' },
                      { name: 'Waze', app: 'waze', color: 'bg-purple-500', icon: '🚗' },
                      { name: 'Apple Maps', app: 'apple', color: 'bg-gray-800', icon: '🍎' }
                    ].map((option, index) => (
                      <motion.button
                        key={option.app}
                        onClick={() => openDirections(option.app as 'google' | 'waze' | 'apple')}
                        className={`${option.color} text-white p-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="text-lg">{option.icon}</span>
                        <span>{option.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.p 
                    className="text-red-700 dark:text-red-300"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Cliquez sur le bouton direction sur la carte pour voir les options d'itinéraire
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
