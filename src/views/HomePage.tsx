'use client'

import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { VehicleHero } from '../components/sections/VehicleHero'
import { ServicesSection } from '../components/sections/ServicesSection'
import { CarteGriseSection } from '../components/sections/CarteGriseSection'
import { TestimonialsSection } from '../components/sections/TestimonialsSection'
import { ContactSection } from '../components/sections/ContactSection'
import { FAQSection } from '../components/sections/FAQSection'
import { BrandsSection } from '../components/sections/BrandsSection'
import { CompactOpeningHours } from '../components/sections/CompactOpeningHours'

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero — vehicle identification + promo carousel */}
        <VehicleHero />

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

        {/* FAQ Section */}
        <FAQSection />

        {/* Contact Section */}
        <ContactSection />

        {/* Compact Opening Hours */}
        <CompactOpeningHours />
      </main>

      <Footer />
    </div>
  )
}

