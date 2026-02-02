import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { CompactOpeningHours } from '../components/sections/CompactOpeningHours'
import { sendEmail } from '../lib/emailService'

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDirections, setShowDirections] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Send email via API
      await sendEmail(formData.subject || 'Nouveau message de contact', formData)
      
      // Reset form and show success message
      alert('Merci pour votre message! Nous vous contacterons rapidement.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const contactInfoItems = [
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Adresse',
      content: (
        <>
          Espace Auto 92<br />
          426 Avenue de la République<br />
          92000 Nanterre, France
        </>
      ),
      gradient: 'from-red-500 to-red-600',
      href: null
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Téléphone',
      content: '01 47 85 10 00',
      gradient: 'from-green-500 to-green-600',
      href: 'tel:0147851000'
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      content: <span className="text-sm">espaceauto92.info@gmail.com</span>,
      gradient: 'from-blue-500 to-blue-600',
      href: 'mailto:espaceauto92.info@gmail.com'
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Horaires d'ouverture",
      content: (
        <>
          Lun.-Sam. : 9h - 18h30<br />
          Vendredi : 9h - 12h30 / 15h - 18h30
        </>
      ),
      gradient: 'from-purple-500 to-purple-600',
      href: null
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-20 -right-20 w-72 h-72 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4], rotate: [0, 180, 360] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-20 -left-20 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.7, 0.5], rotate: [360, 180, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="text-center"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl shadow-2xl shadow-red-500/30 mb-6">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">
                  Contactez
                </span>
                <span className="block bg-gradient-to-r from-red-600 via-red-600 to-red-700 bg-clip-text text-transparent">
                  Espace Auto 92
                </span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets automobiles.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-12 md:py-20 -mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10"
            >
              {/* Contact Information */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 h-full hover:shadow-red-500/10 transition-all duration-300">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      Informations
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                  </div>
                  
                  <div className="space-y-6">
                    {contactInfoItems.map((item, index) => {
                      const ContentComponent = item.href ? (
                        <a 
                          href={item.href}
                          className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300">
                          {item.content}
                        </p>
                      )

                      return (
                        <motion.div
                          key={index}
                          className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                          whileHover={{ x: 4 }}
                        >
                          <div className={`w-14 h-14 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                              {item.title}
                            </h4>
                            <div className="text-base leading-relaxed">
                              {ContentComponent}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      Envoyez-nous un message
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">
                      Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Nom complet <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 placeholder:text-gray-400"
                          placeholder="Jean Dupont"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 placeholder:text-gray-400"
                          placeholder="jean.dupont@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 placeholder:text-gray-400"
                        placeholder="01 23 45 67 89"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Sujet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 placeholder:text-gray-400"
                        placeholder="Demande de pièces détachées"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 resize-none placeholder:text-gray-400"
                        placeholder="Décrivez votre besoin en détail..."
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="text-red-500">*</span> Champs obligatoires
                      </p>
                      
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl shadow-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Envoi en cours...</span>
                          </>
                        ) : (
                          <>
                            <span>Envoyer le message</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Opening Hours Section */}
        <section className="py-12 md:py-16">
          <CompactOpeningHours />
        </section>

        {/* Map Section */}
        <section className="py-16 md:py-24 bg-white/50 dark:bg-gray-800/50 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            {['📍', '🗺️', '🧭', '📌'].map((emoji, index) => (
              <motion.div
                key={index}
                className="absolute text-3xl opacity-5 dark:opacity-10"
                style={{
                  left: `${15 + index * 20}%`,
                  top: `${15 + index * 25}%`,
                }}
                animate={{
                  y: [-20, -30, -20],
                  rotate: [-5, 5, -5],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 4 + index * 0.5,
                  repeat: Infinity,
                  delay: index * 0.8
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <div className="text-center mb-12 md:mb-16">
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl mb-6 shadow-2xl shadow-red-500/30"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </motion.div>
                <motion.h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight"
                  variants={itemVariants}
                >
                  <span className="block bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                    Notre Localisation
                  </span>
                </motion.h2>
                <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Retrouvez-nous facilement à Nanterre
                </motion.p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                <motion.div
                  className="relative"
                  variants={itemVariants}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 md:p-8 text-white">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">Espace Auto 92</h3>
                          <p className="text-red-100 text-sm md:text-base">426 Avenue de la République, 92000 Nanterre, France</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative h-80 md:h-96 bg-gray-200 dark:bg-gray-700">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.2847663864124!2d2.2166!3d48.8922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e664f5e1234567%3A0x1234567890abcdef!2s426%20Avenue%20de%20la%20République%2C%2092000%20Nanterre!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                        title="Carte de Nanterre - Espace Auto 92"
                      />
                    </div>

                    <motion.button
                      onClick={() => setShowDirections(!showDirections)}
                      className="absolute bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl shadow-2xl hover:shadow-red-500/50 flex items-center justify-center z-10"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{
                        boxShadow: [
                          "0 10px 25px rgba(239, 68, 68, 0.3)",
                          "0 15px 35px rgba(239, 68, 68, 0.5)",
                          "0 10px 25px rgba(239, 68, 68, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.248A1 1 0 003.746 3.27L5.586 4.614a1 1 0 001.607 3.27L3.746 2.27A1 1 0 00-1.607 3.27L2.24 6.412A2 2 0 00-2 2h11a2 2 0 002 2v10a2 2 0 002 2h11a2 2 0 002 2z" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-6"
                  variants={itemVariants}
                >
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Informations pratiques
                    </h3>
                    
                    <div className="space-y-6">
                      {contactInfoItems.map((item, index) => {
                        const ContentComponent = item.href ? (
                          <a 
                            href={item.href}
                            className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-300">
                            {item.content}
                          </p>
                        )

                        return (
                          <div key={index} className="flex items-start space-x-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                              {item.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                              <div className="text-gray-600 dark:text-gray-300">
                                {ContentComponent}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {showDirections && (
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDirections(false)}
              >
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Obtenir l'itinéraire</h3>
                    <button
                      onClick={() => setShowDirections(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { name: 'Google Maps', app: 'google', color: 'bg-blue-500 hover:bg-blue-600', icon: '🗺️' },
                      { name: 'Waze', app: 'waze', color: 'bg-purple-500 hover:bg-purple-600', icon: '🚗' },
                      { name: 'Apple Maps', app: 'apple', color: 'bg-gray-800 hover:bg-gray-900', icon: '🍎' }
                    ].map((option) => (
                      <motion.button
                        key={option.app}
                        onClick={() => {
                          const address = "426 Avenue de la République, 92000 Nanterre, France"
                          const encodedAddress = encodeURIComponent(address)
                          
                          const urls = {
                            google: `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`,
                            waze: `https://waze.com/ul?q=${encodedAddress}`,
                            apple: `http://maps.apple.com/?q=${encodedAddress}`
                          }
                          window.open(urls[option.app as keyof typeof urls], '_blank')
                          setShowDirections(false)
                        }}
                        className={`${option.color} text-white p-5 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center space-y-2`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <span className="text-sm">{option.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}