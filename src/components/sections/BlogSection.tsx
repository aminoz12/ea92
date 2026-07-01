'use client'

interface Article {
  category: string
  title: string
  excerpt: string
  readTime: string
  accent: string // gradient for the card header
  icon: React.ReactNode
}

/* --- topic icons ------------------------------------------------------ */
const brakeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.5" />
    <path strokeLinecap="round" d="M12 3v3M12 18v3M3 12h3M18 12h3" />
  </svg>
)
const filterIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 4v3l5 5v7l2 1v-8l5-5V4" />
  </svg>
)
const batteryIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <rect x="3" y="7" width="18" height="11" rx="2" />
    <path strokeLinecap="round" d="M7 7V5h3v2M14 7V5h3v2M8 12h3M9.5 10.5v3M14 12h2" />
  </svg>
)
const beltIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <circle cx="8" cy="12" r="4" />
    <circle cx="17" cy="12" r="2.5" />
    <path strokeLinecap="round" d="M8 8h9M8 16h9" />
  </svg>
)
const roadIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 21l2-18M16 21l-2-18M12 6v2M12 12v2M12 18v1" />
  </svg>
)
const sunIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path strokeLinecap="round" d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
  </svg>
)

const ARTICLES: Article[] = [
  {
    category: 'Freinage',
    title: 'Plaquettes de frein : quand faut-il vraiment les changer ?',
    excerpt:
      "Bruit de grincement, pédale molle, distance de freinage qui s'allonge… Découvrez les signes qui ne trompent pas et le kilométrage moyen avant remplacement.",
    readTime: '4 min',
    accent: 'from-red-600 to-red-800',
    icon: brakeIcon,
  },
  {
    category: 'Filtration',
    title: 'Filtres auto : à quelle fréquence les remplacer ?',
    excerpt:
      "Huile, air, carburant, habitacle : chaque filtre a son rythme. Un guide simple pour préserver votre moteur et l'air que vous respirez à bord.",
    readTime: '3 min',
    accent: 'from-sky-600 to-sky-800',
    icon: filterIcon,
  },
  {
    category: 'Électricité',
    title: 'Batterie : reconnaître les signes de faiblesse avant la panne',
    excerpt:
      'Démarrage poussif, voyant allumé, batterie de plus de 4 ans… Apprenez à anticiper le remplacement pour ne jamais rester en rade.',
    readTime: '3 min',
    accent: 'from-amber-500 to-amber-700',
    icon: batteryIcon,
  },
  {
    category: 'Distribution',
    title: 'Kit de distribution : pourquoi ne jamais repousser le changement',
    excerpt:
      "Une courroie qui casse, c'est le moteur qui casse. Intervalles constructeur, pièces à changer ensemble et bons réflexes d'entretien.",
    readTime: '5 min',
    accent: 'from-gray-700 to-gray-900',
    icon: beltIcon,
  },
  {
    category: 'Voyage été',
    title: 'Grand départ en vacances : le check-up pièces avant de prendre la route',
    excerpt:
      'Freins, pneus, filtres, niveaux, éclairage : la check-list complète des pièces à vérifier avant un long trajet chargé sous la chaleur.',
    readTime: '6 min',
    accent: 'from-orange-500 to-red-600',
    icon: roadIcon,
  },
  {
    category: 'Été & confort',
    title: 'Fortes chaleurs : préparer la climatisation et le refroidissement',
    excerpt:
      "Filtre d'habitacle, gaz de clim, radiateur et liquide de refroidissement : les pièces qui protègent votre auto (et vous) quand le thermomètre grimpe.",
    readTime: '4 min',
    accent: 'from-teal-500 to-cyan-700',
    icon: sunIcon,
  },
]

const ArticleCard = ({ article }: { article: Article }) => (
  <article className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    {/* Header */}
    <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${article.accent}`}>
      <div className="absolute -right-6 -bottom-8 w-40 h-40 text-white/15">{article.icon}</div>
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
  </article>
)

export function BlogSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary-50 text-secondary-600 text-xs font-bold tracking-widest mb-4">
            LE BLOG
          </span>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
            Conseils d&apos;entretien &amp; de voyage
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Entretenir vos pièces et préparer vos trajets d&apos;été : les bons réflexes pour rouler
            en toute sérénité.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((article) => (
            <ArticleCard key={article.title} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
