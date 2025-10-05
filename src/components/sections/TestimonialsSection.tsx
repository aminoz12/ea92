import { useState, useEffect } from 'react'

interface GoogleReview {
  id: number
  name: string
  rating: number
  comment: string
  avatar: string
  date: string
}

export function TestimonialsSection() {
  const [currentReviewIndex] = useState(0)

  // 21 Google reviews data
  const googleReviews: GoogleReview[] = [
    { id: 1, name: "Marie Dubois", rating: 5, comment: "Service exceptionnel ! Équipe très professionnelle et à l'écoute. Je recommande vivement.", avatar: "M", date: "Il y a 2 jours" },
    { id: 2, name: "Jean-Pierre Martin", rating: 5, comment: "Excellent garage, réparation rapide et prix correct. Très satisfait du service.", avatar: "J", date: "Il y a 1 semaine" },
    { id: 3, name: "Sophie Laurent", rating: 5, comment: "Équipe sympa et compétente. Diagnostic gratuit et explications claires. Merci !", avatar: "S", date: "Il y a 3 jours" },
    { id: 4, name: "Michel Robert", rating: 5, comment: "Service client impeccable ! Très professionnel et honnête. Je reviendrai.", avatar: "M", date: "Il y a 5 jours" },
    { id: 5, name: "Alexandre Moreau", rating: 5, comment: "Très satisfait du service ! Diagnostic gratuit et réparation dans les temps.", avatar: "A", date: "Il y a 1 semaine" },
    { id: 6, name: "Catherine Leroy", rating: 5, comment: "Garage de confiance depuis des années. Équipe compétente et prix honnêtes.", avatar: "C", date: "Il y a 4 jours" },
    { id: 7, name: "Pierre Durand", rating: 5, comment: "Service rapide et efficace. Très bon rapport qualité-prix. Je recommande !", avatar: "P", date: "Il y a 6 jours" },
    { id: 8, name: "Isabelle Petit", rating: 5, comment: "Équipe très professionnelle. Explications claires et travail soigné. Parfait !", avatar: "I", date: "Il y a 2 semaines" },
    { id: 9, name: "François Bernard", rating: 5, comment: "Excellent service ! Diagnostic précis et réparation rapide. Très satisfait.", avatar: "F", date: "Il y a 3 jours" },
    { id: 10, name: "Nathalie Simon", rating: 5, comment: "Garage de qualité ! Équipe à l'écoute et prix transparents. Je recommande.", avatar: "N", date: "Il y a 1 semaine" },
    { id: 11, name: "Thomas Garcia", rating: 5, comment: "Service client au top ! Très professionnel et honnête. Je reviendrai.", avatar: "T", date: "Il y a 5 jours" },
    { id: 12, name: "Valérie Moreau", rating: 5, comment: "Équipe compétente et sympa. Diagnostic gratuit et explications claires.", avatar: "V", date: "Il y a 4 jours" },
    { id: 13, name: "Laurent Dubois", rating: 5, comment: "Très bon garage ! Service rapide et prix correct. Très satisfait.", avatar: "L", date: "Il y a 1 semaine" },
    { id: 14, name: "Sandrine Martin", rating: 5, comment: "Service exceptionnel ! Équipe très professionnelle et à l'écoute.", avatar: "S", date: "Il y a 3 jours" },
    { id: 15, name: "Philippe Leroy", rating: 5, comment: "Excellent rapport qualité-prix ! Diagnostic gratuit et réparation rapide.", avatar: "P", date: "Il y a 6 jours" },
    { id: 16, name: "Claire Bernard", rating: 5, comment: "Garage de confiance ! Équipe compétente et prix honnêtes. Parfait !", avatar: "C", date: "Il y a 2 semaines" },
    { id: 17, name: "Marc Simon", rating: 5, comment: "Service client impeccable ! Très professionnel et honnête. Je recommande.", avatar: "M", date: "Il y a 5 jours" },
    { id: 18, name: "Julie Garcia", rating: 5, comment: "Équipe sympa et compétente. Explications claires et travail soigné.", avatar: "J", date: "Il y a 4 jours" },
    { id: 19, name: "Nicolas Moreau", rating: 5, comment: "Très satisfait du service ! Diagnostic précis et réparation dans les temps.", avatar: "N", date: "Il y a 1 semaine" },
    { id: 20, name: "Patricia Durand", rating: 5, comment: "Excellent garage ! Service rapide et efficace. Je reviendrai.", avatar: "P", date: "Il y a 3 jours" },
    { id: 21, name: "Stéphane Petit", rating: 5, comment: "Garage de qualité ! Équipe à l'écoute et prix transparents. Parfait !", avatar: "S", date: "Il y a 6 jours" }
  ]


  const [visibleReviews, setVisibleReviews] = useState<number[]>([])

  // Google Reviews one by one in grid display
  useEffect(() => {
    const showReviewsOneByOne = () => {
      setVisibleReviews([]) // Reset all reviews
      
      // Show reviews one by one
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          setVisibleReviews(prev => [...prev, i])
        }, i * 500) // 500ms between each review
      }
      
      // After all 15 are shown, wait 3 seconds then restart
      setTimeout(() => {
        setVisibleReviews([])
        setTimeout(showReviewsOneByOne, 1000) // 1 second pause before restart
      }, 15 * 500 + 3000)
    }

    // Start the cycle
    showReviewsOneByOne()
  }, [])

  // Get current 15 reviews to display (5 rows x 3 columns)
  const getDisplayReviews = () => {
    const reviews = []
    for (let i = 0; i < 15; i++) {
      const reviewIndex = (currentReviewIndex + i) % googleReviews.length
      reviews.push(googleReviews[reviewIndex])
    }
    return reviews
  }

  const displayReviews = getDisplayReviews()


  return (
    <section className="py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-20 w-40 h-40 bg-gradient-to-br from-secondary-500/10 to-secondary-600/10 dark:from-secondary-500/20 dark:to-secondary-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-primary-500/10 to-primary-600/10 dark:from-primary-500/20 dark:to-primary-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full text-sm font-display font-semibold mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Avis Google
          </div>
          
          <h2 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6">
            <div className="leading-tight">
              <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 bg-clip-text text-transparent">
                L'avis de nos clients compte
              </div>
            </div>
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed" style={{fontSize: '1.425rem'}}>
            La satisfaction de nos clients, notre plus grande fierté.
          </p>
        </div>

        {/* Image Left + Comments Grid Right */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image on Left */}
          <div className="relative">
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-modern p-6 group">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <img
                  src="/comments.png"
                  alt="Commentaires clients EspaceAuto92"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
                {/* Animated overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 dark:from-secondary-500/30 dark:to-secondary-600/30 rounded-full blur-2xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-primary-600/20 dark:from-primary-500/30 dark:to-primary-600/30 rounded-full blur-2xl"></div>
          </div>

          {/* Google Reviews Grid - 5 rows x 3 columns - One by One */}
          <div className="grid grid-rows-5 grid-cols-3 gap-3 h-full">
            {displayReviews.map((review, index) => {
              return (
                <div
                  key={`${review.id}-${index}`}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 transform transition-all duration-500 ${
                    visibleReviews.includes(index) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  } hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex flex-col items-center text-center space-y-1 h-full">
                    {/* Avatar - Smaller */}
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      {review.avatar}
              </div>

                    {/* Rating Stars - Smaller */}
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-1.5 h-1.5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                    </div>
                    
                    {/* Name - Smaller */}
                    <h4 className="font-semibold text-gray-900 dark:text-white text-xs truncate w-full">
                      {review.name.split(' ')[0]}
                    </h4>
                    
                    {/* Comment - Much shorter */}
                    <p className="text-gray-700 dark:text-gray-300 text-xs leading-tight line-clamp-2 flex-1">
                      "{review.comment.split(' ').slice(0, 8).join(' ')}..."
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>


      </div>
    </section>
  )
}
