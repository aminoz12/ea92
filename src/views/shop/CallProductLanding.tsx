'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { VehiclePicker } from '@/components/shop/VehiclePicker'
import { FulfilmentStrip } from '@/components/shop/FulfilmentStrip'
import { HelpBanner } from '@/components/home/HelpBanner'
import { Icon } from '@/components/ui/Icon'
import { useShop } from '@/providers/ShopProvider'

export interface LandingContent {
  pill: string
  title: string
  intro: string
  bullets: string[]
  heroImage: string
  heroImageIsBanner?: boolean
  /** The part type of the real catalogue this page leads to (TecDoc genart, see lib/shop/partTypes). */
  catalog: { genart: number; label: string }
  guide: { title: string; text: string }[]
  helpMessage: string
}

// "Produit d'appel" page: cheap, frequent, often urgent — the goal is to
// bring the customer to the store (or the cart) in one visit.
//
// The page sells nothing by itself: once the vehicle is known it sends the
// customer to the real list of references that fit it, with live prices.
export function CallProductLanding({ content }: { content: LandingContent }) {
  const { vehicle, hydrated } = useShop()
  const known = hydrated && vehicle ? vehicle : null
  const help = known ? `${content.helpMessage} Véhicule : ${known.make} ${known.model}${known.plate ? ` (${known.plate})` : ''}.` : content.helpMessage

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

            {/* The way into the real catalogue, once the vehicle is known */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              {known?.ktype ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-600">
                    Les références qui se montent sur votre <span className="font-semibold text-gray-900">{known.make} {known.model}</span>, avec le prix et la disponibilité en temps réel.
                  </p>
                  <Link
                    href={`/pieces/${known.ktype}/${content.catalog.genart}`}
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-secondary-600 px-5 font-display text-sm font-bold text-white hover:bg-secondary-700"
                  >
                    Voir les {content.catalog.label} <Icon name="arrow-right" strokeWidth={2.4} className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Entrez votre plaque pour voir les {content.catalog.label} de votre véhicule. Pas la plaque sous la main ?{' '}
                  <Link href="/pieces" className="font-semibold text-gray-900 underline underline-offset-4 hover:text-secondary-600">
                    Choisir marque et modèle
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>

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
