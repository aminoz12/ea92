'use client'

import Image from 'next/image'
import { POPULAR_PART_TYPES } from '@/lib/shop/partTypes'
import { useShop } from '@/providers/ShopProvider'
import { CatalogLink } from '../shop/CatalogLink'
import { PlateSearchBar } from '../shop/PlateSearchBar'
import { SectionHeading } from '../ui/SectionHeading'
import { Icon } from '../ui/Icon'

// The e-shop block on the home page: plate search, then a dark seasonal panel
// next to the part types customers ask for most.
//
// Everything here leads into the real catalogue (parts that fit the visitor's
// vehicle, prices and stock live from the suppliers). There are no product
// cards: a real article only exists for a given vehicle, so the tiles open the
// list for the vehicle on file, or the vehicle choice when there is none yet.
export function ShopShowcase() {
  const { vehicle, hydrated } = useShop()
  const known = hydrated && Boolean(vehicle?.ktype)

  return (
    <section id="boutique" className="scroll-mt-32 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Commandez en ligne, recevez comme vous voulez"
          subtitle="Les pièces qui se montent sur votre véhicule, avec le prix TTC et la disponibilité en temps réel. Retrait, coursier, colis ou montage en garage."
          link={{ href: '/boutique', label: 'Toute la boutique' }}
        />

        {/* Plate search */}
        <PlateSearchBar className="mb-6" />

        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Seasonal panel */}
          <CatalogLink className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-xl bg-gray-950 p-6 text-white lg:min-h-0">
            <Image
              src="/images/592ab312bd6ab00db456c4536563dd4c.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 280px, 100vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105 lg:object-[75%_50%]"
            />
            {/* The text sits on the left on wide panels (phones, tablets) and on top on the narrow desktop one: darken accordingly. */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/75 to-gray-950/45 sm:to-gray-950/15 lg:bg-gradient-to-b lg:from-gray-950/95 lg:via-gray-950/75 lg:to-gray-950/60" />
            <div className="relative">
              <span className="inline-block rounded-md bg-signal-500 px-2 py-1 font-display text-xs font-bold uppercase leading-none tracking-wide text-gray-900">Spécial hiver</span>
              <p className="mt-4 font-display text-2xl font-bold leading-tight">Prêt pour l’hiver ?</p>
              <p className="mt-2 text-sm text-white/75">Batteries, essuie-glaces, ampoules : tout pour démarrer chaque matin.</p>
            </div>
            <span className="relative mt-6 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide">
              Voir les pièces <Icon name="arrow-right" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </CatalogLink>

          {/* Most requested part types, one bordered grid with hairlines */}
          <div className="min-w-0">
            <h3 className="font-display text-xl font-bold text-gray-900">Les plus demandées</h3>
            <p className="mt-0.5 text-sm text-gray-500">
              {known && vehicle ? `Pour votre ${vehicle.make} ${vehicle.model}.` : 'Choisissez une pièce, puis votre véhicule : seules les pièces compatibles s’affichent.'}
            </p>
            {/* Each cell draws its own right/bottom hairline; the list overhangs the frame by 1px so the outer ones are clipped. */}
            <div className="mt-3 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
              <ul className="-mb-px -mr-px grid grid-cols-2">
                {POPULAR_PART_TYPES.map((part) => (
                  <li key={part.genart} className="border-b border-r border-gray-200">
                    <CatalogLink
                      genart={part.genart}
                      className="group flex h-full items-center justify-between gap-2 px-4 py-4 text-[15px] font-semibold leading-snug text-gray-900 hover:bg-gray-50 hover:text-secondary-600 sm:px-5"
                    >
                      {part.label}
                      <Icon name="chevron-right" strokeWidth={2.4} className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-secondary-600" />
                    </CatalogLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <CatalogLink className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-900 px-6 py-3 font-display font-bold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white">
            {known ? 'Toutes les pièces de mon véhicule' : 'Voir tout le catalogue'}
            <Icon name="arrow-right" className="w-4 h-4" strokeWidth={2.2} />
          </CatalogLink>
        </div>
      </div>
    </section>
  )
}
