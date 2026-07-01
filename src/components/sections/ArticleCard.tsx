import Link from 'next/link'
import type { Article } from '@/lib/blog'
import { BlogIcon } from '@/components/ui/BlogIcon'

// Presentational card linking to the full article. Shared by the homepage
// blog section and the /blog index.
export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Header */}
      <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${article.accent}`}>
        <BlogIcon name={article.icon} className="absolute -right-6 -bottom-8 w-40 h-40 text-white/15" />
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-wide">
          {article.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-display font-bold text-gray-900 leading-snug group-hover:text-secondary-600 transition-colors">
          {article.title}
        </h3>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">{article.excerpt}</p>

        <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {article.readTime} de lecture
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-secondary-600">
            Lire l&apos;article
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
