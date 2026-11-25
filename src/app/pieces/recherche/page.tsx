import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HelpBanner } from '@/components/home/HelpBanner'
import { PartSearchGate } from '@/components/shop/PartSearchGate'
import { isCatalogConfigured, listCarBrands, type CatalogBrand } from '@/lib/integrations/autoprecision/catalog.server'

export const metadata: Metadata = {
  title: 'Rechercher une pièce',
  robots: { index: false, follow: false }, // search results are not pages for search engines
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ''

// The header's search box lands here with the name of a part ("plaquettes de
// frein"). A part is always looked up for a vehicle: the page asks for the
// plate first, unless the visitor's vehicle is already known, then sends them
// to that vehicle's parts, which do the search (see /pieces/[carId]).
//
// There is no search by reference on the site, on the owner's request: it
// would give away exactly what the shop does not want to give away.
export default async function PartSearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = first((await searchParams).q).replace(/\s+/g, ' ').trim().slice(0, 60)

  // For visitors without their plate: the list of makes (cached by the catalogue client).
  let brands: CatalogBrand[] = []
  if (isCatalogConfigured()) {
    try {
      brands = await listCarBrands()
    } catch (err) {
      console.error('[pieces/recherche] catalogue unavailable', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">{query ? `Recherche : « ${query} »` : 'Rechercher une pièce'}</h1>

        <PartSearchGate query={query} brands={brands} />

        <div className="mt-8">
          <HelpBanner message={query ? `Bonjour, je cherche : ${query}.` : 'Bonjour, je cherche une pièce.'} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
