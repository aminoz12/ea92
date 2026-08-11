import Link from 'next/link'
import { ARTICLES } from '@/lib/blog'
import { ArticleCard } from './ArticleCard'

export function BlogSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary-50 text-secondary-600 text-xs font-bold tracking-widest mb-4">
            GUIDES &amp; CONSEILS AUTO
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
            Conseils d&apos;entretien &amp; de voyage
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Conseils d&apos;entretien, guides pratiques et astuces pour prendre soin de votre
            véhicule.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {/* View all */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary-600 hover:bg-secondary-700 text-white font-display font-bold shadow-md transition-colors"
          >
            Tous les conseils
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
