import React, { useState } from 'react'
import { useLocale } from '../../hooks/useLocale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export function ContactSection() {
  const { t } = useLocale()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDirectionsModal, setShowDirectionsModal] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Form submitted:', formData)
    setIsSubmitting(false)
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    })
  }

  const openDirections = (app: 'google' | 'waze' | 'apple') => {
    const address = "123 Avenue de la République, 92000 Nanterre, France"
    const encodedAddress = encodeURIComponent(address)
    
    switch (app) {
      case 'google':
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank')
        break
      case 'waze':
        window.open(`https://waze.com/ul?q=${encodedAddress}`, '_blank')
        break
      case 'apple':
        window.open(`http://maps.apple.com/?q=${encodedAddress}`, '_blank')
        break
    }
    setShowDirectionsModal(false)
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl mb-6 shadow-red">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Map and Contact Information */}
          <div className="space-y-10">
            {/* Live Map */}
            <Card className="card-modern shadow-red hover:shadow-red-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 p-8">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-secondary-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                      Notre localisation
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                      Trouvez-nous facilement à Nanterre
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative w-full h-96 rounded-b-2xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2621.123456789!2d2.213749!3d48.896563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0xe8a5e27333b66803!2sEspace+Auto+92!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-b-2xl"
                    title="Localisation EspaceAuto92 - 123 Avenue de la République, 92000 Nanterre"
                  ></iframe>
                  
                  {/* Map overlay with address */}
                  <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">Espace Auto 92</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">123 Avenue de la République<br/>92000 Nanterre, France</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Directions Button */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
                  <button
                    onClick={() => setShowDirectionsModal(true)}
                    className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-display font-semibold rounded-xl shadow-red hover:shadow-red-lg transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Obtenir l'itinéraire
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information - Modernized */}
            <Card className="card-modern shadow-red hover:shadow-red-lg border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-8">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                      Informations de contact
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                      N'hésitez pas à nous contacter pour toute question
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Working Hours */}
                <div className="group flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-semibold text-gray-900 dark:text-white text-lg mb-1">Horaires d'ouverture</p>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      <span className="font-medium">Lundi - Vendredi:</span> 8h00 - 18h00<br/>
                      <span className="font-medium">Samedi:</span> 8h00 - 12h00<br/>
                      <span className="font-medium text-red-600 dark:text-red-400">Dimanche:</span> Fermé
                    </p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="group flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-semibold text-gray-900 dark:text-white text-lg mb-1">Téléphone</p>
                    <a 
                      href="tel:+33123456789" 
                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-lg font-medium transition-colors group-hover:underline"
                    >
                      +33 1 23 45 67 89
                    </a>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Appelez-nous pour un devis gratuit</p>
                  </div>
                </div>

                {/* Email */}
                <div className="group flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-semibold text-gray-900 dark:text-white text-lg mb-1">Email</p>
                    <a 
                      href="mailto:contact@espaceauto92.fr" 
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-lg font-medium transition-colors group-hover:underline"
                    >
                      contact@espaceauto92.fr
                    </a>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Réponse sous 24h garantie</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form - Modernized */}
          <Card className="card-modern shadow-red hover:shadow-red-lg border-0">
            <CardHeader className="bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 p-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                    Envoyez-nous un message
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                    Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-display font-semibold text-gray-900 dark:text-white">
                      {t('contact.form.name')} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-12 px-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 dark:focus:ring-secondary-800 transition-all duration-300"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-display font-semibold text-gray-900 dark:text-white">
                      {t('contact.form.email')} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 px-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 dark:focus:ring-secondary-800 transition-all duration-300"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-display font-semibold text-gray-900 dark:text-white">
                      {t('contact.form.phone')}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-12 px-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 dark:focus:ring-secondary-800 transition-all duration-300"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-display font-semibold text-gray-900 dark:text-white">
                      {t('contact.form.subject')} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="h-12 px-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 dark:focus:ring-secondary-800 transition-all duration-300"
                      placeholder="Sujet de votre message"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-display font-semibold text-gray-900 dark:text-white">
                    {t('contact.form.message')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 dark:focus:ring-secondary-800 dark:bg-gray-800 dark:text-gray-100 transition-all duration-300 resize-none"
                    placeholder="Décrivez votre demande en détail..."
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-display font-semibold text-lg rounded-xl shadow-red hover:shadow-red-lg transition-all duration-300 transform hover:scale-[1.02] group"
                    loading={isSubmitting}
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      {t('contact.form.send')}
                    </span>
                  </Button>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Vos données sont protégées et ne seront jamais partagées
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Directions Modal - Modernized */}
        {showDirectionsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-white">
                        Choisir une application
                      </h3>
                      <p className="text-secondary-100 text-sm">Sélectionnez votre app de navigation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDirectionsModal(false)}
                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Google Maps */}
                <button
                  onClick={() => openDirections('google')}
                  className="w-full flex items-center p-5 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/30 dark:hover:to-red-800/30 rounded-2xl transition-all duration-300 group shadow-md hover:shadow-lg"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-display font-bold text-gray-900 dark:text-white text-lg">Google Maps</p>
                    <p className="text-gray-600 dark:text-gray-300">Navigation et trafic en temps réel</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Waze */}
                <button
                  onClick={() => openDirections('waze')}
                  className="w-full flex items-center p-5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 rounded-2xl transition-all duration-300 group shadow-md hover:shadow-lg"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-display font-bold text-gray-900 dark:text-white text-lg">Waze</p>
                    <p className="text-gray-600 dark:text-gray-300">Navigation communautaire</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Apple Maps */}
                <button
                  onClick={() => openDirections('apple')}
                  className="w-full flex items-center p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-2xl transition-all duration-300 group shadow-md hover:shadow-lg"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-display font-bold text-gray-900 dark:text-white text-lg">Apple Maps</p>
                    <p className="text-gray-600 dark:text-gray-300">Navigation native iOS</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

