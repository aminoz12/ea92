import { useState } from 'react'

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
      question: "Quels sont vos horaires d'ouverture ?",
      answer: "Nous sommes ouverts du lundi au vendredi de 8h00 à 18h00, le samedi de 8h00 à 12h00. Nous sommes fermés le dimanche pour vous permettre de passer du temps en famille.",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      color: "red"
    },
    {
      id: 2,
      question: "Proposez-vous une garantie sur vos pièces ?",
      answer: "Oui, toutes nos pièces sont garanties et proviennent exclusivement de fabricants agréés. Nous vous offrons une garantie complète sur la qualité et l'origine de chaque pièce.",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "blue"
    },
    {
      id: 3,
      question: "Acceptez-vous les paiements par carte ?",
      answer: "Absolument ! Nous acceptons tous les moyens de paiement : espèces, cartes bancaires, chèques et virements. Nous nous adaptons à vos préférences de paiement.",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
      color: "green"
    },
    {
      id: 4,
      question: "Combien de temps prend une réparation ?",
      answer: "Le délai dépend du type de réparation. Une réparation simple peut être effectuée en quelques heures, tandis qu'une réparation plus complexe peut nécessiter 1 à 3 jours. Nous vous informons toujours du délai estimé.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "purple"
    },
    {
      id: 5,
      question: "Faut-il prendre rendez-vous ?",
      answer: "Pour un service optimal, nous recommandons de prendre rendez-vous, surtout pour les réparations importantes. Cependant, nous acceptons aussi les clients en urgence selon nos disponibilités.",
      icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      color: "orange"
    },
    {
      id: 6,
      question: "Comment vous contacter ?",
      answer: "Vous pouvez nous contacter par téléphone au +33 1 23 45 67 89, par email à contact@espaceauto92.fr, ou simplement vous rendre directement dans nos locaux au 123 Avenue de la République à Nanterre.",
      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
      color: "teal"
    }
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 relative">
            <span className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
              Questions Fréquentes
            </span>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>
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
                  <div className="px-6 pb-6">
                    <div className="ml-16">
                      {/* Enhanced Answer Container */}
                      <div className="relative">
                        {/* Gradient Border Line */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${colors.icon.replace('bg-gradient-to-r', 'bg-gradient-to-b')} rounded-full`}></div>
                        
                        {/* Answer Content Box */}
                        <div className={`ml-6 p-6 rounded-2xl border transition-all duration-300 ${
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
                            {/* Tips or Additional Info based on question type */}
                            {item.id === 1 && (
                              <div className="flex items-center text-sm">
                                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-bold text-green-700 dark:text-green-400">Conseil:</span> 
                                <span className="ml-2 font-semibold text-gray-700 dark:text-gray-300">Appelez avant de venir pour éviter l'attente</span>
                              </div>
                            )}
                            
                            {item.id === 2 && (
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium">Garantie:</span> 
                                  <span className="ml-1">12 mois minimum</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium">Origine:</span> 
                                  <span className="ml-1">100% certifiée</span>
                                </div>
                              </div>
                            )}
                            
                            {item.id === 3 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                  <div className="w-6 h-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-sm mr-2 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">CB</span>
                                  </div>
                                  <span>Carte bancaire</span>
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                  <div className="w-6 h-4 bg-gradient-to-r from-green-600 to-green-700 rounded-sm mr-2 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">€</span>
                                  </div>
                                  <span>Espèces</span>
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                  <div className="w-6 h-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-sm mr-2 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">CH</span>
                                  </div>
                                  <span>Chèque</span>
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                  <div className="w-6 h-4 bg-gradient-to-r from-orange-600 to-orange-700 rounded-sm mr-2 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">V</span>
                                  </div>
                                  <span>Virement</span>
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                  <div className="w-7 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm mr-2 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">PP</span>
                                  </div>
                                  <span>PayPal</span>
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                  <div className="w-6 h-4 bg-gradient-to-r from-teal-600 to-teal-700 rounded-sm mr-2 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">📱</span>
                                  </div>
                                  <span>Mobile</span>
                                </div>
                              </div>
                            )}
                            
                            {item.id === 4 && (
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium">Urgent:</span> 
                                  <span className="ml-1">Même jour possible</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium">Devis:</span> 
                                  <span className="ml-1">Gratuit</span>
                                </div>
                              </div>
                            )}
                            
                            {item.id === 5 && (
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium">Réservation en ligne:</span> 
                                  <span className="ml-1">Disponible 24h/24</span>
                                </div>
                                <div className="flex items-center text-sm text-red-500 dark:text-red-400">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.856-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                  </svg>
                                  <span className="font-medium">Sans RDV:</span> 
                                  <span className="ml-1">Attente possible aux heures de pointe</span>
                                </div>
                              </div>
                            )}
                            
                            {item.id === 6 && (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  <span>Appel direct</span>
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  <span>Email 24h</span>
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                  <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-2 shadow-lg">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </div>
                                  <span>Visite libre</span>
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
              <a 
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold rounded-xl transition-all duration-300 hover:border-red-400 dark:hover:border-red-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Envoyez un message
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
