import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HelpBanner } from '@/components/home/HelpBanner'
import { VehicleSelector } from '@/components/shop/VehicleSelector'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Icon } from '@/components/ui/Icon'
import { isCatalogConfigured, listCarBrands, type CatalogBrand } from '@/lib/integrations/autoprecision/catalog.server'

export const metadata: Metadata = {
  title: 'Pièces par véhicule',
  description: 'Choisissez la marque, le modèle et la motorisation de votre véhicule : nous affichons uniquement les pièces qui se montent dessus.',
  alternates: { canonical: '/pieces' },
  // Supplier catalogue under test: keep these pages out of search engines for now.
  robots: { index: false, follow: false },
}

// The list of makes barely changes; re-read it every hour.
export const revalidate = 3600

const STEPS = [
  { icon: 'search', title: 'Vous choisissez votre véhicule', text: 'Marque, modèle, motorisation : trois listes, dix secondes.' },
  { icon: 'grid', title: 'Vous parcourez les familles', text: 'Freinage, filtration, distribution, embrayage… uniquement ce qui existe pour votre véhicule.' },
  { icon: 'seal-check', title: 'Chaque pièce affichée se monte', text: 'Compatibilité donnée par le catalogue TecDoc, avec les références d’origine.' },
] as const

export default async function PiecesPage() {
  let brands: CatalogBrand[] = []
  if (isCatalogConfigured()) {
    try {
      brands = await listCarBrands()
    } catch (err) {
      console.error('[pieces] catalogue unavailable', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section className="py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              as="h1"
              title="Les pièces qui se montent sur votre véhicule"
              subtitle="Sélectionnez votre véhicule : le catalogue n’affiche que les pièces compatibles."
              link={{ href: '/boutique', label: 'Toute la boutique' }}
            />

            {brands.length > 0 ? (
              <div className="overflow-hidden rounded-xl border-l-4 border-secondary-600 bg-gray-900 p-5 sm:p-7">
                <h2 className="font-display text-2xl font-bold leading-tight text-white lg:text-3xl">
                  Votre véhicule <span className="text-secondary-500">en 3 choix</span>
                </h2>
                <p className="mb-5 mt-1 text-sm text-white/70 sm:text-base">Pas besoin de la plaque : la carte grise ou le nom du modèle suffit.</p>
                <VehicleSelector brands={brands} />
              </div>
            ) : (
              <div className="rounded-xl bg-white p-6 ring-1 ring-gray-200 sm:p-8">
                <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-gray-900">
                  <Icon name="warning" weight="fill" className="h-6 w-6 shrink-0 text-secondary-600" />
                  Le catalogue par véhicule est momentanément indisponible
                </h2>
                <p className="mt-2 max-w-2xl text-gray-600">
                  Envoyez-nous votre carte grise sur WhatsApp : un vendeur vous répond avec la bonne référence et le prix. Vous pouvez aussi parcourir{' '}
                  <Link href="/boutique" className="font-semibold text-gray-900 underline underline-offset-4 hover:text-secondary-600">
                    la boutique
                  </Link>
                  .
                </p>
              </div>
            )}

            <ol className="mt-6 grid gap-px overflow-hidden rounded-xl bg-gray-200 ring-1 ring-gray-200 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4 bg-white p-5 sm:p-6">
                  <Icon name={step.icon} className="h-8 w-8 shrink-0 text-secondary-600" />
                  <div>
                    <h3 className="font-display text-lg font-bold leading-tight text-gray-900">
                      {i + 1}. {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <HelpBanner message="Bonjour, voici ma carte grise pour trouver la bonne pièce :" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
