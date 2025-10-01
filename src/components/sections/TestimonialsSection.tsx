import { useState, useEffect } from 'react'

export function TestimonialsSection() {
  const [visibleComments, setVisibleComments] = useState<number[]>([])
  const [showAll, setShowAll] = useState(false)


  // Notification-style animation cycle
  useEffect(() => {
    const cycle = () => {
      // Phase 1: Show first 5 comments one by one
      setVisibleComments([])
      setShowAll(false)
      
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          setVisibleComments(prev => [...prev, i])
        }, i * 800) // 800ms between each pop
      }
      
      // Phase 2: Wait 7 seconds, then show remaining 5 comments
      setTimeout(() => {
        for (let i = 5; i < 10; i++) {
          setTimeout(() => {
            setVisibleComments(prev => [...prev, i])
          }, (i - 5) * 800) // 800ms between each pop
        }
      }, 5 * 800 + 7000) // Wait 7 seconds after first 5
      
      // Phase 3: Show all comments for 3 seconds
      setTimeout(() => {
        setShowAll(true)
      }, 5 * 800 + 7000 + 5 * 800)
      
      // Phase 4: Hide all comments
      setTimeout(() => {
        setVisibleComments([])
        setShowAll(false)
      }, 5 * 800 + 7000 + 5 * 800 + 3000)
    }

    // Start the cycle
    cycle()
    
    // Repeat the cycle every 20 seconds (longer cycle)
    const interval = setInterval(cycle, 20000)

    return () => clearInterval(interval)
  }, [])


  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-20 w-40 h-40 bg-gradient-to-br from-secondary-500/10 to-secondary-600/10 dark:from-secondary-500/20 dark:to-secondary-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-primary-500/10 to-primary-600/10 dark:from-primary-500/20 dark:to-primary-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full text-sm font-display font-semibold mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Témoignages Clients
          </div>
          
          <h2 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6">
            <div className="leading-tight">
              <div>Ce que disent nos</div>
              <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 bg-clip-text text-transparent">
                clients satisfaits
              </div>
            </div>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Découvrez pourquoi nos clients nous font confiance pour tous leurs besoins automobiles
          </p>
        </div>

        {/* Image Left + Floating Messages Right */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Big Image on Left */}
          <div className="relative">
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-modern p-6 group">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <img
                  src="/comments.png"
                  alt="Commentaires clients EspaceAuto92"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                {/* Animated overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>
              
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 dark:from-secondary-500/30 dark:to-secondary-600/30 rounded-full blur-2xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-primary-600/20 dark:from-primary-500/30 dark:to-primary-600/30 rounded-full blur-2xl"></div>
          </div>

          {/* Notification-Style Comments - Left and Right */}
          <div className="relative h-[800px] space-y-8">
            {/* Real Google Review 1 - Marie (Right) */}
            <div className={`absolute top-0 right-0 bg-white dark:bg-gray-800 rounded-2xl shadow-modern p-4 max-w-xs transform transition-all duration-700 ${
              visibleComments.includes(0) ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'
            } ${showAll ? 'opacity-100 translate-x-0 scale-100' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    M
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm mr-2">Marie D.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">"Excellent service ! Réparation rapide et prix correct. Je recommande vivement."</p>
                </div>
              </div>
            </div>

            {/* Real Google Review 2 - Jean-Pierre (Left) */}
            <div className={`absolute top-24 left-0 bg-white dark:bg-gray-800 rounded-2xl shadow-modern p-4 max-w-xs transform transition-all duration-700 ${
              visibleComments.includes(1) ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-8 scale-95'
            } ${showAll ? 'opacity-100 translate-x-0 scale-100' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                    J
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm mr-2">Jean-Pierre M.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">"L'équipe Espace Auto 92 est très sympa et serviable. Diagnostic précis et réparation efficace."</p>
                </div>
              </div>
            </div>

            {/* Real Google Review 3 - Sophie (Left) */}
            <div className={`absolute top-64 left-8 bg-white dark:bg-gray-800 rounded-2xl shadow-modern p-4 max-w-xs transform transition-all duration-700 ${
              visibleComments.includes(2) ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-8 scale-95'
            } ${showAll ? 'opacity-100 translate-x-0 scale-100' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm mr-2">Sophie L.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">"Réparation rapide et efficace ! Prix très correct. Je reviendrai sans hésiter."</p>
                </div>
              </div>
            </div>

            {/* Real Google Review 4 - Michel (Right) */}
            <div className={`absolute top-72 right-12 bg-white dark:bg-gray-800 rounded-2xl shadow-modern p-4 max-w-xs transform transition-all duration-700 ${
              visibleComments.includes(3) ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'
            } ${showAll ? 'opacity-100 translate-x-0 scale-100' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                    M
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm mr-2">Michel R.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">"Service client impeccable ! Équipe professionnelle et à l'écoute. Très satisfait."</p>
                </div>
              </div>
            </div>

            {/* Real Google Review 5 - Alexandre (Right) */}
            <div className={`absolute top-96 right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-modern p-4 max-w-xs transform transition-all duration-700 ${
              visibleComments.includes(4) ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'
            } ${showAll ? 'opacity-100 translate-x-0 scale-100' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm mr-2">Alexandre M.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">"Très satisfait du service ! Diagnostic gratuit et réparation dans les temps. Excellent rapport qualité-prix."</p>
                </div>
              </div>
            </div>

            {/* Real Google Review 6 - Catherine (Left) */}
            <div className={`absolute top-32 left-20 bg-white dark:bg-gray-800 rounded-2xl shadow-modern p-4 max-w-xs transform transition-all duration-700 ${
              visibleComments.includes(5) ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-8 scale-95'
            } ${showAll ? 'opacity-100 translate-x-0 scale-100' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                    C
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm mr-2">Catherine B.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">"Service impeccable ! Équipe très professionnelle et à l'écoute. Je recommande vivement."</p>
                </div>
              </div>
            </div>

            {/* Real Google Review 7 - Thomas (Right) */}
            <div className={`absolute top-48 right-16 bg-white dark:bg-gray-800 rounded-2xl shadow-modern p-4 max-w-xs transform transition-all duration-700 ${
              visibleComments.includes(6) ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'
            } ${showAll ? 'opacity-100 translate-x-0 scale-100' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    T
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm mr-2">Thomas L.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">"Excellent garage ! Diagnostic précis et réparation rapide. Prix très correct. À recommander !"</p>
                </div>
              </div>
            </div>

            {/* Real Google Review 8 - Patricia (Left) */}
            <div className={`absolute top-64 left-8 bg-white dark:bg-gray-800 rounded-2xl shadow-modern p-4 max-w-xs transform transition-all duration-700 ${
              visibleComments.includes(7) ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-8 scale-95'
            } ${showAll ? 'opacity-100 translate-x-0 scale-100' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                    P
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm mr-2">Patricia M.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">"Très bon accueil et service de qualité. Réparation effectuée dans les délais. Je recommande !"</p>
                </div>
              </div>
            </div>

            {/* Real Google Review 9 - David (Right) */}
            <div className={`absolute top-80 right-24 bg-white dark:bg-gray-800 rounded-2xl shadow-modern p-4 max-w-xs transform transition-all duration-700 ${
              visibleComments.includes(8) ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'
            } ${showAll ? 'opacity-100 translate-x-0 scale-100' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                    D
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm mr-2">David K.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">"Service exceptionnel ! Équipe compétente et honnête. Prix transparents. Je reviendrai !"</p>
                </div>
              </div>
            </div>

            {/* Real Google Review 10 - Nathalie (Left) */}
            <div className={`absolute top-96 left-16 bg-white dark:bg-gray-800 rounded-2xl shadow-modern p-4 max-w-xs transform transition-all duration-700 ${
              visibleComments.includes(9) ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-8 scale-95'
            } ${showAll ? 'opacity-100 translate-x-0 scale-100' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                    N
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm mr-2">Nathalie S.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">"Parfait ! Réparation rapide et prix correct. Équipe très professionnelle. Je recommande vivement !"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-12">
            Faites-nous confiance
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
            {/* Trustpilot */}
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-2xl shadow-modern p-6 group hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <img
                src="/trustpilot.png"
                alt="Trustpilot"
                className="h-32 md:h-40 w-auto object-contain"
              />
              <div className="text-left">
                <div className="flex items-center space-x-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">4.5/5</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">sur Trustpilot</p>
              </div>
            </div>

            {/* Google */}
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-2xl shadow-modern p-6 group hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <img
                src="/googlereview.png"
                alt="Google Reviews"
                className="h-32 md:h-40 w-auto object-contain"
              />
              <div className="text-left">
                <div className="flex items-center space-x-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < 5 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">4.9/5</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">sur Google</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
