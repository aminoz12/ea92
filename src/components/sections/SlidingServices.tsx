'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ServiceCard } from './ServiceCard'

const services = [
  {
    id: 'freinage',
    name: 'Freinage',
    image: '/freinage.png',
    color: 'from-red-500 to-red-600',
    description: 'Système de freinage complet, plaquettes, disques et liquide de frein'
  },
  {
    id: 'filtration',
    name: 'Filtration',
    image: '/filtrage.png',
    color: 'from-blue-500 to-blue-600',
    description: 'Filtres à air, à huile, à carburant et habitacle pour un moteur propre'
  },
  {
    id: 'embrayage',
    name: 'Embrayage',
    image: '/embriage.png',
    color: 'from-green-500 to-green-600',
    description: 'Kit embrayage complet, disque, plateau et butée pour transmission'
  },
  {
    id: 'distribution',
    name: 'Distribution',
    image: '/distribution.png',
    color: 'from-purple-500 to-purple-600',
    description: 'Courroie de distribution, pompe à eau et accessoires de timing'
  },
  {
    id: 'suspension',
    name: 'Suspension',
    image: '/suspension.png',
    color: 'from-orange-500 to-orange-600',
    description: 'Amortisseurs, ressorts, triangles et rotules de suspension'
  },
  {
    id: 'demarrage',
    name: 'Démarrage',
    image: '/demarage.png',
    color: 'from-yellow-500 to-yellow-600',
    description: 'Démarreur, alternateur, batterie et système électrique'
  },
  {
    id: 'direction',
    name: 'Direction',
    image: '/direction.png',
    color: 'from-indigo-500 to-indigo-600',
    description: 'Direction assistée, crémaillère, rotules et parallélisme'
  },
  {
    id: 'eclairage',
    name: 'Éclairage',
    image: '/eclairage.png',
    color: 'from-cyan-500 to-cyan-600',
    description: 'Phares, feux, clignotants et éclairage LED haute performance'
  },
  {
    id: 'echappement',
    name: 'Échappement',
    image: '/echappement.png',
    color: 'from-gray-500 to-gray-600',
    description: 'Ligne d\'échappement, silencieux, catalyseur et pot d\'échappement'
  },
  {
    id: 'outillage',
    name: 'Outillage',
    image: '/outilage.png',
    color: 'from-pink-500 to-pink-600',
    description: 'Outils professionnels, équipements de garage et accessoires'
  },
  {
    id: 'carrosserie',
    name: 'Carrosserie',
    image: '/carosserie.png',
    color: 'from-teal-500 to-teal-600',
    description: 'Pièces carrosserie et rénovation'
  },
  {
    id: 'vitrage',
    name: 'Vitrage',
    image: '/vitrage.png',
    color: 'from-amber-500 to-amber-600',
    description: 'Pare-brise, vitres latérales, rétroviseurs et vitrage sécurisé'
  },
  {
    id: 'carte-grise',
    name: 'Service Carte Grise',
    image: '/carte.png',
    color: 'from-emerald-500 to-emerald-600',
    description: 'Démarches administratives, immatriculation et transfert de propriété'
  },
  {
    id: 'production-cle',
    name: 'Production de Clé',
    image: '/cle.png',
    color: 'from-rose-500 to-rose-600',
    description: 'Fabrication de clés de véhicule, duplication et programmation de télécommandes',
    isNew: true
  }
]

export function SlidingServices() {
  const containerRef = useRef<HTMLDivElement>(null)
  // Scroll position and drag state live in refs so the rAF loop never triggers
  // a React re-render (the old code called setState every frame -> 60 re-renders
  // per second of all 42 cards, which caused the lag/jank).
  const scrollPosRef = useRef(0)
  const isPausedRef = useRef(false)
  const startXRef = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const cardWidth = 444 // 420px card + 24px (space-x-6) gap
  const totalWidth = cardWidth * services.length

  // Continuous auto-scroll — runs a single rAF loop for the component's lifetime
  // and drives the DOM transform directly (no per-frame setState).
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationId: number
    const scrollSpeed = 1 // pixels per frame

    const animate = () => {
      if (!isPausedRef.current) {
        let pos = scrollPosRef.current + scrollSpeed
        // Subtract one full set (content repeats every totalWidth) for a
        // seamless loop with no visible jump.
        if (pos >= totalWidth) pos -= totalWidth
        scrollPosRef.current = pos
        container.style.transform = `translateX(-${pos}px)`
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [totalWidth])

  // Touch/Mouse drag handlers (ref-based, no re-render while dragging)
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    isPausedRef.current = true
    startXRef.current = 'touches' in e ? e.touches[0].clientX : e.clientX
  }

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPausedRef.current || !containerRef.current) return

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    let pos = scrollPosRef.current - (clientX - startXRef.current)
    if (pos < 0) pos += totalWidth
    if (pos >= totalWidth) pos -= totalWidth

    scrollPosRef.current = pos
    containerRef.current.style.transform = `translateX(-${pos}px)`
    startXRef.current = clientX
  }

  const handleEnd = () => {
    isPausedRef.current = false
  }

  // Animate to a given card index, pausing the auto-scroll during the transition
  const scrollToIndex = (index: number) => {
    const container = containerRef.current
    if (!container) return

    isPausedRef.current = true
    const target = index * cardWidth
    scrollPosRef.current = target
    setCurrentIndex(index)

    container.style.transition = 'transform 0.4s ease-out'
    container.style.transform = `translateX(-${target}px)`

    window.setTimeout(() => {
      if (containerRef.current) containerRef.current.style.transition = ''
      isPausedRef.current = false
    }, 400)
  }

  const goToPrevious = () =>
    scrollToIndex(currentIndex === 0 ? services.length - 1 : currentIndex - 1)
  const goToNext = () => scrollToIndex((currentIndex + 1) % services.length)

  // Duplicate services for seamless loop
  const duplicatedServices = [...services, ...services, ...services]

  return (
    <div 
      className="relative py-8 overflow-hidden"
    >
      {/* Navigation Controls */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPrevious}
            className="p-2 bg-transparent rounded-none shadow-none hover:shadow-none transition-colors duration-200 group"
            aria-label="Service précédent"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-secondary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="p-2 bg-transparent rounded-none shadow-none hover:shadow-none transition-colors duration-200 group"
            aria-label="Service suivant"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-secondary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
      
      {/* Sliding container with proper width constraints */}
      <div className="relative w-full">
        <div
          ref={containerRef}
          className="flex space-x-6 will-change-transform cursor-grab active:cursor-grabbing select-none"
          style={{ width: 'max-content' }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          {duplicatedServices.map((service, index) => (
            <div key={`${service.id}-${index}`} className="flex-shrink-0">
              <ServiceCard 
                service={service} 
                className="w-[420px] h-96"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-secondary-600 scale-125' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            aria-label={`Aller au service ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
