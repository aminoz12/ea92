'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { AboutSection } from '../components/sections/AboutSection'

export function AboutPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="pt-36">
        {/* Hero Section for About Page */}
        <section className="py-20 text-white relative overflow-hidden min-h-screen flex items-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/coverabout.png)',
            }}
          />
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/50"></div>
          
          {/* Additional overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-transparent to-red-900/30"></div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl"
              animate={{ rotate: 360, scale: [1, 1.3, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
             <div className="text-center pt-20">
            </div>

            {/* Floating Automotive Parts - Left and Right Only */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Left side parts */}
              <motion.div
                className="absolute top-1/4 left-4 w-6 h-6 text-white/20"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 8v6m11-7h-6m-8 0H1"/>
                </svg>
              </motion.div>
              
              <motion.div
                className="absolute bottom-1/3 left-6 w-5 h-5 text-white/18"
                animate={{ 
                  x: [0, 5, 0],
                  y: [0, -8, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 4v4m0 8v4"/>
                </svg>
              </motion.div>
              
              <motion.div
                className="absolute top-1/2 left-3 w-4 h-4 text-white/22"
                animate={{ 
                  rotate: [0, 90, 180, 270, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                  <path d="M3 12h18m-9-9v18"/>
                </svg>
              </motion.div>
              
              {/* Right side parts */}
              <motion.div
                className="absolute top-1/3 right-4 w-6 h-6 text-white/20"
                animate={{ 
                  rotate: [0, -180, -360],
                  y: [0, -12, 0]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="12" cy="12" r="2"/>
                  <path d="M12 2v4m0 12v4m10-10h-4m-12 0H2"/>
                </svg>
              </motion.div>
              
              <motion.div
                className="absolute bottom-1/4 right-6 w-5 h-5 text-white/16"
                animate={{ 
                  x: [0, -5, 0],
                  y: [0, 8, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </motion.div>
              
              <motion.div
                className="absolute top-2/3 right-3 w-4 h-4 text-white/19"
                animate={{ 
                  y: [0, -6, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 8v6"/>
                </svg>
              </motion.div>
            </div>
            
          </div>
        </section>
        
        <AboutSection />
      </main>

      <Footer />
    </div>
  )
}
