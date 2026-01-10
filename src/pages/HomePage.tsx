import { useRef, useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { ServicesSection } from '../components/sections/ServicesSection'
import { CarteGriseSection } from '../components/sections/CarteGriseSection'
import { TestimonialsSection } from '../components/sections/TestimonialsSection'
import { ContactSection } from '../components/sections/ContactSection'
import { FAQSection } from '../components/sections/FAQSection'
import { BrandsSection } from '../components/sections/BrandsSection'
import { CompactOpeningHours } from '../components/sections/CompactOpeningHours'
import { PartsOrderingForm } from '../components/sections/PartsOrderingForm'

export function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  // Load video only when user interacts or after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadVideo(true)
    }, 1500) // Start loading after 1.5 seconds

    // Also load video on any user interaction
    const handleUserInteraction = () => {
      if (!shouldLoadVideo) {
        setShouldLoadVideo(true)
      }
    }

    document.addEventListener('click', handleUserInteraction, { once: true })
    document.addEventListener('scroll', handleUserInteraction, { once: true })
    document.addEventListener('mousemove', handleUserInteraction, { once: true })

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('scroll', handleUserInteraction)
      document.removeEventListener('mousemove', handleUserInteraction)
    }
  }, [shouldLoadVideo])

  // Handle video load events
  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
  }

  const handleVideoError = () => {
    console.error('Video failed to load')
    setIsVideoLoaded(false)
  }

  // Optimize video playback when loaded
  useEffect(() => {
    if (videoRef.current && isVideoLoaded) {
      const video = videoRef.current
      
      // Optimize for performance
      video.style.willChange = 'transform'
      
      // Set buffer size for smoother playback
      if ('buffered' in video) {
        video.play().catch((e: Error) => console.log('Auto-play prevented:', e))
      }
      
      // Reduce quality if needed for performance
      video.setAttribute('data-optimized', 'true')
    }
  }, [isVideoLoaded])

  // Add performance monitoring
  useEffect(() => {
    if (shouldLoadVideo && !isVideoLoaded) {
      const startTime = performance.now()
      
      const checkVideoLoad = () => {
        if (isVideoLoaded) {
          const loadTime = performance.now() - startTime
          console.log(`Video loaded in ${loadTime.toFixed(2)}ms`)
        }
      }
      
      const interval = setInterval(checkVideoLoad, 100)
      return () => clearInterval(interval)
    }
  }, [shouldLoadVideo, isVideoLoaded])

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Video Background */}
        <section className="relative h-[calc(100vh-38px)] overflow-hidden">
          {/* Video placeholder background */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black video-poster">
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>
          </div>
          
          {/* Video - loads conditionally with optimizations */}
          {shouldLoadVideo && (
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
              autoPlay
              muted
              playsInline
              loop
              preload="metadata"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231e293b'/%3E%3Cstop offset='50%25' style='stop-color:%230f172a'/%3E%3Cstop offset='100%25' style='stop-color:%23000000'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23grad)'/%3E%3C/svg%3E"
              onLoadStart={handleVideoLoad}
              onCanPlay={handleVideoLoad}
              onError={handleVideoError}
              onLoadedData={handleVideoLoad}
              style={{ willChange: 'transform' }}
            >
              <source src="/vid2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          
          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center justify-center mt-[90px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {/* Main Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                <span className="block">
                  <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent anton-regular">
                    ICI TROUVEZ L'EXCELLENCE
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent anton-regular">
                    LÀ OÙ LES PRIX FONT LA DIFFÉRENCE
                  </span>
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl lg:text-3xl font-light text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed libre-franklin">
                Distributeur Pièces détachées Particuliers & Professionnels 
                <br />
                <span className="text-lg md:text-xl text-white/70">
                  Since 2017
                </span>
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={() => {
                    const servicesSection = document.getElementById('services')
                    if (servicesSection) {
                      servicesSection.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10">Découvrir nos services</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <a 
                  href="tel:0147851000"
                  className="group px-8 py-4 border-2 border-white/30 hover:border-white text-white font-bold text-lg rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    01 47 85 10 00
                  </span>
                </a>
              </div>
              
            </div>
          </div>
        </section>

        {/* Compact Opening Hours */}
        <CompactOpeningHours />

        {/* Services Section */}
        <ServicesSection />

        {/* Brands Section */}
        <BrandsSection />

        {/* Carte Grise Section */}
        <CarteGriseSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Products Section - TEMPORARILY HIDDEN */}
        {/* <ProductsSection /> */}

        {/* Parts Ordering Form - TEMPORARY REPLACEMENT */}
        <PartsOrderingForm />

        {/* FAQ Section */}
        <FAQSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}

