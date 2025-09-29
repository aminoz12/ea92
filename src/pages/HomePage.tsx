import React, { useState, useRef } from 'react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { ServicesSection } from '../components/sections/ServicesSection'
import { ProductsSection } from '../components/sections/ProductsSection'
import { CarteGriseSection } from '../components/sections/CarteGriseSection'
import { TestimonialsSection } from '../components/sections/TestimonialsSection'
import { ContactSection } from '../components/sections/ContactSection'
import { ModernHero } from '../components/sections/ModernHero'

export function HomePage() {
  const [showHero, setShowHero] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoEnd = () => {
    setShowHero(true)
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Video Background */}
        <section className="relative h-screen overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
          >
            <source src="/vid2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Modern Hero - Shows when video ends */}
          {showHero && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
              {/* Modern Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Animated geometric shapes */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-secondary-500/10 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-red-500/10 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full animate-pulse delay-500"></div>
                <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-yellow-500/10 rounded-full animate-pulse delay-700"></div>
                
                {/* Floating automotive elements */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary-400/30 rounded-full animate-bounce delay-300"></div>
                <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-red-400/30 rounded-full animate-bounce delay-700"></div>
                <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-blue-400/30 rounded-full animate-bounce delay-1000"></div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                
                {/* Radial gradient overlay */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-secondary-500/5 to-transparent"></div>
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-secondary-500/5 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-red-500/5 to-transparent rounded-full blur-3xl"></div>
              </div>
              
              <ModernHero />
            </div>
          )}
        </section>

        {/* Services Section */}
        <ServicesSection />

        {/* Carte Grise Section */}
        <CarteGriseSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Products Section */}
        <ProductsSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}

