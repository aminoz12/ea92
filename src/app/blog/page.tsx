import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { ArticleCard } from '@/components/sections/ArticleCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ARTICLES } from '@/lib/blog'

export const metadata: Metadata = {
  title: "Conseils d'entretien & de voyage",
  description:
    "Guides & Conseils Auto Espace Auto 92 : conseils d'entretien, guides pratiques et astuces pour prendre soin de votre véhicule.",
  alternates: { canonical: '/blog' },
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <section className="bg-gray-50 pb-16 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Fil d’Ariane" className="mb-4 text-xs text-gray-500">
              <Link href="/" className="hover:text-gray-900">Accueil</Link>
              <span className="mx-1.5">/</span>
              <span className="text-gray-900">Conseils</span>
            </nav>
            <SectionHeading
              as="h1"
              eyebrow="Guides & conseils auto"
              title="Conseils d’entretien & de voyage"
              subtitle="Quand changer, quoi vérifier, quelle pièce choisir : nos conseils de comptoir, par écrit. Une question ? On répond aussi sur WhatsApp."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ARTICLES.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
