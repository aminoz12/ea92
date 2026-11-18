'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/shop/ProductCard'
import { VehiclePicker } from '@/components/shop/VehiclePicker'
import { FulfilmentStrip } from '@/components/shop/FulfilmentStrip'
import { HelpBanner } from '@/components/home/HelpBanner'
import { Icon } from '@/components/ui/Icon'
import { useShop } from '@/providers/ShopProvider'
import { CATEGORIES, getCategory } from '@/lib/shop/categories'
import { isCompatible } from '@/lib/integrations/vehicle'
import { matchesQuery, preferOffer } from '@/lib/shop/search'
import type { CategoryId, PublicProduct } from '@/lib/shop/types'

type Sort = 'pertinence' | 'prix-asc' | 'prix-desc'

export interface CatalogFilters {
  q: string
  categorie: CategoryId | ''
  promo: boolean
  montage: boolean // ?montage=1 — only parts with a fixed-price fitting
}

export function CatalogView({ products, initial }: { products: PublicProduct[]; initial: CatalogFilters }) {
  const { vehicle, hydrated } = useShop()
  const [q, setQ] = useState(initial.q)
  const [cat, setCat] = useState<CategoryId | ''>(initial.categorie)
  const [promo, setPromo] = useState(initial.promo)
  const [inStore, setInStore] = useState(false)
  const [fitting, setFitting] = useState(initial.montage)
  const [onlyCompatible, setOnlyCompatible] = useState(true)
  const [brands, setBrands] = useState<string[]>([])
  const [sort, setSort] = useState<Sort>('pertinence')
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Keep the URL shareable without a server round-trip.
  useEffect(() => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (cat) params.set('categorie', cat)
    if (promo) params.set('promo', '1')
    if (fitting) params.set('montage', '1')
    const qs = params.toString()
    window.history.replaceState(null, '', qs ? `/boutique?${qs}` : '/boutique')
  }, [q, cat, promo, fitting])

  const allBrands = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.offers.map((o) => o.brand)))).sort(),
    [products],
  )

  const countsByCat = useMemo(() => {
    const m = new Map<CategoryId, number>()
    for (const p of products) m.set(p.category, (m.get(p.category) ?? 0) + 1)
    return m
  }, [products])

  const results = useMemo(() => {
    let list = products.filter((p) => matchesQuery(p, q))
    if (cat) list = list.filter((p) => p.category === cat)
    if (promo) list = list.filter((p) => p.tags.some((t) => t === 'promo' || t === 'hiver' || t === 'appel'))
    if (fitting) list = list.filter((p) => Boolean(p.fittingJob))
    if (brands.length) {
      list = list
        .filter((p) => p.offers.some((o) => brands.includes(o.brand)))
        .map((p) => preferOffer(p, (o) => brands.includes(o.brand)))
    }
    if (inStore) {
      list = list
        .filter((p) => p.offers.some((o) => o.availability === 'magasin'))
        .map((p) => preferOffer(p, (o) => o.availability === 'magasin' && (!brands.length || brands.includes(o.brand))))
    }
    if (hydrated && vehicle && onlyCompatible) list = list.filter((p) => isCompatible(p, vehicle))
    if (sort !== 'pertinence') {
      const dir = sort === 'prix-asc' ? 1 : -1
      list = [...list].sort((a, b) => dir * (a.offers[0].priceTTC - b.offers[0].priceTTC))
    }
    return list
  }, [products, q, cat, promo, fitting, brands, inStore, hydrated, vehicle, onlyCompatible, sort])

  const category = cat ? getCategory(cat) : undefined
  const activeCount = [cat, promo, inStore, fitting].filter(Boolean).length + brands.length

  const resetAll = () => {
    setQ('')
    setCat('')
    setPromo(false)
    setInStore(false)
    setFitting(false)
    setBrands([])
  }

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Rayons</h3>
        <ul className="space-y-0.5">
          <li>
            <button type="button" onClick={() => setCat('')} className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm ${!cat ? 'bg-secondary-50 font-semibold text-secondary-700' : 'text-gray-700 hover:bg-gray-50'}`}>
              Tous les rayons <span className="text-xs text-gray-400">{products.length}</span>
            </button>
          </li>
          {CATEGORIES.map((c) => {
            const n = countsByCat.get(c.id) ?? 0
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setCat(c.id)}
                  disabled={n === 0}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
                    cat === c.id ? 'bg-secondary-50 font-semibold text-secondary-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {c.name}
                  <span className="text-xs text-gray-400">{n || 'bientôt'}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Disponibilité & services</h3>
        {[
          { label: 'En stock au magasin', checked: inStore, set: setInStore },
          { label: 'Montage en garage possible', checked: fitting, set: setFitting },
          { label: 'Promos & petits prix', checked: promo, set: setPromo },
        ].map((f) => (
          <label key={f.label} className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
            <input type="checkbox" checked={f.checked} onChange={(e) => f.set(e.target.checked)} className="h-4 w-4 rounded border-gray-300 accent-secondary-600" />
            {f.label}
          </label>
        ))}
      </div>

      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Marques</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 lg:grid-cols-1">
          {allBrands.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={brands.includes(b)}
                onChange={(e) => setBrands((prev) => (e.target.checked ? [...prev, b] : prev.filter((x) => x !== b)))}
                className="h-4 w-4 rounded border-gray-300 accent-secondary-600"
              />
              {b}
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-16">
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <nav aria-label="Fil d’Ariane" className="text-xs text-gray-500">
              <Link href="/" className="hover:text-gray-900">Accueil</Link>
              <span className="mx-1.5">/</span>
              <Link href="/boutique" onClick={() => setCat('')} className="hover:text-gray-900">Boutique</Link>
              {category && (
                <>
                  <span className="mx-1.5">/</span>
                  <span className="text-gray-900">{category.name}</span>
                </>
              )}
            </nav>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-gray-900">
              {category ? category.name : q ? `Résultats pour « ${q} »` : 'La boutique Espace Auto 92'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Prix TTC · le « meilleur choix » est la marque que nous recommandons au meilleur prix · autres marques au choix
            </p>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-200 sm:p-4">
                <VehiclePicker />
              </div>
              {hydrated && vehicle && (
                <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-800 ring-1 ring-gray-200">
                  <input type="checkbox" checked={onlyCompatible} onChange={(e) => setOnlyCompatible(e.target.checked)} className="h-4 w-4 accent-secondary-600" />
                  Uniquement les pièces compatibles
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block">{filterPanel}</aside>

            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="relative min-w-[200px] flex-1">
                  <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Filtrer : plaquettes, Bosch, GDB1550…"
                    aria-label="Filtrer les produits"
                    className="h-11 w-full rounded-xl bg-gray-50 pl-9 pr-3 text-sm ring-1 ring-gray-200 outline-none focus:bg-white focus:ring-2 focus:ring-secondary-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFiltersOpen((v) => !v)}
                  aria-expanded={filtersOpen}
                  className="inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold ring-1 ring-gray-200 lg:hidden"
                >
                  <Icon name="filter" className="w-4 h-4" />
                  Filtres{activeCount ? ` (${activeCount})` : ''}
                </button>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  aria-label="Trier"
                  className="h-11 rounded-xl bg-white px-3 text-sm ring-1 ring-gray-200"
                >
                  <option value="pertinence">Meilleur choix</option>
                  <option value="prix-asc">Prix croissant</option>
                  <option value="prix-desc">Prix décroissant</option>
                </select>
              </div>

              {filtersOpen && <div className="mb-6 rounded-2xl bg-gray-50 p-4 lg:hidden">{filterPanel}</div>}

              <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
                <span>
                  {results.length} produit{results.length > 1 ? 's' : ''}
                </span>
                {activeCount + (q ? 1 : 0) > 0 && (
                  <button type="button" onClick={resetAll} className="font-semibold text-secondary-600 hover:underline">
                    Effacer les filtres
                  </button>
                )}
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {results.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center">
                  <p className="font-display text-lg font-bold text-gray-900">Pas encore en ligne… mais sûrement au magasin.</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Le catalogue en ligne s’enrichit chaque semaine. Demandez-nous : on a plus de 10 000 pièces en stock.
                  </p>
                </div>
              )}

              <div className="mt-10">
                <HelpBanner message={`Bonjour, je cherche : ${q || category?.name || 'une pièce'}${vehicle ? ` pour ma ${vehicle.make} ${vehicle.model} (${vehicle.plate})` : ''}.`} />
              </div>
            </div>
          </div>

          <div className="mt-12">
            <FulfilmentStrip />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
