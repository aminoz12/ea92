import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { AnimatedWheels, FloatingParts } from '../components/animations/AnimatedWheels'
import { SpeedLines, EnginePulse } from '../components/animations/SpeedLines'
import { AutomotiveGears } from '../components/animations/AutomotiveGears'
import { AnimatedOpeningHours } from '../components/animations/AnimatedOpeningHours'
import { ContactSection } from '../components/sections/ContactSection'

export function ProPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    siret: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    additionalInfo: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

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
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Pro account request:', formData)
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const proAdvantages = [
    {
      image: "/des-boites.png",
      title: "Stock réel disponible\nimmédiatement",
      description: "Plus de 10 000 pièces en stock, prêtes à être enlevées ou livrées. Pas de délai, pas de mauvaise surprise.",
      color: "red"
    },
    {
      image: "/livraison-express.png",
      title: "Livraison\nExpress",
      description: "Commandez par téléphone ou WhatsApp, on vous livre directement dans votre atelier, souvent dans l'heure.",
      color: "red"
    },
    {
      image: "/affordable.png",
      title: "Tarifs pros ultra\ncompétitifs",
      description: "Réservé aux professionnels de l'automobile : accédez à des prix remisés sur l'ensemble de notre catalogue.",
      color: "red"
    }
  ]


  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        icon: 'bg-gradient-to-r from-blue-500 to-blue-600',
        border: 'border-blue-200 dark:border-blue-500/30',
        text: 'text-blue-700 dark:text-blue-400'
      },
      green: {
        icon: 'bg-gradient-to-r from-green-500 to-green-600',
        border: 'border-green-200 dark:border-green-500/30',
        text: 'text-green-700 dark:text-green-400'
      },
      red: {
        icon: 'bg-gradient-to-r from-red-500 to-red-600',
        border: 'border-red-200 dark:border-red-500/30',
        text: 'text-gray-900 dark:text-gray-100'
      }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section 
          className="pt-0 pb-20 text-white relative overflow-hidden -mt-40"
          style={{
            backgroundImage: 'url(/pro.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center -320px',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/40 via-red-700/40 to-red-800/40"></div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          {/* Animated Wheels - Framer Motion */}
          <AnimatedWheels />
          
          {/* Automotive Gears */}
          <AutomotiveGears />
          
          {/* Speed Lines Effect */}
          <SpeedLines />
          
          {/* Engine Pulse Background */}
          <EnginePulse />
          
          {/* Floating Parts */}
          <FloatingParts />
          
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16 mt-[600px]">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="block">
                  <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                    Distributeur
                  </span>{" "}
                  <span className="text-white">
                    Pièces Détachées
                  </span>
                </span>
                <span className="block text-3xl md:text-4xl font-medium opacity-90 mt-4">
                  <span className="text-yellow-300 font-bold">Particuliers</span>{" "}
                  <span className="text-white">&</span>{" "}
                  <span className="text-yellow-300 font-bold">Professionnels</span>
                </span>
              </h1>
              <p className="text-2xl md:text-3xl font-light opacity-90 max-w-4xl mx-auto">
                Vous <span className="text-yellow-400 font-bold">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">réparez</span>
                </span>, on vous <span className="text-yellow-400 font-bold">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">équipe</span>
                </span>.
              </p>
              <p className="text-xl opacity-80 mt-4">
                <span className="text-red-400 font-bold">
                  <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">Prix pro</span>
                </span>, <span className="text-green-400 font-bold">
                  <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">dispo immédiate</span>
                </span>, <span className="text-blue-400 font-bold">
                  <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">service réactif</span>
                </span>.
              </p>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
              <a 
                href="tel:0147851000" 
                className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300">01 47 85 10 00</p>
                  <p className="text-sm opacity-80 text-green-300">Appelez-nous <span className="font-bold">
                    <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">maintenant</span>
                  </span></p>
                </div>
              </a>
              
              <button 
                onClick={() => {
                  const address = "426 Avenue de la République, 92000 Nanterre, France"
                  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
                  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(address)}`
                  const appleMapsUrl = `http://maps.apple.com/?q=${encodeURIComponent(address)}`
                  
                  // Show options
                  if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
                    window.open(appleMapsUrl, '_blank')
                  } else if (navigator.userAgent.includes('Android')) {
                    window.open(googleMapsUrl, '_blank')
                  } else {
                    // Desktop - show options
                    const choice = confirm('Choisir une application de navigation:\nOK = Google Maps\nAnnuler = Waze')
                    if (choice) {
                      window.open(googleMapsUrl, '_blank')
                    } else {
                      window.open(wazeUrl, '_blank')
                    }
                  }
                }}
                className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">426 <span className="font-bold">
                    <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Avenue de la République</span>
                  </span></p>
                  <p className="text-sm opacity-80 text-blue-300">92000 <span className="font-bold text-blue-400">Nanterre</span></p>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Professional Advantages */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Avantages Exclusifs PRO
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Rejoignez les nombreux garagistes qui nous font déjà confiance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {proAdvantages.map((advantage, index) => {
                const colors = getColorClasses(advantage.color)
                return (
                  <div 
                    key={index}
                    className={`group bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 ${colors.border} hover:scale-105 text-center flex flex-col h-full`}
                  >
                    <div className="flex justify-center mb-6 flex-shrink-0">
                      <div className="w-48 h-48 group-hover:scale-110 transition-transform duration-300">
                        <img 
                          src={advantage.image} 
                          alt={advantage.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <h3 className={`text-2xl font-bold mb-4 ${colors.text} group-hover:scale-105 transition-transform duration-300 flex-shrink-0 whitespace-pre-line`}>
                      {advantage.title}
                    </h3>
                    <p className="text-base font-semibold text-gray-700 dark:text-gray-200 leading-relaxed flex-grow">
                      {advantage.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Account Request Form */}
        <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Prêt à passer en mode PRO ?
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Demande d'ouverture de compte professionnel
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Raison Sociale *
                      </label>
                      <Input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="Nom de votre entreprise"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Numéro SIRET *
                      </label>
                      <Input
                        type="text"
                        name="siret"
                        value={formData.siret}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="12345678901234"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        E-mail *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="contact@votre-garage.fr"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Téléphone *
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="01 23 45 67 89"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Adresse *
                    </label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                      placeholder="123 Rue de l'Automobile"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Ville *
                      </label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="Paris"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Code Postal *
                      </label>
                      <Input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="75000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Informations Complémentaires
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                      placeholder="Type d'activité, nombre de véhicules traités par mois, besoins spécifiques..."
                    />
                  </div>

                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 text-lg rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                          <span>Envoi en cours...</span>
                        </div>
                      ) : (
                        'Envoyer ma demande'
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Demande envoyée avec succès !
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Merci de nous avoir contacté, nous reviendrons vers vous dans les plus brefs délais.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({
                        companyName: '',
                        siret: '',
                        email: '',
                        phone: '',
                        address: '',
                        city: '',
                        postalCode: '',
                        additionalInfo: '',
                      })
                    }}
                    variant="outline"
                    className="border-2 border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Nouvelle demande
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>


        {/* Animated Opening Hours */}
        <AnimatedOpeningHours />

        {/* Contact Section - Same as Index Page */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}
