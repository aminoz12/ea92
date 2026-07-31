'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FAQItem {
  id: number
  question: string
  answer: string
  icon: string
  color: string
}

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "Comment puis-je retourner un article ?",
      answer: "Sauf erreur de notre part, les articles ne sont ni repris ni échangés. Pour tous articles retournés, ils doivent être dans leur emballage et état d'origine, sans aucune trace de montage ou d'usure.",
      icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
      color: "red"
    },
    {
      id: 2,
      question: "Après avoir passé commande, quel est le délai de réception ?",
      answer: "Notre boutique dispose d'un vaste stock. Si l'article est épuisé et nécessite une commande, celle-ci arrive en boutique dans un délai allant de 4h à 24h (sous réserve de disponibilité).",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "blue"
    },
    {
      id: 3,
      question: "Les pièces sont-elles garanties ?",
      answer: "Oui, l'ensemble de nos pièces est garanti 1 an, dans le respect des conditions fournisseurs.",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "green"
    },
    {
      id: 4,
      question: "Je souhaiterais avoir plus d'informations sur vos services, comment faire ?",
      answer: "Consultez notre page \"Nos Services\" et découvrez tous les bénéfices que vous pourrez tirer avec Espace Auto 92 ! Vous pouvez également nous contacter directement afin de poser vos questions, nous serons ravis de vous renseigner : 01 47 85 10 00.",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "purple"
    },
    // TEMP (Google Ads — certification en cours) : question FAQ « carte grise »
    // retirée. Décommenter ce bloc pour la restaurer après certification.
    // {
    //   id: 5,
    //   question: "Quelles sont les documents nécessaires pour la création d'une carte grise ?",
    //   answer: "Vos cartes grises et plaques d'immatriculation sont réalisés en seulement 10 minutes en magasin ou en ligne. Les documents nécessaires sont disponibles ci-dessous :",
    //   icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    //   color: "orange"
    // }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: {
        icon: 'bg-gradient-to-r from-red-500 to-red-600',
        hover: 'hover:text-red-600 dark:hover:text-red-400',
        border: 'hover:border-red-200 dark:hover:border-red-500/30',
        bg: 'hover:bg-red-50 dark:hover:bg-red-900/10'
      },
      blue: {
        icon: 'bg-gradient-to-r from-blue-500 to-blue-600',
        hover: 'hover:text-blue-600 dark:hover:text-blue-400',
        border: 'hover:border-blue-200 dark:hover:border-blue-500/30',
        bg: 'hover:bg-blue-50 dark:hover:bg-blue-900/10'
      },
      green: {
        icon: 'bg-gradient-to-r from-green-500 to-green-600',
        hover: 'hover:text-green-600 dark:hover:text-green-400',
        border: 'hover:border-green-200 dark:hover:border-green-500/30',
        bg: 'hover:bg-green-50 dark:hover:bg-green-900/10'
      },
      purple: {
        icon: 'bg-gradient-to-r from-purple-500 to-purple-600',
        hover: 'hover:text-purple-600 dark:hover:text-purple-400',
        border: 'hover:border-purple-200 dark:hover:border-purple-500/30',
        bg: 'hover:bg-purple-50 dark:hover:bg-purple-900/10'
      },
      orange: {
        icon: 'bg-gradient-to-r from-orange-500 to-orange-600',
        hover: 'hover:text-orange-600 dark:hover:text-orange-400',
        border: 'hover:border-orange-200 dark:hover:border-orange-500/30',
        bg: 'hover:bg-orange-50 dark:hover:bg-orange-900/10'
      },
      teal: {
        icon: 'bg-gradient-to-r from-teal-500 to-teal-600',
        hover: 'hover:text-teal-600 dark:hover:text-teal-400',
        border: 'hover:border-teal-200 dark:hover:border-teal-500/30',
        bg: 'hover:bg-teal-50 dark:hover:bg-teal-900/10'
      }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.red
  }

  return (
    <section id="faq" className="py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-display font-bold leading-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-700">
              FAQ
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Trouvez rapidement les réponses à vos questions les plus courantes
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqItems.map((item) => {
            const isOpen = openItems.includes(item.id)
            const colors = getColorClasses(item.color)
            
            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
                  isOpen ? 'shadow-xl' : 'hover:shadow-xl'
                } ${colors.border}`}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`w-full p-6 text-left flex items-center justify-between group transition-all duration-300 ${
                    isOpen ? colors.bg : `hover:bg-gray-50 dark:hover:bg-gray-700/50 ${colors.bg}`
                  }`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform duration-300 ${
                      isOpen ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300 ${
                        isOpen ? colors.hover.split(' ')[0].replace('hover:', '') + ' ' + colors.hover.split(' ')[1].replace('hover:', '') : colors.hover
                      }`}>
                        {item.question}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* Optional: Add a "New" badge for certain questions */}
                    {item.id === 1 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        Populaire
                      </span>
                    )}
                    <svg 
                      className={`w-6 h-6 text-gray-400 transition-all duration-300 ${
                        isOpen ? 'rotate-180 text-red-500' : 'group-hover:text-red-500'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Answer Content */}
                <div className={`transition-all duration-500 ease-in-out ${
                  isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                  <div className="px-4 sm:px-6 pb-6">
                    <div className="ml-0 sm:ml-16">
                      {/* Enhanced Answer Container */}
                      <div className="relative">
                        {/* Gradient Border Line */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${colors.icon.replace('bg-gradient-to-r', 'bg-gradient-to-b')} rounded-full`}></div>
                        
                        {/* Answer Content Box */}
                        <div className={`ml-3 sm:ml-6 p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                          isOpen 
                            ? `bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-600 shadow-lg`
                            : 'bg-transparent border-transparent'
                        }`}>
                          {/* Answer Text */}
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base mb-4">
                            {item.answer}
                          </p>
                          
                          {/* Additional Info Section */}
                          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                            {/* Return policy info */}
                            {item.id === 1 && (
                              <div className="flex items-center text-sm">
                                <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.856-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span className="font-bold text-red-700 dark:text-red-400">Important:</span> 
                                <span className="ml-2 font-semibold text-gray-700 dark:text-gray-300">Vérifiez la compatibilité avant montage</span>
                              </div>
                            )}
                            
                            {/* Delivery time info */}
                            {item.id === 2 && (
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  <span className="font-medium">Express:</span> 
                                  <span className="ml-1">4h disponible</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium">Stock:</span> 
                                  <span className="ml-1">Vaste disponible</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Warranty info */}
                            {item.id === 3 && (
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium">Garantie:</span> 
                                  <span className="ml-1">1 an minimum</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium">Conditions:</span> 
                                  <span className="ml-1">Respect fournisseurs</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Services info */}
                            {item.id === 4 && (
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  <span className="font-medium">Services:</span> 
                                  <span className="ml-1">Page dédiée</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  <span className="font-medium">Contact:</span> 
                                  <span className="ml-1">01 47 85 10 00</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Carte grise documents — TEMP retiré (Google Ads, certification en cours) ; décommenter pour restaurer */}
                            {false && item.id === 5 && (
                              <div className="flex flex-col space-y-3">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  <span className="font-medium">Rapidité:</span> 
                                  <span className="ml-1">10 minutes en magasin</span>
                                </div>
                                <div className="flex items-center text-sm text-blue-500 dark:text-blue-400">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <a 
                                    href="/documents.pdf" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="font-medium hover:underline transition-colors"
                                  >
                                    Télécharger la liste des documents nécessaires
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-8 border border-red-200/60 dark:border-red-700/40">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Vous ne trouvez pas votre réponse ?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Notre équipe est là pour vous aider ! N'hésitez pas à nous contacter directement pour toute question spécifique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+33123456789"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Appelez-nous
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold rounded-xl transition-all duration-300 hover:border-red-400 dark:hover:border-red-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Envoyez un message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
