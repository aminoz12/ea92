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
    description: 'Réparation carrosserie, peinture, tôlerie et rénovation'
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
  }
]

export function SlidingServices() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const cardWidth = 450 // width of each card including gap - increased for bigger images
  const totalWidth = cardWidth * services.length

  // Auto-play animation - continuous scrolling
  useEffect(() => {
    if (isDragging) return // Only pause when actively dragging

    const container = containerRef.current
    if (!container) return

    let animationId: number
    let scrollPosition = scrollLeft
    const scrollSpeed = 1.5 // pixels per frame - smooth continuous speed

    const animate = () => {
      scrollPosition += scrollSpeed
      
      // Reset position when we've scrolled through all cards for seamless loop
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0
        setCurrentIndex(0)
      }
      
      container.style.transform = `translateX(-${scrollPosition}px)`
      setScrollLeft(scrollPosition)
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isDragging, scrollLeft, totalWidth])

  // Touch/Mouse drag handlers
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setStartX(clientX)
    if (containerRef.current) {
      setScrollLeft(parseInt(containerRef.current.style.transform.replace('translateX(-', '').replace('px)', '')) || 0)
    }
  }

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return
    
    e.preventDefault()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const x = clientX - startX
    const newScrollLeft = scrollLeft - x
    
    containerRef.current.style.transform = `translateX(-${newScrollLeft}px)`
    setScrollLeft(newScrollLeft)
    setStartX(clientX)
  }

  const handleEnd = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    // Scrolling will automatically resume when isDragging becomes false
  }

  // Navigation functions - temporarily pause scrolling
  const goToPrevious = () => {
    setIsDragging(true) // Temporarily pause scrolling
    const newIndex = currentIndex === 0 ? services.length - 1 : currentIndex - 1
    const newScrollLeft = newIndex * cardWidth
    
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.3s ease-out'
      containerRef.current.style.transform = `translateX(-${newScrollLeft}px)`
      setScrollLeft(newScrollLeft)
      setCurrentIndex(newIndex)
      
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transition = ''
        }
        setIsDragging(false) // Resume scrolling
      }, 300)
    }
  }

  const goToNext = () => {
    setIsDragging(true) // Temporarily pause scrolling
    const newIndex = (currentIndex + 1) % services.length
    const newScrollLeft = newIndex * cardWidth
    
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.3s ease-out'
      containerRef.current.style.transform = `translateX(-${newScrollLeft}px)`
      setScrollLeft(newScrollLeft)
      setCurrentIndex(newIndex)
      
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transition = ''
        }
        setIsDragging(false) // Resume scrolling
      }, 300)
    }
  }

  // removed toggleAutoPlay (unused)

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
          className="flex space-x-6 will-change-transform cursor-grab active:cursor-grabbing"
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
            onClick={() => {
              setIsDragging(true) // Temporarily pause scrolling
              const newScrollLeft = index * cardWidth
              
              if (containerRef.current) {
                containerRef.current.style.transition = 'transform 0.3s ease-out'
                containerRef.current.style.transform = `translateX(-${newScrollLeft}px)`
                setScrollLeft(newScrollLeft)
                setCurrentIndex(index)
                
                setTimeout(() => {
                  if (containerRef.current) {
                    containerRef.current.style.transition = ''
                  }
                  setIsDragging(false) // Resume scrolling
                }, 300)
              }
            }}
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
