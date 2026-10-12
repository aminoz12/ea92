'use client'

import { useEffect } from 'react'
import { LocaleProvider } from '@/providers/LocaleProvider'
import { ScrollToTop } from '@/components/ScrollToTop'
import { WhatsAppWidget } from '@/components/ui/WhatsAppWidget'
import { registerServiceWorker } from '@/lib/serviceWorker'

export function Providers({ children }: { children: React.ReactNode }) {
  // Register the service worker once on mount (client-only)
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return (
    <LocaleProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-white transition-colors">{children}</div>
      <WhatsAppWidget />
    </LocaleProvider>
  )
}
