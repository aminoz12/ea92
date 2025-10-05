import { motion } from 'framer-motion'

export function AboutSection() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  const stats = [
    { number: '14+', label: 'Années d\'expérience', icon: '📅' },
    { number: '5000+', label: 'Clients satisfaits', icon: '😊' },
    { number: '50K+', label: 'Pièces en stock', icon: '🔧' },
    { number: '24/7', label: 'Service client', icon: '📞' }
  ]

  const values = [
    {
      icon: '🎯',
      title: 'Expertise Technique',
      description: 'Plus de 14 ans d\'expérience dans l\'automobile avec une équipe de techniciens certifiés.'
    },
    {
      icon: '⚡',
      title: 'Rapidité',
      description: 'Service express et livraison rapide pour minimiser l\'immobilisation de votre véhicule.'
    },
    {
      icon: '💎',
      title: 'Qualité Garantie',
      description: 'Pièces d\'origine et de qualité équivalente avec garantie constructeur.'
    },
    {
      icon: '🤝',
      title: 'Confiance',
      description: 'Relation de confiance avec nos clients depuis 2010, transparence et conseils honnêtes.'
    }
  ]


  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs */}
        <motion.div
          className="absolute top-20 -right-20 w-60 h-60 bg-gradient-to-br from-red-500/15 to-red-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4], rotate: [0, 180, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-blue-500/15 to-blue-600/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        
        {/* Additional floating elements */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-2xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-green-400/10 to-teal-500/10 rounded-full blur-2xl"
          animate={{ y: [0, 15, 0], x: [0, -10, 0], scale: [1, 0.9, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >

          {/* Enhanced Company Story */}
          <motion.div variants={itemVariants} className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                {/* Background decorative elements */}
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-red-500/5 to-red-600/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-full blur-2xl"></div>
                
                <div className="relative">
                  <motion.h3 
                    className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      À propos de nous
                    </span>
                  </motion.h3>
                  
                  <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      Créé en 2017, <strong className="text-gray-800 dark:text-gray-200 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-100 bg-clip-text text-transparent">Espace Auto 92</strong> est avant tout une entreprise de passionnés d'automobile.
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      Depuis nos débuts, notre objectif est simple : fournir des pièces de <strong className="text-red-600 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">qualité</strong> rapidement, 
                      tout en offrant un <strong className="text-red-600 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">service fiable</strong> et <strong className="text-red-600 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">honnête</strong> à nos clients.
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      Avec le temps, nous avons gagné la <strong className="text-gray-800 dark:text-gray-200 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-100 bg-clip-text text-transparent">confiance</strong> de nombreux garages et particuliers grâce à notre <strong className="text-red-600 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">réactivité</strong>, notre <strong className="text-red-600 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">stock complet</strong> et notre <strong className="text-red-600 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">expertise technique</strong>.
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      Aujourd'hui, notre équipe de <strong className="text-gray-800 dark:text-gray-200 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-100 bg-clip-text text-transparent">techniciens certifiés</strong> continue de mettre tout son savoir-faire au service de la région parisienne — avec une priorité : vous <strong className="text-red-600 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">dépanner vite, bien et au juste prix</strong>.
                    </motion.p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                {/* Enhanced card design */}
                <motion.div 
                  className="bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-800/40 rounded-3xl p-10 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="w-full h-80 rounded-2xl overflow-hidden shadow-2xl"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <img 
                        src="/excellence.png" 
                        alt="Excellence Reconnue - Certifications et qualité"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Enhanced floating elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-xl"
                  animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  ⭐
                </motion.div>
                <motion.div
                  className="absolute -bottom-6 -left-6 w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-xl"
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✓
                </motion.div>
                
                {/* Additional decorative elements */}
                <motion.div
                  className="absolute top-1/4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-60"
                  animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-1/4 -right-4 w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full opacity-60"
                  animate={{ y: [0, 10, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Enhanced Statistics */}
          <motion.div variants={itemVariants} className="mb-24">
            <div className="text-center mb-12">
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Nos Chiffres Clés
              </motion.h3>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Plus de 14 ans d'excellence au service de nos clients
              </motion.p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <div className="relative">
                    {/* Background glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20 group-hover:shadow-2xl transition-all duration-300">
                      {/* Icon with enhanced animation */}
                      <motion.div 
                        className="text-5xl mb-4"
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {stat.icon}
                      </motion.div>
                      
                      {/* Number with counter animation */}
                      <motion.div 
                        className="text-4xl md:text-5xl font-black text-red-600 dark:text-red-400 mb-3"
                        initial={{ scale: 0.5 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                      >
                        {stat.number}
                      </motion.div>
                      
                      <div className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-semibold">
                        {stat.label}
                      </div>
                      
                      {/* Decorative line */}
                      <motion.div
                        className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto mt-4 rounded-full"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Values */}
          <motion.div variants={itemVariants} className="mb-24">
            <div className="text-center mb-16">
              <motion.h3 
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Nos Valeurs
                </span>
              </motion.h3>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Les principes qui guident notre travail au quotidien et 
                <span className="font-semibold text-gray-800 dark:text-gray-200"> façonnent notre excellence</span>
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="text-center group h-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <div className="relative h-full flex flex-col">
                    {/* Background glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 group-hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                      {/* Enhanced icon with animation */}
                      <motion.div 
                        className="text-5xl mb-4 flex-shrink-0"
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {value.icon}
                      </motion.div>
                      
                      <motion.h4 
                        className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex-shrink-0"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                      >
                        {value.title}
                      </motion.h4>
                      
                      <motion.p 
                        className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow text-sm"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                      >
                        {value.description}
                      </motion.p>
                      
                      {/* Decorative line */}
                      <motion.div
                        className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto mt-4 rounded-full flex-shrink-0"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.6 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>


          {/* Enhanced Call to Action */}
          <motion.div variants={itemVariants} className="mt-20">
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-600/10 to-red-500/5 rounded-3xl blur-xl"></div>
              
              <motion.div 
                className="relative bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-xl rounded-3xl p-12 border border-white/30 dark:border-gray-700/30 shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-center">
                  {/* Enhanced title */}
                  <motion.h3 
                    className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Prêt à nous faire confiance ?
                    </span>
                  </motion.h3>
                  
                  <motion.p 
                    className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Rejoignez les milliers de clients qui nous font confiance pour leurs besoins automobiles.
                    <span className="block mt-2 font-semibold text-gray-800 dark:text-gray-200">
                      Votre satisfaction est notre priorité.
                    </span>
                  </motion.p>
                  
                  {/* Enhanced buttons */}
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-6 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <motion.button
                      className="group relative px-10 py-4 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const contactSection = document.getElementById('contact')
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                    >
                      {/* Button background animation */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      
                      <span className="relative flex items-center justify-center">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Nous Contacter
                      </span>
                    </motion.button>
                    
                    <motion.button
                      className="group relative px-10 py-4 border-2 border-red-600 text-red-600 font-bold text-lg rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const servicesSection = document.getElementById('services')
                        if (servicesSection) {
                          servicesSection.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Nos Services
                      </span>
                    </motion.button>
                  </motion.div>
                  
                  {/* Additional info */}
                  <motion.div 
                    className="mt-8 text-sm text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Service client disponible 24/7
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
