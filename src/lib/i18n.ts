import { messages } from '../data/messages'

export type Locale = 'fr' | 'en'

export function useTranslation(locale: Locale) {
  return (key: string): string => {
    const keys = key.split('.')
    let value: any = messages[locale]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }
}

export function getAvailableLocales(): Locale[] {
  return Object.keys(messages) as Locale[]
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  
  if (firstSegment === 'en' || firstSegment === 'fr') {
    return firstSegment
  }
  
  return 'fr' // Default to French
}

export function getPathWithLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean)
  
  // Remove existing locale from path
  if (segments[0] === 'en' || segments[0] === 'fr') {
    segments.shift()
  }
  
  // Add new locale
  if (locale !== 'fr') {
    segments.unshift(locale)
  }
  
  return '/' + segments.join('/')
}









