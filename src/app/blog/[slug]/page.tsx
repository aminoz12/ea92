import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArticleCard } from '@/components/sections/ArticleCard'
import { BlogIcon } from '@/components/ui/BlogIcon'
import { ARTICLES, getArticle } from '@/lib/blog'
import { SITE } from '@/lib/site'

// Fully static: prerender one page per article, 404 on anything else.
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }))
}
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: { title: article.title, description: article.excerpt, type: 'article' },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3)
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    'Bonjour, je souhaite un renseignement sur une pièce détachée.'
  )}`

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero */}
        <section className={`relative overflow-hidden pt-36 pb-14 bg-gradient-to-br ${article.accent}`}>
          <BlogIcon name={article.icon} className="absolute -right-10 -bottom-12 w-72 h-72 text-white/10" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Tous les conseils
            </Link>
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-wide mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white leading-tight">
              {article.title}
            </h1>
            <div className="mt-4 flex items-center gap-1.5 text-white/80 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {article.readTime} de lecture
            </div>
          </div>
        </section>

        {/* Body */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-lg text-gray-700 leading-relaxed font-medium mb-8">{article.intro}</p>

          {article.sections.map((section) => (
            <section key={section.heading} className="mb-8">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-3">
                {section.heading}
              </h2>
              {section.body.map((para, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4">
                  {para}
                </p>
              ))}
            </section>
          ))}

          {/* CTA */}
          <div className="mt-10 rounded-2xl bg-gray-50 ring-1 ring-gray-100 p-6 sm:p-8 text-center">
            <h3 className="text-xl font-display font-bold text-gray-900">
              Besoin de cette pièce ou d&apos;un conseil ?
            </h3>
            <p className="mt-2 text-gray-600">
              Notre équipe vérifie la disponibilité et vous répond rapidement.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white font-display font-bold shadow-md transition-colors"
              >
                Commander par WhatsApp
              </a>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-secondary-600 hover:bg-secondary-700 text-white font-display font-bold shadow-md transition-colors"
              >
                Appeler le {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </article>

        {/* Related */}
        <section className="py-14 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-8 text-center">
              À lire aussi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
