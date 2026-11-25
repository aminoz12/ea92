import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HelpBanner } from '@/components/home/HelpBanner'
import { CatalogVehicleBar } from '@/components/shop/CatalogVehicleBar'
import { Icon } from '@/components/ui/Icon'
import { CatalogError, getCar, getCarFamilies, type CatalogCar, type CatalogFamily, type CatalogGenart } from '@/lib/integrations/autoprecision/catalog.server'

export const metadata: Metadata = {
  title: 'Pièces compatibles',
  robots: { index: false, follow: false }, // supplier catalogue under test
}

// What customers ask for most at the counter, matched by TecDoc name so the
// row only shows part types that exist for this vehicle.
const MOST_WANTED = [
  /^Kit de plaquettes de frein, frein à disque$/i,
  /^Disque de frein$/i,
  /^Filtre à huile$/i,
  /^Filtre à air$/i,
  /^Filtre, air de l.habitacle$/i,
  /^Balai d.essuie-glace$/i,
  /^Batterie de démarrage$/i,
  /^Kit de distribution/i,
  /^Kit d.embrayage$/i,
  /^Amortisseur$/i,
  /^Bougie d.allumage$/i,
]

const SHOWN_PER_FAMILY = 8

const parseId = (value: string) => (/^\d{1,9}$/.test(value) ? Number(value) : null)

export default async function CarPartsPage({ params }: { params: Promise<{ carId: string }> }) {
  const carId = parseId((await params).carId)
  if (carId === null) notFound()

  let car: CatalogCar | null = null
  let families: CatalogFamily[] = []
  try {
    ;[car, families] = await Promise.all([getCar(carId), getCarFamilies(carId)])
  } catch (err) {
    if (err instanceof CatalogError && err.status === 404) notFound()
    console.error('[pieces/car] catalogue unavailable', err)
  }

  const all = new Map<number, CatalogGenart>()
  for (const family of families) for (const group of family.groups) for (const g of group.genarts) all.set(g.id, g)
  const wanted = MOST_WANTED.map((re) => [...all.values()].find((g) => re.test(g.name))).filter((g): g is CatalogGenart => Boolean(g))
  const vehicleName = car ? `${car.make} ${car.model} ${car.version}` : ''

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
            <CatalogVehicleBar car={car} />

            <h1 className="mt-8 font-display text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">Pièces compatibles</h1>
            <p className="mt-1 text-gray-600">
              {all.size} types de pièces existent pour votre {car.make} {car.model}. Choisissez-en un pour voir les références qui se montent.
            </p>

            {wanted.length > 0 && (
              <section className="mt-6" aria-labelledby="most-wanted">
                <h2 id="most-wanted" className="font-display text-xl font-bold text-gray-900">
                  Les plus demandées
                </h2>
                {/* Hairlines are each cell's own right/bottom border; the list overhangs the frame by 1px so the outer ones are clipped and an incomplete last row stays white. */}
                <div className="mt-3 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
                  <ul className="-mb-px -mr-px grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {wanted.map((g) => (
                      <li key={g.id} className="border-b border-r border-gray-200">
                        <Link
                          href={`/pieces/${carId}/${g.id}`}
                          className="group flex h-full items-center justify-between gap-2 px-4 py-3.5 text-[15px] font-semibold leading-snug text-gray-900 hover:bg-gray-50 hover:text-secondary-600"
                        >
                          {g.name}
                          <Icon name="chevron-right" strokeWidth={2.4} className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-secondary-600" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            <section className="mt-10" aria-labelledby="families">
              <h2 id="families" className="font-display text-xl font-bold text-gray-900">
                Toutes les familles
              </h2>
              <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {families.map((family) => {
                  const genarts = family.groups.flatMap((group) => group.genarts).sort((a, b) => a.name.localeCompare(b.name, 'fr'))
                  const first = genarts.slice(0, SHOWN_PER_FAMILY)
                  const rest = genarts.slice(SHOWN_PER_FAMILY)
                  const link = (g: CatalogGenart) => (
                    <li key={g.id}>
                      <Link href={`/pieces/${carId}/${g.id}`} className="block py-1 text-[15px] leading-snug text-gray-700 hover:text-secondary-600 hover:underline hover:underline-offset-4">
                        {g.name}
                      </Link>
                    </li>
                  )
                  return (
                    <div key={family.nodeId} className="rounded-xl bg-white p-5 ring-1 ring-gray-200">
                      <h3 className="flex items-baseline justify-between gap-3 border-b border-gray-200 pb-2 font-display text-lg font-bold leading-tight text-gray-900">
                        {family.name}
                        <span className="shrink-0 text-sm font-semibold text-gray-500">{family.genartCount}</span>
                      </h3>
                      <ul className="mt-2">{first.map(link)}</ul>
                      {rest.length > 0 && (
                        <details className="group">
                          <summary className="mt-1 flex cursor-pointer list-none items-center gap-1 py-1 text-sm font-semibold text-gray-900 hover:text-secondary-600 [&::-webkit-details-marker]:hidden">
                            <Icon name="chevron-down" strokeWidth={2.4} className="h-4 w-4 transition-transform group-open:rotate-180" />
                            <span className="group-open:hidden">Voir les {rest.length} autres</span>
                            <span className="hidden group-open:inline">Réduire</span>
                          </summary>
                          <ul>{rest.map(link)}</ul>
                        </details>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            <div className="mt-10">
              <HelpBanner message={`Bonjour, je cherche une pièce pour ma ${vehicleName}.`} />
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
