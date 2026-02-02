import { Link } from 'react-router-dom'
import { useLocale } from '../../hooks/useLocale'
// import { useTheme } from '../../hooks/useTheme' // DARK MODE DISABLED - Uncomment to restore

export function Footer() {
  const { t } = useLocale()
  // const { resolvedTheme } = useTheme() // DARK MODE DISABLED - Uncomment to restore

  const quickLinks = [
    { name: t('navigation.home'), href: '/' },
    { name: t('navigation.services'), href: '#services' },
    { name: t('navigation.products'), href: '#products' },
    { name: t('navigation.contact'), href: '/contact' },
  ]

  const services = [
    { name: 'Freinage', href: '#services' },
    { name: 'Filtration', href: '#services' },
    { name: 'Embrayage', href: '#services' },
    { name: 'Distribution', href: '#services' },
    { name: 'Suspension', href: '#services' },
    { name: 'Démarrage', href: '#services' },
    { name: 'Direction', href: '#services' },
    { name: 'Éclairage', href: '#services' },
    { name: 'Échappement', href: '#services' },
    { name: 'Outillage', href: '#services' },
    { name: 'Carrosserie', href: '#services' },
    { name: 'Vitrage', href: '#services' },
    { name: 'Service Carte Grise', href: '#services' },
  ]

  return (
    <footer className="bg-gradient-to-b from-red-700 via-red-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/logo.png"
                alt="Espace Auto 92 Logo" 
                className="w-20 h-20 object-contain"
                onError={(e) => {
                  // Fallback to text if logo doesn't exist
                  e.currentTarget.style.display = 'none'
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                  if (nextElement) {
                    nextElement.style.display = 'flex'
                  }
                }}
              />
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg hidden">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
            </div>
            <p className="text-white/80 text-sm">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Nos services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Row */}
              <div className="space-y-2">
                <ul className="space-y-2">
                  {services.slice(0, 7).map((service) => (
                    <li key={service.name}>
                      <Link
                        to={service.href}
                        className="text-white/80 hover:text-white transition-colors text-sm"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Second Row */}
              <div className="space-y-2">
                <ul className="space-y-2">
                  {services.slice(7).map((service) => (
                    <li key={service.name}>
                      <Link
                        to={service.href}
                        className="text-white/80 hover:text-white transition-colors text-sm"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <div className="space-y-2 text-sm text-white/80">
              <p>426 Avenue de la République</p>
              <p>92000 Nanterre, France</p>
              <p>01 47 85 10 00</p>
              <p>espaceauto92.info@gmail.com</p>
              <div className="pt-2">
                <p className="font-medium">Horaires d'ouverture:</p>
                <p>Lun.-Sam. : 9h - 18h 30</p>
                <p>Vendredi : 9h - 12h30 - 15h - 18h30</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/70 text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}





