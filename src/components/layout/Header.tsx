'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import { useTheme } from '../../hooks/useTheme' // DARK MODE DISABLED - Uncomment to restore
import { Button } from '../ui/Button'

export function Header() {
  // const { setTheme, resolvedTheme } = useTheme() // DARK MODE DISABLED - Uncomment to restore
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '#services' },
    { name: 'Compte PRO', href: '/pro' },
    { name: 'À propos', href: '/about' },
    { name: 'FAQ', href: '#faq' },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleSectionNavigation = (href: string) => {
    if (href.startsWith('#')) {
      if (pathname !== '/') {
        // If not on home page, navigate to home with hash
        window.location.href = `/${href}`
      } else {
        // If on home page, scroll to section
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  // Handle hash navigation when page loads
  useEffect(() => {
    if (pathname === '/' && window.location.hash) {
      const hash = window.location.hash
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center group h-20">
            <img 
              src="/logo.png" 
              alt="Espace Auto 92 Logo" 
              className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {navigation.map((item) => {
              // Use custom handler for section links, Link for page routes
              if (item.href.startsWith('#')) {
                return (
                  <button
                    key={item.name}
                    onClick={() => handleSectionNavigation(item.href)}
                    className="text-gray-800 hover:text-secondary-600 font-display font-semibold text-base transition-all duration-300 relative group py-2"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-1 bg-secondary-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                  </button>
                )
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-800 hover:text-secondary-600 font-display font-semibold text-base transition-all duration-300 relative group py-2"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-secondary-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Phone Number */}
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-full">
              <svg className="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a 
                href="tel:0147851000" 
                className="font-display font-bold text-gray-900 hover:text-secondary-600 transition-colors duration-300 text-sm"
              >
                01 47 85 10 00
              </a>
            </div>


            {/* Theme Toggle - DARK MODE DISABLED - Uncomment to restore */}
            {/* <button
              onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
              className="p-2 text-gray-600 hover:text-secondary-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              {resolvedTheme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button> */}

            <Link href="/contact">
              <Button size="sm" className="bg-secondary-600 hover:bg-secondary-700 text-white font-display font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                Contact
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-3 text-gray-600 hover:text-secondary-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navigation.map((item) => {
                // Use custom handler for section links, Link for page routes
                if (item.href.startsWith('#')) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        handleSectionNavigation(item.href)
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-display font-semibold text-gray-800 hover:text-secondary-600 hover:bg-gray-50 rounded-xl transition-all duration-300"
                    >
                      {item.name}
                    </button>
                  )
                }
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-3 text-lg font-display font-semibold text-gray-800 hover:text-secondary-600 hover:bg-gray-50 rounded-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              })}
              
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

