import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import { SITE } from '@/lib/site'
import { localBusinessSchema, webSiteSchema } from '@/lib/structuredData'
import '@/styles/globals.css'

const TITLE = 'Espace Auto 92 - Pièces détachées auto à Nanterre (92)'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: '%s | Espace Auto 92',
  },
  description: SITE.description,
  keywords: [
    'pièces détachées auto',
    'pièces automobiles Nanterre',
    'pièces auto 92',
    'distributeur pièces auto',
    'pièces auto professionnels',
    'carte grise Nanterre',
    "plaque d'immatriculation",
    'freinage',
    'filtration',
    'embrayage',
    'distribution',
    'Espace Auto 92',
  ],
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  category: 'automotive',
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/',
      'en-US': '/en',
    },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE.url,
    siteName: SITE.name,
    title: TITLE,
    description: SITE.shortDescription,
    images: [{ url: '/logo.png', width: 512, height: 512, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SITE.shortDescription,
    images: ['/logo.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {/* Structured data (JSON-LD) for SEO / AEO / GEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
