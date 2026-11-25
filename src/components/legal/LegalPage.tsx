import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LEGAL } from '@/lib/legal'

const PAGES = [
  { href: '/mentions-legales', name: 'Mentions légales' },
  { href: '/cgv', name: 'Conditions générales de vente' },
  { href: '/confidentialite', name: 'Confidentialité' },
]

// Frame of the three legal pages: plain reading column, links to the other two.
export function LegalPage({ title, current, children }: { title: string; current: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">Dernière mise à jour : {LEGAL.updated}</p>
        <div className="mt-8 space-y-8">{children}</div>
        <nav aria-label="Informations légales" className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-200 pt-6 text-sm">
          {PAGES.filter((p) => p.href !== current).map((p) => (
            <Link key={p.href} href={p.href} className="font-semibold text-gray-900 underline underline-offset-4 hover:text-secondary-600">
              {p.name}
            </Link>
          ))}
        </nav>
      </main>
      <Footer />
    </div>
  )
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold text-gray-900">{title}</h2>
      <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-gray-700">{children}</div>
    </section>
  )
}
