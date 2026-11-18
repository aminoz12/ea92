'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/shop/ProductCard'
import { VehiclePicker } from '@/components/shop/VehiclePicker'
import { FulfilmentStrip } from '@/components/shop/FulfilmentStrip'
import { HelpBanner } from '@/components/home/HelpBanner'
import { Icon } from '@/components/ui/Icon'
import { useShop } from '@/providers/ShopProvider'
import type { PublicProduct } from '@/lib/shop/types'

export interface LandingContent {
  pill: string
  title: string
  intro: string
  bullets: string[]
  heroImage: string
  heroImageIsBanner?: boolean
  guide: { title: string; text: string }[]
  helpMessage: string
}

// "Produit d'appel" page: cheap, frequent, often urgent — the goal is to
// bring the customer to the store (or the cart) in one visit.
export function CallProductLanding({ content, products }: { content: LandingContent; products: PublicProduct[] }) {
  const { vehicle, hydrated } = useShop()
  const help = hydrated && vehicle ? `${content.helpMessage} Véhicule : ${vehicle.make} ${vehicle.model} (${vehicle.plate}).` : content.helpMessage

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-16">
        <section className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto grid items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-14">
            <div>
              <span className="inline-flex rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-gray-900">{content.pill}</span>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight lg:text-5xl">{content.title}</h1>
              <p className="mt-3 max-w-xl text-lg text-white/80">{content.intro}</p>
              <ul className="mt-5 space-y-2">
                {content.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5">
                    <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-green-400" strokeWidth={2.5} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className={content.heroImageIsBanner ? '' : 'flex justify-center'}>
              <img
                src={content.heroImage}
                alt=""
                className={content.heroImageIsBanner ? 'w-full rounded-2xl shadow-2xl' : 'h-64 w-64 rounded-3xl bg-white object-contain p-6 lg:h-80 lg:w-80'}
              />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="-mt-6 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-200 sm:p-5">
            <p className="mb-3 font-display font-bold text-gray-900">Trouvez la bonne référence avec votre plaque</p>
            <VehiclePicker />
          </div>

          <section className="mt-10">
            <h2 className="mb-5 font-display text-2xl font-extrabold text-gray-900">En stock au magasin</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>

          <section className="mt-12 grid gap-4 md:grid-cols-3">
            {content.guide.map((g) => (
              <article key={g.title} className="rounded-2xl bg-gray-50 p-6">
                <h2 className="font-display text-lg font-bold text-gray-900">{g.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{g.text}</p>
              </article>
            ))}
          </section>

          <div className="mt-12">
            <HelpBanner message={help} />
          </div>
          <div className="mt-8">
            <FulfilmentStrip />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
