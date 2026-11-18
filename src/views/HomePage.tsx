'use client'

import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { VehicleHero } from '../components/sections/VehicleHero'
// TEMP (Google Ads — certification en cours) : section « Carte Grise & Plaque »
// retirée. Décommenter cet import + le <CarteGriseSection /> plus bas pour restaurer.
// import { CarteGriseSection } from '../components/sections/CarteGriseSection'
import { TestimonialsSection } from '../components/sections/TestimonialsSection'
import { FAQSection } from '../components/sections/FAQSection'
import { BrandsSection } from '../components/sections/BrandsSection'
import { BlogSection } from '../components/sections/BlogSection'
import { FulfilmentStrip } from '../components/shop/FulfilmentStrip'
import { CategoryGrid } from '../components/shop/CategoryGrid'
import { SectionHeading } from '../components/ui/SectionHeading'
import { PromoSection } from '../components/home/PromoSection'
import { ServicesSection } from '../components/home/ServicesSection'
import { ShopShowcase } from '../components/home/ShopShowcase'
import { SaleBanners } from '../components/home/SaleBanners'
import { GarageFittingPromo } from '../components/home/GarageFittingPromo'
import { HelpBanner } from '../components/home/HelpBanner'
import { StoreSection } from '../components/home/StoreSection'
import type { PublicProduct } from '@/lib/shop/types'

// Home — PARTICULIERS only (the PRO offer lives on /pro, reached from the
// header switch and the "Vous êtes un pro ?" link).
// Order: quote card + promo carousel (WhatsApp) → 4 ways to receive a part →
// BUY (promos → departments → e-shop → category offers + help) →
// SERVICES (services → fitting) → TRUST (reviews → store → brands) →
// HELP (FAQ → guides). Backgrounds alternate white / gray-50 in this order.
export function HomePage({ products }: { products: PublicProduct[] }) {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero — "Je commande ma pièce !" (→ WhatsApp) + promo carousel, unchanged */}
        <VehicleHero />

        {/* 4 ways to get a part */}
        {/* Every section below uses the same rhythm (py-10 lg:py-14) and
            alternates white / gray-50 backgrounds. */}
        <section className="pt-8 lg:pt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FulfilmentStrip />
          </div>
        </section>

        {/* Promos of the moment: seasonal banners + crossed-out prices */}
        <PromoSection products={products} />

        {/* Departments */}
        <section className="bg-gray-50 py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Toutes les pièces pour votre voiture"
              link={{ href: '/boutique', label: 'Voir la boutique' }}
            />
            <CategoryGrid />
          </div>
        </section>

        {/* --- BUY: products, then category offers + help choosing --- */}
        <ShopShowcase products={products} />

        <section className="bg-gray-50 py-10 lg:py-14">
          <div className="max-w-7xl mx-auto space-y-4 px-4 sm:px-6 lg:px-8">
            <SaleBanners products={products} />
            <HelpBanner />
          </div>
        </section>

        {/* --- SERVICES: what we do around the part, then fitting --- */}
        <ServicesSection />
        <GarageFittingPromo />

        {/* --- TRUST: reviews, the physical store, the brands --- */}
        <TestimonialsSection />
        <StoreSection />
        <BrandsSection />

        {/* Carte Grise Section — TEMP retirée (Google Ads, certification en cours) */}
        {/* <CarteGriseSection /> */}

        {/* --- HELP: FAQ, then guides --- */}
        <FAQSection />

        <BlogSection />
      </main>

      <Footer />
    </div>
  )
}
