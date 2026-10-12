'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getLocaleFromPath, getPathWithLocale } from '../lib/i18n'
import type { Locale } from '../lib/i18n'
import { fr } from '../data/messages/fr'
import { en } from '../data/messages/en'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

interface LocaleProviderProps {
  children: ReactNode
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [locale, setLocaleState] = useState<Locale>(() => getLocaleFromPath(pathname))

  // Update locale when path changes
  useEffect(() => {
    const newLocale = getLocaleFromPath(pathname)
    if (newLocale !== locale) {
      setLocaleState(newLocale)
    }
  }, [pathname, locale])

  const setLocale = (newLocale: Locale) => {
    if (newLocale !== locale) {
      setLocaleState(newLocale)
      const newPath = getPathWithLocale(pathname, newLocale)
      router.replace(newPath)
    }
  }

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = locale === 'fr' ? fr : en
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  const value: LocaleContextType = {
    locale,
    setLocale,
    t,
  }

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
