'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'


interface HourItem {
  day: string
  hours: string
  isToday?: boolean
  isOpen?: boolean
}

export const CompactOpeningHours = () => {
  const [currentTime, setCurrentTime] = useState(() => new Date())
  // Time-dependent values must only render after mount, otherwise the static
  // server-prerendered HTML won't match the client and React throws a
  // hydration error. `mounted` stays false on the server + first client render.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getCurrentDay = () => {
    if (!mounted) return ''
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    return days[currentTime.getDay()]
  }

  const isCurrentlyOpen = () => {
    if (!mounted) return false
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
    // Stable placeholder before mount keeps server and client HTML identical
    if (!mounted) return '--:--:--'
    return currentTime.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 right-10 w-16 h-16 opacity-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <circle cx="50" cy="50" r="35" stroke="url(#redGradient)" strokeWidth="2" fill="none"/>
            <circle cx="50" cy="50" r="6" fill="url(#redGradient)"/>
            <defs>
              <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Compact header */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between mb-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Title and clock icon */}
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-red-600 via-red-700 to-gray-900 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              animate={{ 
                boxShadow: [
                  "0 8px 20px rgba(220, 38, 38, 0.15)",
                  "0 12px 25px rgba(220, 38, 38, 0.25)",
                  "0 8px 20px rgba(220, 38, 38, 0.15)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <motion.svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </motion.svg>
            </motion.div>
            
            <div>
              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-1"
                variants={itemVariants}
              >
                <span className="bg-gradient-to-r from-red-600 via-gray-900 to-black dark:from-white dark:via-white dark:to-white bg-clip-text text-transparent">
                  Horaires d'ouverture
                </span>
              </motion.h2>
            </div>
          </div>

          {/* Compact live time display */}
          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <motion.div
              className="bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ scale: 1.02, y: -2 }}
              animate={{
                boxShadow: [
                  "0 4px 15px rgba(0, 0, 0, 0.08)",
                  "0 8px 20px rgba(220, 38, 38, 0.1)",
                  "0 4px 15px rgba(0, 0, 0, 0.08)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="text-center">
                <motion.div 
                  className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-red-700 to-black dark:from-white dark:via-red-400 dark:to-gray-300 bg-clip-text text-transparent mb-2"
                  animate={{ scale: [1, 1.01, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {formatCurrentTime()}
                </motion.div>
                
                <motion.div
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${
                    isCurrentlyOpen() 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-green-600/30' 
                      : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-600/30'
                  }`}
                  animate={{ 
                    scale: [1, 1.02, 1],
                    boxShadow: isCurrentlyOpen() 
                      ? ["0 2px 8px rgba(22, 163, 74, 0.3)", "0 4px 12px rgba(22, 163, 74, 0.4)", "0 2px 8px rgba(22, 163, 74, 0.3)"]
                      : ["0 2px 8px rgba(220, 38, 38, 0.3)", "0 4px 12px rgba(220, 38, 38, 0.4)", "0 2px 8px rgba(220, 38, 38, 0.3)"]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 bg-white rounded-full mr-2"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  {isCurrentlyOpen() ? 'OUVERT' : 'FERMÉ'}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Compact horizontal schedule */}
        <motion.div
          className="bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3 }}
        >
          {/* Days grid - horizontal layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-600">
            {openingHours.map((item) => (
              <motion.div
                key={item.day}
                variants={itemVariants}
                className={`p-4 text-center transition-all duration-300 relative ${
                  item.isToday
                    ? 'bg-gradient-to-br from-red-50 via-gray-50 to-white dark:from-red-900/20 dark:via-gray-800/50 dark:to-black/80'
                    : 'hover:bg-gradient-to-br hover:from-gray-50 hover:to-red-50/30 dark:hover:from-gray-800/50 dark:hover:to-red-900/10'
                }`}
                whileHover={{ 
                  scale: 1.02, 
                  y: -2,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)"
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Day name */}
                <div className="mb-2">
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      className={`w-2 h-2 rounded-full shadow-sm ${
                        item.isToday
                          ? item.isOpen
                            ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-600/40'
                            : 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-600/40'
                          : 'bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-500'
                      }`}
                      animate={item.isToday ? {
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1],
                        boxShadow: item.isOpen 
                          ? ["0 0 0 0 rgba(34, 197, 94, 0.6)", "0 0 0 4px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0.6)"]
                          : ["0 0 0 0 rgba(220, 38, 38, 0.6)", "0 0 0 4px rgba(220, 38, 38, 0)", "0 0 0 0 rgba(220, 38, 38, 0.6)"]
                      } : {}}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                    <span className={`text-xs font-bold tracking-wide ${
                      item.isToday
                        ? 'bg-gradient-to-r from-red-600 to-gray-900 bg-clip-text text-transparent'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {item.day.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                  
                  {item.isToday && (
                    <motion.div
                      className="text-xs bg-gradient-to-r from-red-600 to-gray-800 text-white px-2 py-1 rounded-full mt-1 inline-block font-bold shadow-md"
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

                {/* Hours */}
                <div className={`text-xs font-bold mb-2 ${
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

                {/* Status indicator for today */}
                {item.isToday && (
                  <motion.div
                    className={`text-xs font-bold px-2 py-1 rounded-lg shadow-md border ${
                      item.isOpen
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-green-600/30 border-green-500/20'
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-600/30 border-red-500/20'
                    }`}
                    animate={{ 
                      scale: [1, 1.03, 1],
                      boxShadow: item.isOpen
                        ? ["0 2px 8px rgba(22, 163, 74, 0.3)", "0 4px 12px rgba(22, 163, 74, 0.4)", "0 2px 8px rgba(22, 163, 74, 0.3)"]
                        : ["0 2px 8px rgba(220, 38, 38, 0.3)", "0 4px 12px rgba(220, 38, 38, 0.4)", "0 2px 8px rgba(220, 38, 38, 0.3)"]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.isOpen ? '● OUVERT' : '● FERMÉ'}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Compact call to action */}
          <motion.div
            className="bg-gradient-to-r from-gray-50 via-white to-red-50/30 dark:from-gray-800/80 dark:via-black/90 dark:to-red-900/20 p-4 border-t border-gray-200/60 dark:border-gray-700/40"
            variants={itemVariants}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-8 h-8 bg-gradient-to-r from-red-600 to-gray-800 rounded-lg flex items-center justify-center shadow-md"
                  animate={{ rotate: [0, 1, -1, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <div>
                  <div className="text-sm font-bold bg-gradient-to-r from-red-600 to-gray-900 bg-clip-text text-transparent">
                    Devis ? Besoin d'aide ?
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Toujours prêts à répondre à vos besoins
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.a
                  href="tel:+33147851000"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-lg border border-red-500/20 transition-all duration-300 text-sm"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -1,
                    boxShadow: "0 8px 20px rgba(220, 38, 38, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      "0 4px 12px rgba(220, 38, 38, 0.2)",
                      "0 6px 16px rgba(220, 38, 38, 0.3)",
                      "0 4px 12px rgba(220, 38, 38, 0.2)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <motion.svg 
                    className="w-4 h-4 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </motion.svg>
                  01 47 85 10 00
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
