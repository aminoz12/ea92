import type { Metadata } from 'next'
import { CatalogView } from '@/views/shop/CatalogView'
import { getPublicCatalog } from '@/lib/shop/catalog.server'
import { isCategoryId } from '@/lib/shop/categories'

export const metadata: Metadata = {
  title: 'Boutique en ligne — pièces auto',
  description:
    'Commandez vos pièces auto en ligne chez Espace Auto 92 : retrait en magasin à Nanterre, coursier en ~1 h, expédition partout en France ou montage en garage partenaire.',
  alternates: { canonical: '/boutique' },
  // Demo catalogue: keep out of search results until real prices are wired.
  robots: { index: false, follow: true },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ''
  const categorie = one(sp.categorie)

  const initial = {
    q: one(sp.q),
    categorie: isCategoryId(categorie) ? categorie : ('' as const),
    promo: one(sp.promo) === '1',
    montage: one(sp.montage) === '1',
  }

  // Keyed on the incoming filters so header links (another department, a new
  // search) reset the view instead of keeping the previous client state.
  return <CatalogView key={JSON.stringify(initial)} products={getPublicCatalog()} initial={initial} />
}
