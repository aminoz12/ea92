'use client'

import { useState } from 'react'
import { useCatalogOffers } from './CatalogOffers'

// One position of the customer's exact car (e.g. "Avant"): the same original
// part made by several brands. The customer sees one, the one the server puts
// forward (soonest available, then the shop's brand rule, see
// lib/shop/offers.server.ts); the other brands stay one click away.
// Must sit inside a CatalogOffersProvider made with `pick`.

export interface ExactItem {
  token: string
  card: React.ReactNode
}

const GRID = 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4'

export function ExactPartGroup({ label, items }: { label: string; items: ExactItem[] }) {
  const { status, offers, pick } = useCatalogOffers()
  const [open, setOpen] = useState(false)

  const chosen = items.find((i) => i.token === pick) ?? items[0]
  // The other brands: the ones we can sell first, cheapest first, then the ones on request.
  const others = items
    .filter((i) => i !== chosen)
    .map((i, at) => ({ i, at, price: offers.get(i.token)?.priceTTC }))
    .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity) || a.at - b.at)
    .map((x) => x.i)

  return (
    <section className="mt-8 first:mt-6" aria-label={label || undefined}>
      {label && <h2 className="font-display text-xl font-bold text-gray-900">{label}</h2>}
      <div className={`${GRID} ${label ? 'mt-3' : ''}`}>
        {status === 'loading' ? (
          <div className="flex min-h-[18rem] flex-col rounded-xl border border-gray-200 bg-white p-4" aria-busy="true">
            <div className="aspect-[4/3] animate-pulse rounded-lg bg-gray-100" />
            <p className="mt-3 text-[13px] text-gray-500">Recherche de la meilleure offre chez nos fournisseurs…</p>
          </div>
        ) : (
          chosen?.card
        )}
        {open && status !== 'loading' && others.map((i) => <div key={i.token}>{i.card}</div>)}
      </div>
      {others.length > 0 && status !== 'loading' && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-3 text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-secondary-600"
        >
          {open ? 'Masquer les autres marques' : `Voir les autres marques (${others.length})`}
        </button>
      )}
    </section>
  )
}
