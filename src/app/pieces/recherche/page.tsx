import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HelpBanner } from '@/components/home/HelpBanner'
import { CatalogArticleCard } from '@/components/shop/CatalogArticleCard'
import { CatalogOffersProvider } from '@/components/shop/CatalogOffers'
import { Icon } from '@/components/ui/Icon'
import { isCatalogConfigured, searchArticles, type CatalogArticle } from '@/lib/integrations/autoprecision/catalog.server'
import { areOffersLive } from '@/lib/shop/offers.server'

export const metadata: Metadata = {
  title: 'Recherche par référence',
  robots: { index: false, follow: false }, // search results are not pages for search engines
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ''

// The header's search box. The catalogue is searched by reference (part
// number, original-equipment number, EAN), not by words: to browse by kind of
// part the customer picks a vehicle. A reference says nothing about the fit,
// so the cards ask the customer to check it.
export default async function ReferenceSearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = first((await searchParams).q).trim().slice(0, 40)

  let articles: CatalogArticle[] = []
  let unavailable = !isCatalogConfigured()
  if (query.length >= 3 && !unavailable) {
    try {
      articles = await searchArticles(query)
    } catch (err) {
      console.error('[pieces/recherche] catalogue unavailable', err)
      unavailable = true
    }
  }
  const listHref = `/pieces/recherche?q=${encodeURIComponent(query)}`

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">Recherche par référence</h1>

        {unavailable ? (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-white p-6 text-gray-700 ring-1 ring-gray-200">
            <Icon name="warning" weight="fill" className="mt-0.5 h-5 w-5 shrink-0 text-secondary-600" />
            La recherche est momentanément indisponible. Réessayez dans quelques minutes.
          </p>
        ) : query.length < 3 ? (
          <p className="mt-2 text-gray-600">Saisissez une référence d’au moins 3 caractères dans la barre de recherche : référence de pièce (ex. GDB1677), référence d’origine constructeur ou code-barres.</p>
        ) : (
          <p className="mt-1 text-gray-600">
            {articles.length > 0
              ? `${articles.length} référence${articles.length > 1 ? 's' : ''} pour « ${query} ». Vérifiez la compatibilité avec votre véhicule avant de commander.`
              : `Aucune référence trouvée pour « ${query} ».`}
          </p>
        )}

        {articles.length > 0 && (
          <CatalogOffersProvider live={areOffersLive()} articles={articles.map((a) => ({ artNr: a.artNr, dlNr: a.dlNr }))}>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {articles.map((a) => (
                <CatalogArticleCard key={a.id} article={a} listHref={listHref} />
              ))}
            </div>
          </CatalogOffersProvider>
        )}

        {/* The way to the part when the customer has no reference */}
        <div className="mt-8 rounded-xl bg-white p-5 ring-1 ring-gray-200 sm:p-6">
          <p className="font-display text-xl font-bold text-gray-900">Vous n’avez pas la référence ?</p>
          <p className="mt-1 text-gray-600">La recherche fonctionne avec une référence, pas avec le nom d’une pièce. Choisissez votre véhicule : le catalogue affiche les pièces qui se montent dessus.</p>
          <Link href="/pieces" className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-secondary-600 px-6 font-display font-bold text-white hover:bg-secondary-700">
            Choisir mon véhicule <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2.4} />
          </Link>
        </div>

        <div className="mt-8">
          <HelpBanner message={query ? `Bonjour, je cherche la référence ${query}.` : 'Bonjour, je cherche une pièce.'} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
