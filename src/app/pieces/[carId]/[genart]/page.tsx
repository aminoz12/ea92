import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HelpBanner } from '@/components/home/HelpBanner'
import { CatalogArticleCard } from '@/components/shop/CatalogArticleCard'
import { CatalogOffersProvider } from '@/components/shop/CatalogOffers'
import { CatalogVehicleBar } from '@/components/shop/CatalogVehicleBar'
import { ExactFitPrompt } from '@/components/shop/ExactFitPrompt'
import { ExactPartGroup } from '@/components/shop/ExactPartGroup'
import { Icon } from '@/components/ui/Icon'
import { CatalogError, getCar, listCarArticles, type CatalogArticle, type CatalogCar } from '@/lib/integrations/autoprecision/catalog.server'
import { areOffersLive } from '@/lib/shop/offers.server'
import { preciseFit, type PreciseFit } from '@/lib/shop/preciseFit.server'
import { comparePositions, mergePosition, parsePosition, positionLabel, type Position } from '@/lib/shop/position'

export const metadata: Metadata = {
  title: 'Pièces compatibles',
  robots: { index: false, follow: false }, // supplier catalogue under test
}

const PER_PAGE = 24

const parseId = (value: string) => (/^\d{1,9}$/.test(value) ? Number(value) : null)
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)
/** One request to the suppliers per position: the same cap as /api/catalog/offers. */
const MAX_PRICED = 30

/** The exact parts, one group per position on the car (front before rear, left before right). */
function byPosition(list: CatalogArticle[], maker: Map<string, Position>) {
  const groups = new Map<string, { label: string; position: Position; articles: CatalogArticle[] }>()
  for (const a of list) {
    const position = mergePosition(maker.get(a.token) ?? {}, parsePosition(a.side))
    const label = positionLabel(position)
    const group = groups.get(label) ?? { label, position, articles: [] }
    group.articles.push(a)
    groups.set(label, group)
  }
  return [...groups.values()].sort((x, y) => comparePositions(x.position, y.position))
}

