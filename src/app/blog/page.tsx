import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArticleCard } from '@/components/sections/ArticleCard'
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
        <section className="pt-36 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 rounded-full bg-secondary-50 text-secondary-600 text-xs font-bold tracking-widest mb-4">
                GUIDES &amp; CONSEILS AUTO
              </span>
              <h1 className="text-3xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
                Conseils d&apos;entretien &amp; de voyage
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Conseils d&apos;entretien, guides pratiques et astuces pour prendre soin de votre
                véhicule.
              </p>
            </div>

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
