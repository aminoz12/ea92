import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface HourItem {
  day: string
  hours: string
  isToday?: boolean
  isOpen?: boolean
}

export const AnimatedOpeningHours = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getCurrentDay = () => {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    return days[currentTime.getDay()]
  }

  const isCurrentlyOpen = () => {
    const now = currentTime
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    const currentTime24 = currentHour * 100 + currentMinutes
    const day = now.getDay()

    // Monday to Saturday: 9:00 - 18:30
    if (day >= 1 && day <= 6) {
      if (day === 5) { // Friday: 9:00-12:30, 15:00-18:30
        return (currentTime24 >= 900 && currentTime24 <= 1230) || 
               (currentTime24 >= 1500 && currentTime24 <= 1830)
      } else {
        return currentTime24 >= 900 && currentTime24 <= 1830
      }
    }
    return false // Sunday: closed
  }

  const openingHours: HourItem[] = [
    {
      day: 'Lundi',
      hours: '9h - 18h30',
      isToday: getCurrentDay() === 'lundi',
      isOpen: getCurrentDay() === 'lundi' && isCurrentlyOpen()
    },
    {
      day: 'Mardi',
      hours: '9h - 18h30',
      isToday: getCurrentDay() === 'mardi',
      isOpen: getCurrentDay() === 'mardi' && isCurrentlyOpen()
    },
    {
      day: 'Mercredi',
      hours: '9h - 18h30',
      isToday: getCurrentDay() === 'mercredi',
      isOpen: getCurrentDay() === 'mercredi' && isCurrentlyOpen()
    },
    {
      day: 'Jeudi',
      hours: '9h - 18h30',
      isToday: getCurrentDay() === 'jeudi',
      isOpen: getCurrentDay() === 'jeudi' && isCurrentlyOpen()
    },
    {
      day: 'Vendredi',
      hours: '9h - 12h30 / 15h - 18h30',
      isToday: getCurrentDay() === 'vendredi',
      isOpen: getCurrentDay() === 'vendredi' && isCurrentlyOpen()
    },
    {
      day: 'Samedi',
      hours: '9h - 18h30',
      isToday: getCurrentDay() === 'samedi',
      isOpen: getCurrentDay() === 'samedi' && isCurrentlyOpen()
    },
    {
      day: 'Dimanche',
      hours: 'Fermé',
      isToday: getCurrentDay() === 'dimanche',
      isOpen: false
    }
  ]

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 relative overflow-hidden">
      {/* Soft animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Elegant clock elements with red accents */}
        <motion.div
          className="absolute top-20 right-20 w-24 h-24 opacity-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <circle cx="50" cy="50" r="45" stroke="url(#redGradient)" strokeWidth="2" fill="none"/>
            <circle cx="50" cy="50" r="35" stroke="url(#grayGradient)" strokeWidth="1" fill="none" opacity="0.3"/>
            <circle cx="50" cy="50" r="8" fill="url(#redGradient)"/>
            {/* Clock hands */}
            <line x1="50" y1="50" x2="50" y2="25" stroke="url(#redGradient)" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="50" x2="65" y2="50" stroke="url(#grayGradient)" strokeWidth="2" strokeLinecap="round"/>
            <defs>
              <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>
              <linearGradient id="grayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B7280" />
                <stop offset="100%" stopColor="#4B5563" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-20 w-16 h-16 opacity-6"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <circle cx="50" cy="50" r="40" stroke="url(#blackRedGradient)" strokeWidth="2" fill="none"/>
            <circle cx="50" cy="50" r="6" fill="url(#blackRedGradient)"/>
            <defs>
              <linearGradient id="blackRedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1F2937" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Floating particles with gentle movement */}
        <motion.div
          className="absolute top-1/3 left-10 w-3 h-3 bg-red-500/15 rounded-full"
          animate={{
            y: [-8, -16, -8],
            x: [-4, 4, -4],
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-2 h-2 bg-gray-400/20 rounded-full"
          animate={{
            y: [-6, -12, -6],
            x: [3, -3, 3],
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 1, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-10 w-4 h-4 bg-red-600/10 rounded-full"
          animate={{
            y: [-10, -20, -10],
            x: [-2, 2, -2],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.25, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2, ease: "easeInOut" }}
        />

        {/* Soft geometric shapes */}
        <motion.div
          className="absolute top-1/4 left-1/3 w-5 h-5 bg-gray-500/8 rotate-45"
          animate={{
            rotate: [45, 135, 45],
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/2 left-1/5 w-6 h-1 bg-red-500/12 rounded-full"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.3, 1],
            opacity: [0.12, 0.2, 0.12]
          }}
          transition={{ duration: 14, repeat: Infinity, delay: 3, ease: "easeInOut" }}
        />

        {/* Ambient gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-red-500/8 to-gray-400/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.2, 0.08],
            x: [-10, 10, -10],
            y: [-5, 5, -5]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-gray-600/6 to-red-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.06, 0.15, 0.06],
            x: [15, -15, 15],
            y: [8, -8, 8]
          }}
          transition={{ duration: 18, repeat: Infinity, delay: 4, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-r from-red-400/5 to-gray-500/8 rounded-full blur-2xl"
          animate={{
            scale: [0.9, 1.4, 0.9],
            opacity: [0.05, 0.12, 0.05],
            x: [-8, 8, -8],
            y: [-12, 12, -12]
          }}
          transition={{ duration: 20, repeat: Infinity, delay: 6, ease: "easeInOut" }}
        />

        {/* Subtle wave patterns */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/5 to-transparent"
          animate={{
            x: [-100, window.innerWidth || 1200],
            opacity: [0, 0.1, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-gray-400/5 to-transparent"
          animate={{
            x: [100, -(window.innerWidth || 1200)],
            opacity: [0, 0.08, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, delay: 5, ease: "linear" }}
        />

        {/* Breathing light effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-red-500/2 via-transparent to-transparent"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.02, 0.05, 0.02]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Soft corner accents */}
        <motion.div
          className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-red-500/3 to-transparent rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-gray-600/4 to-transparent rounded-full blur-xl"
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.04, 0.1, 0.04]
          }}
          transition={{ duration: 14, repeat: Infinity, delay: 2, ease: "easeInOut" }}
        />

        {/* Delicate sparkle effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-red-400/20 rounded-full"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.4, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Compact header with inline time */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Modern title and clock icon */}
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-red-600 via-red-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10"
                animate={{ 
                  boxShadow: [
                    "0 20px 40px rgba(220, 38, 38, 0.15)",
                    "0 25px 50px rgba(220, 38, 38, 0.25)",
                    "0 20px 40px rgba(220, 38, 38, 0.15)"
                  ],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.svg 
                  className="w-9 h-9 text-white drop-shadow-lg" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.03, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity }
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>
              </motion.div>
              
              {/* Elegant ring around icon */}
              <motion.div
                className="absolute inset-0 border-2 border-red-500/20 rounded-2xl"
                animate={{ 
                  scale: [1, 1.08, 1],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
            </motion.div>
            
            <div>
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-2"
                variants={itemVariants}
              >
                <span className="bg-gradient-to-r from-red-600 via-gray-900 to-black bg-clip-text text-transparent">
                  Heures d'ouverture
                </span>
              </motion.h2>
              <motion.p 
                className="text-gray-600 dark:text-gray-400 text-lg font-medium"
                variants={itemVariants}
              >
                Toujours là pour vous servir
              </motion.p>
            </div>
          </div>

          {/* Elegant live time display */}
          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <motion.div
              className="bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ scale: 1.02, y: -3 }}
              animate={{
                boxShadow: [
                  "0 10px 30px rgba(0, 0, 0, 0.08)",
                  "0 20px 40px rgba(220, 38, 38, 0.1)",
                  "0 10px 30px rgba(0, 0, 0, 0.08)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="text-center">
                <motion.div 
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-700 to-black dark:from-white dark:via-red-400 dark:to-gray-300 bg-clip-text text-transparent mb-3"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {formatCurrentTime()}
                </motion.div>
                
                <motion.div
                  className={`inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg ${
                    isCurrentlyOpen() 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-green-600/30' 
                      : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-600/30'
                  }`}
                  animate={{ 
                    scale: [1, 1.03, 1],
                    boxShadow: isCurrentlyOpen() 
                      ? ["0 4px 15px rgba(22, 163, 74, 0.3)", "0 6px 20px rgba(22, 163, 74, 0.4)", "0 4px 15px rgba(22, 163, 74, 0.3)"]
                      : ["0 4px 15px rgba(220, 38, 38, 0.3)", "0 6px 20px rgba(220, 38, 38, 0.4)", "0 4px 15px rgba(220, 38, 38, 0.3)"]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <motion.div
                    className="w-2.5 h-2.5 bg-white rounded-full mr-3 shadow-sm"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  {isCurrentlyOpen() ? 'OUVERT MAINTENANT' : 'FERMÉ ACTUELLEMENT'}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Modern horizontal schedule */}
        <motion.div
          className="bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.3 }}
        >
          {/* Days grid - horizontal layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-600">
            {openingHours.map((item) => (
              <motion.div
                key={item.day}
                variants={itemVariants}
                className={`p-6 text-center transition-all duration-300 relative ${
                  item.isToday
                    ? 'bg-gradient-to-br from-red-50 via-gray-50 to-white dark:from-red-900/20 dark:via-gray-800/50 dark:to-black/80'
                    : 'hover:bg-gradient-to-br hover:from-gray-50 hover:to-red-50/30 dark:hover:from-gray-800/50 dark:hover:to-red-900/10'
                }`}
                whileHover={{ 
                  scale: 1.03, 
                  y: -3,
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)"
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Day name */}
                <div className="mb-2">
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      className={`w-3 h-3 rounded-full shadow-md ${
                        item.isToday
                          ? item.isOpen
                            ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-600/40'
                            : 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-600/40'
                          : 'bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-500'
                      }`}
                      animate={item.isToday ? {
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.8, 1],
                        boxShadow: item.isOpen 
                          ? ["0 0 0 0 rgba(34, 197, 94, 0.6)", "0 0 0 6px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0.6)"]
                          : ["0 0 0 0 rgba(220, 38, 38, 0.6)", "0 0 0 6px rgba(220, 38, 38, 0)", "0 0 0 0 rgba(220, 38, 38, 0.6)"]
                      } : {}}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                    <span className={`text-sm font-bold tracking-wide ${
                      item.isToday
                        ? 'bg-gradient-to-r from-red-600 to-gray-900 bg-clip-text text-transparent'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {item.day.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                  
                  {item.isToday && (
                    <motion.div
                      className="text-xs bg-gradient-to-r from-red-600 to-gray-800 text-white px-3 py-1.5 rounded-full mt-2 inline-block font-bold shadow-lg"
                      initial={{ scale: 0, rotate: -5 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.3, 
                        type: "spring",
                        stiffness: 180 
                      }}
                      whileHover={{ scale: 1.05, rotate: 1 }}
                    >
                      • Aujourd'hui
                    </motion.div>
                  )}
                </div>

                {/* Modern Hours */}
                <div className={`text-sm font-bold mb-3 ${
                  item.day === 'Dimanche'
                    ? 'text-gray-500 dark:text-gray-400'
                    : item.isToday
                    ? 'bg-gradient-to-r from-red-600 to-gray-900 bg-clip-text text-transparent'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {item.day === 'Vendredi' ? (
                    <div>
                      <div>9h-12h30</div>
                      <div>15h-18h30</div>
                    </div>
                  ) : (
                    item.hours
                  )}
                </div>

                {/* Modern status indicator for today */}
                {item.isToday && (
                  <motion.div
                    className={`text-xs font-bold px-3 py-2 rounded-xl shadow-lg border ${
                      item.isOpen
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-green-600/30 border-green-500/20'
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-600/30 border-red-500/20'
                    }`}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      boxShadow: item.isOpen
                        ? ["0 4px 15px rgba(22, 163, 74, 0.3)", "0 6px 20px rgba(22, 163, 74, 0.4)", "0 4px 15px rgba(22, 163, 74, 0.3)"]
                        : ["0 4px 15px rgba(220, 38, 38, 0.3)", "0 6px 20px rgba(220, 38, 38, 0.4)", "0 4px 15px rgba(220, 38, 38, 0.3)"]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    whileHover={{ scale: 1.08 }}
                  >
                    {item.isOpen ? '● OUVERT' : '● FERMÉ'}
                  </motion.div>
                )}

                {/* Elegant corner accent for today */}
                {item.isToday && (
                  <motion.div
                    className="absolute top-3 right-3 w-1.5 h-1.5 bg-gradient-to-r from-red-500 to-gray-700 rounded-full"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Modern call to action */}
          <motion.div
            className="bg-gradient-to-r from-gray-50 via-white to-red-50/30 dark:from-gray-800/80 dark:via-black/90 dark:to-red-900/20 p-6 border-t border-gray-200/60 dark:border-gray-700/40"
            variants={itemVariants}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-r from-red-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg"
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <div>
                  <div className="text-sm font-bold bg-gradient-to-r from-red-600 to-gray-900 bg-clip-text text-transparent">
                    Questions ? Besoin d'aide ?
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Notre équipe est disponible
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.a
                  href="tel:+33147851000"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-xl border border-red-500/20 transition-all duration-300 text-sm"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    boxShadow: "0 15px 35px rgba(220, 38, 38, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      "0 8px 25px rgba(220, 38, 38, 0.2)",
                      "0 12px 30px rgba(220, 38, 38, 0.3)",
                      "0 8px 25px rgba(220, 38, 38, 0.2)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <motion.svg 
                    className="w-5 h-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </motion.svg>
                  01 47 85 10 00
                </motion.a>
                
                <motion.a
                  href="mailto:contact@espaceauto92.fr"
                  className="inline-flex items-center px-4 py-3 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    borderColor: "rgba(220, 38, 38, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