export default async function CarArticlesPage({
  params,
  searchParams,
}: {
  params: Promise<{ carId: string; genart: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { carId: rawCar, genart: rawGenart } = await params
  const carId = parseId(rawCar)
  const genartId = parseId(rawGenart)
  if (carId === null || genartId === null) notFound()

  const query = await searchParams
  const sideFilter = first(query.cote) ?? ''
  const brandFilter = parseId(first(query.marque) ?? '')
  const page = Math.max(1, parseId(first(query.page) ?? '') ?? 1)

  let car: CatalogCar | null = null
  let articles: CatalogArticle[] = []
  try {
    ;[car, articles] = await Promise.all([getCar(carId), listCarArticles(carId, genartId)])
  } catch (err) {
    if (err instanceof CatalogError && err.status === 404) notFound()
    console.error('[pieces/articles] catalogue unavailable', err)
  }

  // The customer's exact car (plate → VIN → maker's catalogue): only the parts
  // carrying its original part number. ?tout=1 shows the whole TecDoc list.
  const fit: PreciseFit = car && articles.length ? await preciseFit(carId, genartId) : { status: 'none', reason: 'empty' }
  const showAll = first(query.tout) === '1'
  const exactOnly = fit.status === 'exact' && !showAll
  const isExact = (a: CatalogArticle) => fit.status === 'exact' && fit.tokens.has(a.token)
  const pool = exactOnly ? articles.filter(isExact) : articles
  // Exact parts: per position, one part put forward and the other brands behind a link (no filters, no pages).
  const groups = exactOnly && fit.status === 'exact' ? byPosition(pool, fit.positions) : []

  const back = `/pieces/${carId}`
  const base = `${back}/${genartId}`
  /** Link to this list with some filters changed; a filter change goes back to page 1. */
  const href = (changes: { cote?: string; marque?: number | null; page?: number; tout?: boolean }) => {
    const next = { cote: sideFilter, marque: brandFilter, page: 1, tout: showAll, ...changes }
    const qs = new URLSearchParams()
    if (next.cote) qs.set('cote', next.cote)
    if (next.marque) qs.set('marque', String(next.marque))
    if (next.page > 1) qs.set('page', String(next.page))
    if (next.tout) qs.set('tout', '1')
    const s = qs.toString()
    return s ? `${base}?${s}` : base
  }

  const title = articles[0]?.genart?.name ?? 'Pièces compatibles'
  const sides = [...new Set(pool.map((a) => a.side).filter((s): s is string => Boolean(s)))].sort((a, b) => a.localeCompare(b, 'fr'))
  const bySide = sideFilter ? pool.filter((a) => a.side === sideFilter) : pool
  const brands = [...bySide.reduce((map, a) => map.set(a.dlNr, { dlNr: a.dlNr, name: a.brand, count: (map.get(a.dlNr)?.count ?? 0) + 1 }), new Map<number, { dlNr: number; name: string; count: number }>()).values()].sort(
    (a, b) => a.name.localeCompare(b.name, 'fr'),
  )
  const filtered = brandFilter ? bySide.filter((a) => a.dlNr === brandFilter) : bySide
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const vehicleName = car ? `${car.make} ${car.model} ${car.version}` : ''

  const tab = (active: boolean) =>
    `-mb-px whitespace-nowrap border-b-2 pb-3 pt-1 text-sm font-semibold transition-colors ${active ? 'border-secondary-600 text-secondary-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        {!car ? (
          <div className="rounded-xl bg-white p-6 ring-1 ring-gray-200 sm:p-8">
            <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-gray-900">
              <Icon name="warning" weight="fill" className="h-6 w-6 shrink-0 text-secondary-600" />
              Le catalogue est momentanément indisponible
            </h1>
            <p className="mt-2 text-gray-600">
              Réessayez dans quelques minutes, ou{' '}
              <Link href="/pieces" className="font-semibold text-gray-900 underline underline-offset-4 hover:text-secondary-600">
                choisissez un autre véhicule
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <CatalogVehicleBar car={car} backTo={{ href: back, label: 'Toutes les familles' }} />

            <h1 className="mt-8 font-display text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">{title}</h1>
            {exactOnly ? (
              <div className="mt-3 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                <Icon name="seal-check" weight="fill" className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                <div className="text-[15px] leading-snug text-gray-800">
                  <p className="font-semibold text-gray-900">
                    {groups.length > 1 ? 'Les pièces exactes' : 'La pièce exacte'} pour votre {car.make} {car.model}
                  </p>
                  <p className="mt-0.5 text-gray-700">
                    Choisie{groups.length > 1 ? 's' : ''} d’après le numéro de série de votre véhicule et le catalogue du constructeur : la pièce montée d’origine, au meilleur prix
                    {groups.length > 1 ? ' pour chaque position' : ''}. Les autres marques restent disponibles.
                  </p>
                  {articles.length > pool.length && (
                    <Link href={href({ tout: true, marque: null, cote: '' })} className="mt-1.5 inline-block text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-secondary-600">
                      Voir toutes les pièces du catalogue pour ce modèle ({articles.length})
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-1 text-gray-600">
                {filtered.length} pièce{filtered.length > 1 ? 's' : ''} compatible{filtered.length > 1 ? 's' : ''} avec votre {car.make} {car.model} {car.version}.
                {fit.status === 'exact' && (
                  <>
                    {' '}
                    <Link href={href({ tout: false, marque: null, cote: '' })} className="font-semibold text-gray-900 underline underline-offset-4 hover:text-secondary-600">
                      Afficher seulement les {fit.tokens.size} pièces exactes pour votre véhicule
                    </Link>
                  </>
                )}
              </p>
            )}
            {fit.status === 'none' && fit.reason === 'no-vehicle' && <ExactFitPrompt carId={carId} genartId={genartId} />}
            {fit.status === 'no-match' && (
              <p className="mt-2 flex items-start gap-2 text-sm text-gray-600">
                <Icon name="info" weight="fill" className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                Nous n’avons pas pu confirmer la pièce d’origine de votre véhicule parmi celles-ci : en cas de doute, écrivez-nous avant de commander.
              </p>
            )}

            {exactOnly &&
              groups.map((g) => (
                <CatalogOffersProvider key={g.label} live={areOffersLive()} articles={g.articles.slice(0, MAX_PRICED).map((a) => a.token)} pick>
                  <ExactPartGroup
                    label={g.label}
                    items={g.articles.map((a) => ({ token: a.token, card: <CatalogArticleCard article={a} vehicleName={vehicleName} listHref={base} exact /> }))}
                  />
                </CatalogOffersProvider>
              ))}

            {!exactOnly && sides.length > 1 && (
              <div className="-mx-4 mt-5 overflow-x-auto border-b border-gray-200 px-4 sm:mx-0 sm:px-0">
                <nav aria-label="Côté de montage" className="flex w-max gap-6">
                  <Link href={href({ cote: '' })} className={tab(!sideFilter)} aria-current={!sideFilter ? 'page' : undefined}>
                    Tous les côtés
                  </Link>
                  {sides.map((s) => (
                    <Link key={s} href={href({ cote: s })} className={tab(sideFilter === s)} aria-current={sideFilter === s ? 'page' : undefined}>
                      {s}
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {!exactOnly && brands.length > 1 && (
              <nav aria-label="Marques" className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1.5 text-sm">
                <span className="font-semibold text-gray-900">Marque :</span>
                <Link href={href({ marque: null })} className={!brandFilter ? 'font-bold text-secondary-600' : 'text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4'}>
                  Toutes
                </Link>
                {brands.map((b) => (
                  <Link
                    key={b.dlNr}
                    href={href({ marque: b.dlNr })}
                    className={brandFilter === b.dlNr ? 'font-bold text-secondary-600' : 'text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4'}
                    aria-current={brandFilter === b.dlNr ? 'page' : undefined}
                  >
                    {b.name} <span className="text-gray-400">({b.count})</span>
                  </Link>
                ))}
              </nav>
            )}

            {exactOnly ? null : shown.length > 0 ? (
              <CatalogOffersProvider live={areOffersLive()} articles={shown.map((a) => a.token)}>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {shown.map((a) => (
                    <CatalogArticleCard key={a.token} article={a} vehicleName={vehicleName} listHref={href({ page: current })} exact={isExact(a)} />
                  ))}
                </div>
              </CatalogOffersProvider>
            ) : (
              <p className="mt-6 rounded-xl bg-white p-6 text-gray-600 ring-1 ring-gray-200">
                Aucune pièce dans le catalogue pour ce type de pièce.{' '}
                <Link href={back} className="font-semibold text-gray-900 underline underline-offset-4 hover:text-secondary-600">
                  Revenir aux familles
                </Link>
                .
              </p>
            )}

            {!exactOnly && pages > 1 && (
              <nav aria-label="Pages" className="mt-8 flex items-center justify-center gap-4 font-display text-sm font-bold">
                {current > 1 ? (
                  <Link href={href({ page: current - 1 })} className="flex h-11 items-center gap-2 rounded-lg border-2 border-gray-900 px-4 text-gray-900 hover:bg-gray-900 hover:text-white">
                    <Icon name="chevron-left" strokeWidth={2.4} className="h-4 w-4" /> Précédent
                  </Link>
                ) : null}
                <span className="font-sans text-sm font-semibold text-gray-600">
                  Page {current} sur {pages}
                </span>
                {current < pages ? (
                  <Link href={href({ page: current + 1 })} className="flex h-11 items-center gap-2 rounded-lg border-2 border-gray-900 px-4 text-gray-900 hover:bg-gray-900 hover:text-white">
                    Suivant <Icon name="chevron-right" strokeWidth={2.4} className="h-4 w-4" />
                  </Link>
                ) : null}
              </nav>
            )}

            <div className="mt-10">
              <HelpBanner message={`Bonjour, je cherche : ${title} pour ma ${vehicleName}.`} />
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
