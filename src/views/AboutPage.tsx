import Image from 'next/image'
import Link from 'next/link'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { PageHero, heroPrimaryBtn, heroSecondaryBtn } from '../components/ui/PageHero'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Icon, WhatsAppIcon, type IconName } from '../components/ui/Icon'
import { BrandsSection } from '../components/sections/BrandsSection'
import { TestimonialsSection } from '../components/sections/TestimonialsSection'
import { AudienceSplit } from '../components/home/AudienceSplit'
import { HelpBanner } from '../components/home/HelpBanner'
import { SITE } from '../lib/site'

const COMMITMENTS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'wrench',
    title: 'La bonne pièce, du premier coup',
    text: 'Avec votre plaque ou votre carte grise, on trouve la référence exacte. Si une pièce ne convient pas, on vous le dit.',
  },
  {
    icon: 'bolt',
    title: 'Vite, vraiment',
    text: `Plus de ${SITE.partsInStock} pièces en rayon, le reste chez nos fournisseurs en ~4 h. Retrait en 30 min, coursier en ~1 h.`,
  },
  {
    icon: 'shield',
    title: 'Des marques de confiance',
    text: 'Les fabricants qui équipent les garages (Bosch, TRW, Valeo, Brembo…). Toutes nos pièces sont garanties 1 an minimum.',
  },
  {
    icon: 'heart',
    title: 'Des prix clairs, des conseils honnêtes',
    text: 'Prix affichés, pas de vente forcée. Et une seule adresse officielle : nous ne vendons rien sur Facebook.',
  },
]

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PageHero
          eyebrow="À propos"
          title={
            <>
              Les pièces auto à Nanterre, <span className="text-secondary-500">depuis {SITE.foundingDate}.</span>
            </>
          }
          intro="Un magasin de pièces détachées où l’on vous conseille comme au comptoir, que vous passiez nous voir, que vous écriviez sur WhatsApp ou que vous commandiez en ligne."
          image="/coverabout.png"
          imagePosition="center 35%"
          stats={[
            { value: SITE.foundingDate, label: 'ouvert à Nanterre' },
            { value: `${SITE.partsInStock}+`, label: 'pièces en stock' },
            { value: `${SITE.googleRating.toLocaleString('fr-FR')}/5`, label: `${SITE.googleReviewCount.toLocaleString('fr-FR')} avis Google` },
            { value: '4', label: 'façons de recevoir vos pièces' },
          ]}
        >
          <Link href="/contact" className={heroPrimaryBtn}>
            Venir au magasin <Icon name="arrow-right" className="w-4 h-4" />
          </Link>
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className={heroSecondaryBtn}>
            <WhatsAppIcon className="w-4 h-4" /> Écrire sur WhatsApp
          </a>
        </PageHero>

        {/* Story */}
        <section className="py-12 lg:py-20">
          <div className="max-w-7xl mx-auto grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary-600">Notre histoire</p>
              <h2 className="mt-1.5 font-display text-3xl font-extrabold leading-tight text-gray-900 lg:text-4xl">
                Un comptoir de quartier devenu le fournisseur des garages du 92
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-gray-600">
                <p>
                  Depuis nos débuts en {SITE.foundingDate}, notre objectif est simple : fournir des{' '}
                  <strong className="text-gray-900">pièces de qualité rapidement</strong>, avec un service fiable et honnête.
                </p>
                <p>
                  Avec le temps, nous avons gagné la confiance de nombreux <strong className="text-gray-900">garages et particuliers</strong>{' '}
                  grâce à notre réactivité, notre stock et notre expertise technique.
                </p>
                <p>
                  Aujourd’hui, le comptoir se prolonge en ligne : commande sur WhatsApp ou sur le site, retrait en 30 minutes,
                  coursier, expédition partout en France ou montage en garage partenaire. Avec toujours la même priorité :{' '}
                  <strong className="text-secondary-600">vous dépanner vite, bien et au juste prix.</strong>
                </p>
              </div>
            </div>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gray-100 shadow-xl ring-1 ring-gray-200">
              <Image
                src="/magasin.png"
                alt="Façade du magasin Espace Auto 92, avenue de la République à Nanterre"
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover"
              />
              <figcaption className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-lg sm:right-auto">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-600 text-white">
                  <Icon name="map-pin" className="w-5 h-5" />
                </span>
                <span className="text-sm">
                  <span className="block font-bold text-gray-900">{SITE.street}</span>
                  <span className="text-gray-500">{SITE.postalCode} {SITE.city}</span>
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Commitments */}
        <section className="bg-gray-50 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Nos engagements" title="Ce qui ne change pas, au comptoir comme en ligne" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {COMMITMENTS.map((c) => (
                <div key={c.title} className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-600">
                    <Icon name={c.icon} className="w-6 h-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-gray-900">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <BrandsSection />
        <TestimonialsSection />
        <AudienceSplit />

        <section className="pb-12 lg:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HelpBanner />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
