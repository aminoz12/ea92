import { ARTICLES } from '@/lib/blog'
import { SectionHeading } from '../ui/SectionHeading'
import { ArticleCard } from './ArticleCard'

// Homepage teaser: the 3 latest guides (all of them are on /blog).
export function BlogSection() {
  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Entretenir sa voiture, sans se tromper de pièce"
          subtitle="Quand changer, quoi vérifier, quelle pièce choisir : nos conseils de comptoir, par écrit."
          link={{ href: '/blog', label: 'Tous les conseils' }}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.slice(0, 3).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
