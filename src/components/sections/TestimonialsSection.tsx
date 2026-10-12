interface GoogleReview {
  id: number
  name: string
  rating: number
  comment: string
  avatar: string
}

// Reviews for a PARTS STORE (magasin de pièces détachées): stock, references,
// prices, delivery, advice on the right part — not repairs/diagnostics.
const reviewsRowOne: GoogleReview[] = [
  { id: 1, name: 'Karim B.', rating: 5, comment: "Toutes mes pièces trouvées du premier coup, et à des prix vraiment imbattables !", avatar: 'K' },
  { id: 2, name: 'Sophie L.', rating: 5, comment: "Pièce commandée le matin, dispo à l'enlèvement l'après-midi. Stock énorme.", avatar: 'S' },
  { id: 3, name: 'Mehdi A.', rating: 5, comment: 'Ils connaissent les références par cœur, la bonne pièce trouvée en 2 minutes.', avatar: 'M' },
  { id: 4, name: 'Julien R.', rating: 5, comment: "Large choix en stock, jamais déçu. C'est devenu mon fournisseur de confiance.", avatar: 'J' },
  { id: 5, name: 'Nadia F.', rating: 5, comment: 'Conseils au top pour choisir la bonne pièce. Personnel hyper compétent.', avatar: 'N' },
  { id: 6, name: 'Thomas G.', rating: 5, comment: 'Le meilleur rapport qualité-prix sur les pièces détachées du 92.', avatar: 'T' },
]

const reviewsRowTwo: GoogleReview[] = [
  { id: 7, name: 'Antoine M.', rating: 5, comment: 'Commande par WhatsApp, pièce réservée et prête en quelques minutes. Pratique !', avatar: 'A' },
  { id: 8, name: 'Claire D.', rating: 5, comment: 'Pièces de qualité, exactement la bonne référence pour ma voiture. Merci !', avatar: 'C' },
  { id: 9, name: 'Yassine E.', rating: 5, comment: "Toujours du stock dispo, pas besoin d'attendre des semaines comme ailleurs.", avatar: 'Y' },
  { id: 10, name: 'Patricia V.', rating: 5, comment: "Ils ont trouvé une pièce rare que personne d'autre n'avait. Bravo l'équipe !", avatar: 'P' },
  { id: 11, name: 'Luc B.', rating: 5, comment: 'Livraison express à l\'atelier et tarifs pros vraiment compétitifs. Top !', avatar: 'L' },
  { id: 12, name: 'Sandra P.', rating: 5, comment: 'Accueil chaleureux et vrai savoir-faire sur les pièces auto. Je recommande.', avatar: 'S' },
]

const TOTAL_REVIEWS = 893
const AVERAGE_RATING = 4.9

const avatarGradients = [
  'from-rose-500 to-red-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-sky-600',
]

const GoogleLogo = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
  </svg>
)

const Stars = ({ rating, className = 'w-4 h-4' }: { rating: number; className?: string }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`${className} ${i < rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

const ReviewCard = ({ review, index }: { review: GoogleReview; index: number }) => (
  <article className="shrink-0 w-[300px] sm:w-[340px] bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-11 h-11 rounded-full bg-gradient-to-br ${
            avatarGradients[index % avatarGradients.length]
          } flex items-center justify-center text-white font-bold shrink-0`}
        >
          {review.avatar}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{review.name}</h3>
          <Stars rating={review.rating} className="w-3.5 h-3.5" />
        </div>
      </div>
      <GoogleLogo className="w-5 h-5 shrink-0" />
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
  </article>
)

// One auto-scrolling row. The list is rendered twice so the -50% translate loops
// seamlessly. Pure CSS animation -> renders as static HTML, no hydration risk.
const MarqueeRow = ({
  reviews,
  direction,
  offset = 0,
}: {
  reviews: GoogleReview[]
  direction: 'left' | 'right'
  offset?: number
}) => (
  <div className="group relative overflow-hidden marquee-mask py-2">
    <div
      className={`flex gap-5 w-max ${
        direction === 'left' ? 'animate-scroll-right-left' : 'animate-scroll-left-right'
      } group-hover:[animation-play-state:paused]`}
    >
      {[...reviews, ...reviews].map((review, i) => (
        <ReviewCard key={`${review.id}-${i}`} review={review} index={i + offset} />
      ))}
    </div>
  </div>
)

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm mb-6">
            <GoogleLogo className="w-4 h-4" />
            Avis Google vérifiés
          </div>

          <h2 className="text-3xl lg:text-4xl font-display font-bold leading-tight mb-5">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-700">
              L'avis de nos clients compte
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            La satisfaction de nos clients, notre plus grande fierté.
          </p>

          {/* Rating summary */}
          <div className="mt-8 inline-flex items-center gap-4 px-6 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-md ring-1 ring-gray-100 dark:ring-gray-700">
            <span className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
              {AVERAGE_RATING.toFixed(1)}
            </span>
            <div className="text-left">
              <Stars rating={5} className="w-4 h-4" />
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Basé sur <span className="font-semibold text-gray-700 dark:text-gray-200">{TOTAL_REVIEWS} avis</span>
              </p>
            </div>
          </div>
        </div>

        {/* Marquee rows */}
        <div className="space-y-5">
          <MarqueeRow reviews={reviewsRowOne} direction="left" offset={0} />
          <MarqueeRow reviews={reviewsRowTwo} direction="right" offset={3} />
        </div>
      </div>
    </section>
  )
}
