import { useState } from 'react'
import { sendEmail } from '../../lib/emailService'

export function PartsOrderingForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    year: '',
    make: '',
    model: '',
    matricule: '',
    partGroup: '',
    partSubGroup: '',
    additionalInfo: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i)
  
  const makes = [
    'Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'Audi', 'BMW', 'Mercedes-Benz',
    'Ford', 'Opel', 'Toyota', 'Nissan', 'Honda', 'Mazda', 'Hyundai', 'Kia',
    'Fiat', 'Alfa Romeo', 'Lancia', 'Seat', 'Skoda', 'Mini', 'Smart', 'Dacia',
    'Suzuki', 'Mitsubishi', 'Subaru', 'Land Rover', 'Jaguar', 'Volvo', 'Saab'
  ]

  const partGroups = [
    'Moteur', 'Transmission', 'Freinage', 'Suspension', 'Direction',
    'Échappement', 'Éclairage', 'Électricité', 'Carrosserie', 'Climatisation',
    'Filtration', 'Embrayage', 'Distribution', 'Démarrage', 'Outillage'
  ]

  const partSubGroups: { [key: string]: string[] } = {
    'Moteur': ['Bloc moteur', 'Culasse', 'Pistons', 'Segments', 'Vilebrequin', 'Arbre à cames', 'Joint de culasse'],
    'Transmission': ['Boîte de vitesse', 'Embrayage', 'Cardan', 'Différentiel', 'Transmission automatique'],
    'Freinage': ['Disques de frein', 'Plaquettes', 'Étriers', 'Maître-cylindre', 'Flexible de frein'],
    'Suspension': ['Amortisseurs', 'Ressorts', 'Pivot de suspension', 'Barre stabilisatrice', 'Rotule'],
    'Direction': ['Direction assistée', 'Crémaillère', 'Vérin de direction', 'Colonne de direction'],
    'Échappement': ['Pot d\'échappement', 'Silencieux', 'Catalyseur', 'Collecteur', 'Flexibles'],
    'Éclairage': ['Phares avant', 'Feux arrière', 'Clignotants', 'Ampoules', 'Optiques'],
    'Électricité': ['Batterie', 'Alternateur', 'Démarreur', 'Bougies', 'Fusibles', 'Faisceau'],
    'Carrosserie': ['Ailes', 'Portes', 'Capot', 'Coffre', 'Pare-chocs', 'Rétroviseurs'],
    'Climatisation': ['Compresseur', 'Condenseur', 'Évaporateur', 'Filtre d\'habitacle'],
    'Filtration': ['Filtre à huile', 'Filtre à air', 'Filtre à carburant', 'Filtre d\'habitacle'],
    'Embrayage': ['Disque d\'embrayage', 'Volant moteur', 'Butée', 'Câble d\'embrayage'],
    'Distribution': ['Courroie', 'Chaîne', 'Poulies', 'Tendeurs', 'Joint spi'],
    'Démarrage': ['Démarreur', 'Batterie', 'Alternateur', 'Bougies de préchauffage'],
    'Outillage': ['Outils de diagnostic', 'Clés', 'Jacks', 'Supports moteur']
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      model: name === 'make' ? '' : prev.model,
      partSubGroup: name === 'partGroup' ? '' : prev.partSubGroup
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Send email via API
      await sendEmail('Commandez Votre Pièce', formData)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getModelsForMake = (make: string) => {
    const models: { [key: string]: string[] } = {
      'Renault': ['Clio', 'Mégane', 'Laguna', 'Scenic', 'Kadjar', 'Captur', 'Twingo', 'Zoe'],
      'Peugeot': ['208', '308', '508', '2008', '3008', '5008', 'Partner', 'Boxer'],
      'Citroën': ['C1', 'C2', 'C3', 'C4', 'C5', 'Berlingo', 'Jumpy', 'Jumper'],
      'Volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan', 'Touareg', 'Transporter', 'Caddy'],
      'Audi': ['A1', 'A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'TT'],
      'BMW': ['Série 1', 'Série 3', 'Série 5', 'X1', 'X3', 'X5', 'Z4'],
      'Mercedes-Benz': ['Classe A', 'Classe C', 'Classe E', 'GLA', 'GLC', 'GLE', 'Vito'],
      'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Transit', 'Connect'],
      'Opel': ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Vivaro', 'Movano'],
      'Toyota': ['Yaris', 'Corolla', 'Auris', 'RAV4', 'Hilux', 'Proace'],
      'Nissan': ['Micra', 'Qashqai', 'X-Trail', 'Juke', 'Navara', 'NV200'],
      'Honda': ['Jazz', 'Civic', 'CR-V', 'HR-V', 'Accord'],
      'Mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-30'],
      'Hyundai': ['i10', 'i20', 'i30', 'Tucson', 'Santa Fe', 'iLoad'],
      'Kia': ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Sorento', 'Carnival'],
      'Fiat': ['500', 'Panda', 'Tipo', 'Doblo', 'Scudo', 'Ducato'],
      'Dacia': ['Sandero', 'Logan', 'Duster', 'Jogger'],
      'Seat': ['Ibiza', 'Leon', 'Ateca', 'Arona', 'Alhambra'],
      'Skoda': ['Fabia', 'Octavia', 'Superb', 'Kodiaq', 'Karoq'],
      'Mini': ['Mini', 'Clubman', 'Countryman', 'Paceman'],
      'Smart': ['Fortwo', 'Forfour'],
      'Suzuki': ['Swift', 'Vitara', 'Jimny', 'Ignis', 'Baleno'],
      'Mitsubishi': ['ASX', 'Outlander', 'Eclipse Cross', 'L200'],
      'Subaru': ['Impreza', 'Legacy', 'Forester', 'XV', 'BRZ'],
      'Land Rover': ['Evoque', 'Discovery Sport', 'Discovery', 'Range Rover'],
      'Jaguar': ['XE', 'XF', 'XJ', 'F-Pace', 'E-Pace'],
      'Volvo': ['V40', 'S60', 'V60', 'XC60', 'XC90'],
      'Saab': ['9-3', '9-5'],
      'Alfa Romeo': ['MiTo', 'Giulietta', 'Giulia', 'Stelvio'],
      'Lancia': ['Ypsilon', 'Delta', 'Thema']
    }
    return models[make] || []
  }

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Demande envoyée avec succès !
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Nous avons bien reçu votre demande de pièce. Notre équipe vous contactera dans les plus brefs délais pour confirmer la disponibilité et le prix.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({
                  fullName: '',
                  phone: '',
                  year: '',
                  make: '',
                  model: '',
                  matricule: '',
                  partGroup: '',
                  partSubGroup: '',
                  additionalInfo: ''
                })
              }}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Nouvelle demande
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="parts-ordering" className="py-16 pb-40 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Commandez Votre Pièce
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Remplissez ce formulaire pour recevoir un devis personnalisé pour votre pièce détachée
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nom Complet *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  placeholder="Votre nom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Numéro de Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Année *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                >
                  <option value="">Sélectionnez une année</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Marque *
                </label>
                <select
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                >
                  <option value="">Sélectionnez une marque</option>
                  {makes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Modèle *
                </label>
                <select
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.make}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Choisissez d'abord une marque</option>
                  {formData.make && getModelsForMake(formData.make).map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Vehicle Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Matricule *
                </label>
                <input
                  type="text"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  placeholder="AA-123-BB"
                />
              </div>
            </div>

            {/* Parts Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Groupe de Pièce *
                </label>
                <select
                  name="partGroup"
                  value={formData.partGroup}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                >
                  <option value="">Sélectionnez un groupe</option>
                  {partGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Sous-groupe de Pièce *
                </label>
                <select
                  name="partSubGroup"
                  value={formData.partSubGroup}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.partGroup}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{formData.partGroup ? 'Sélectionnez un sous-groupe' : 'Choisissez d\'abord un groupe'}</option>
                  {partSubGroups[formData.partGroup]?.map((subGroup) => (
                    <option key={subGroup} value={subGroup}>{subGroup}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Informations Supplémentaires (optionnel)
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                placeholder="Précisez toute information utile : numéro de pièce, référence, description du problème..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
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
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
