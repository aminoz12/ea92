'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { CategoryId, PublicProduct } from '@/lib/shop/types'
import { ProductCard } from '../shop/ProductCard'
import { PlateSearchBar } from '../shop/PlateSearchBar'
import { SectionHeading } from '../ui/SectionHeading'
import { Icon } from '../ui/Icon'

// Two full rows of four on tablets and desktops (two rows of two on phones).
const SHOWN = 8

const inCategories =
  (...ids: CategoryId[]) =>
  (p: PublicProduct) =>
    ids.includes(p.category)

// Candidate tabs, in display order. A tab is only offered when it can fill
// the two rows, so the grid never shows a single or half-empty row. With the
// demo catalogue that leaves out "Freinage & trains roulants" and "Éclairage
// & visibilité" (5 products each): they appear by themselves as soon as the
// real catalogue has 8 products in them.
const TABS: { id: string; label: string; match: (p: PublicProduct) => boolean }[] = [
  { id: 'top', label: 'Meilleures ventes', match: (p) => p.tags.includes('best-seller') },
  { id: 'freinage', label: 'Freinage & trains roulants', match: inCategories('freinage', 'suspension', 'direction') },
  { id: 'entretien', label: 'Entretien & mécanique', match: inCategories('entretien', 'distribution', 'embrayage') },
  { id: 'hiver', label: 'Spécial hiver', match: (p) => p.tags.includes('hiver') || inCategories('demarrage', 'visibilite', 'eclairage')(p) },
  { id: 'eclairage', label: 'Éclairage & visibilité', match: inCategories('eclairage', 'visibilite') },
]

const discountOf = (p: PublicProduct) =>
  p.compareAtTTC && p.compareAtTTC > p.offers[0].priceTTC ? Math.round((1 - p.offers[0].priceTTC / p.compareAtTTC) * 100) : 0

// The e-shop block on the home page: plate search, then a dark seasonal
// panel next to a tabbed product grid of two full rows.
export function ShopShowcase({ products }: { products: PublicProduct[] }) {
  const [tab, setTab] = useState(TABS[0].id)
  const tabs = useMemo(
    () => TABS.map((t) => ({ id: t.id, label: t.label, items: products.filter(t.match).slice(0, SHOWN) })).filter((t) => t.items.length === SHOWN),
    [products],
  )
  // A catalogue too small for any tab still shows its first products.
  const active = tabs.find((t) => t.id === tab) ?? tabs[0]
  const visible = active?.items ?? products.slice(0, SHOWN)
  const maxDiscount = useMemo(() => Math.max(0, ...products.map(discountOf)), [products])

  return (
    <section id="boutique" className="scroll-mt-32 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Commandez en ligne, recevez comme vous voulez"
          subtitle="Prix TTC, stock du magasin en temps réel. Retrait, coursier, colis ou montage en garage."
          link={{ href: '/boutique', label: 'Toute la boutique' }}
        />

        {/* Plate search */}
        <PlateSearchBar className="mb-6" />

        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Seasonal panel */}
          <Link
            href="/boutique?promo=1"
            className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-xl bg-gray-950 p-6 text-white lg:min-h-0"
          >
            <Image
              src="/images/592ab312bd6ab00db456c4536563dd4c.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 280px, 100vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105 lg:object-[75%_50%]"
            />
            {/* Phones and tablets: wide panel, text on the left, so it darkens from the left. */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/75 to-gray-950/45 sm:to-gray-950/15 lg:hidden" />
            {/* Desktop: tall panel. Dark behind the text (top) and the link (bottom), the car stays clear in between. */}
            <div className="absolute inset-x-0 top-0 hidden h-[380px] bg-gradient-to-b from-gray-950 via-gray-950/85 via-60% to-transparent lg:block" />
            <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-gray-950/90 to-transparent lg:block" />
            <div className="relative">
              <span className="inline-block rounded-md bg-signal-500 px-2 py-1 font-display text-xs font-bold uppercase leading-none tracking-wide text-gray-900">Spécial hiver</span>
              {maxDiscount > 0 ? (
                <p className="mt-4 font-display text-5xl font-extrabold leading-none">
                  <span className="block text-base font-bold text-white/80">jusqu’à</span>−{maxDiscount} %
                </p>
              ) : (
                <p className="mt-4 font-display text-4xl font-extrabold leading-none">Petits prix</p>
              )}
              <p className="mt-3 font-display text-2xl font-bold leading-tight">Prêt pour l’hiver ?</p>
              <p className="mt-2 text-sm text-white/75">Batteries, essuie-glaces, ampoules : tout pour démarrer chaque matin.</p>
            </div>
            <span className="relative mt-6 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide">
              Voir la sélection <Icon name="arrow-right" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Tabs + grid */}
          <div className="min-w-0">
            <div className={`-mx-4 mb-4 overflow-x-auto border-b border-gray-200 px-4 sm:mx-0 sm:px-0 ${tabs.length > 1 ? '' : 'hidden'}`}>
              <div role="tablist" aria-label="Sélections" className="flex w-max gap-6">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active.id === t.id}
                    onClick={() => setTab(t.id)}
                    className={`-mb-px whitespace-nowrap border-b-2 pb-3 pt-1 text-sm font-semibold transition-colors ${
                      active.id === t.id ? 'border-secondary-600 text-secondary-600' : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Two rows everywhere: 2 × 2 on phones, 2 × 4 from tablets up */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 max-md:[&>*:nth-child(n+5)]:hidden">
              {visible.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-900 px-6 py-3 font-display font-bold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
          >
            Voir les {products.length} produits de la boutique
            <Icon name="arrow-right" className="w-4 h-4" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  )
}
