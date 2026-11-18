import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductView } from '@/views/shop/ProductView'
import { INTERNAL_PRODUCTS, getPublicCatalog, getPublicProduct } from '@/lib/shop/catalog.server'

export function generateStaticParams() {
  return INTERNAL_PRODUCTS.map((p) => ({ slug: p.slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getPublicProduct(slug)
  if (!product) return {}
  return {
    title: `${product.name} — ${product.categoryName}`,
    description: `${product.name} : ${product.offers.length} marques au choix, retrait à Nanterre, coursier ou expédition. ${product.description}`.slice(0, 160),
    alternates: { canonical: `/boutique/${product.slug}` },
    robots: { index: false, follow: true }, // demo catalogue
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getPublicProduct(slug)
  if (!product) notFound()

  // Same department first, then the other wear parts customers usually add.
  const all = getPublicCatalog().filter((p) => p.slug !== product.slug)
  const related = [
    ...all.filter((p) => p.category === product.category),
    ...all.filter((p) => p.category !== product.category && p.tags.includes('best-seller')),
  ].slice(0, 4)

  // Keyed so the selected brand/quantity reset when moving to another product.
  return <ProductView key={product.slug} product={product} related={related} />
}
