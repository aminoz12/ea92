import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HelpBanner } from '@/components/home/HelpBanner'
import { PageHero, heroPrimaryBtn, heroSecondaryBtn } from '@/components/ui/PageHero'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Icon, StarIcon, WhatsAppIcon, type IconName } from '@/components/ui/Icon'
import { FITTING_JOBS, getFittingJob } from '@/lib/shop/config'
import { DEMO_GARAGES } from '@/lib/shop/garages'
import { formatEUR } from '@/lib/shop/format'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Montage en garage partenaire à prix fixe',
  description:
    'Achetez vos pièces chez Espace Auto 92, on les livre à un garage partenaire qui les monte à prix fixe : plaquettes, vidange, batterie, amortisseurs…',
  alternates: { canonical: '/montage-garage' },
}

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'cart', title: 'Choisissez vos pièces', text: 'En ligne, sur WhatsApp ou au comptoir. Avec votre plaque, pas d’erreur de référence.' },
  { icon: 'map-pin', title: 'Choisissez le garage', text: 'Un garage partenaire près de chez vous, et un créneau qui vous arrange.' },
  { icon: 'truck', title: 'On livre le garage', text: 'Vos pièces arrivent au garage avant votre rendez-vous.' },
  { icon: 'wrench', title: 'Montage à prix fixe', text: 'Le prix annoncé est le prix payé. L’intervention s’ajoute à votre carnet d’entretien.' },
]

const PARTNER_POINTS = ['Clients et pièces livrés à l’atelier', 'Tarifs fixes définis ensemble', 'Compte pro Espace Auto 92 inclus']

const priceOf = (id: Parameters<typeof getFittingJob>[0]) => {
  const p = getFittingJob(id)?.priceTTC
  return typeof p === 'number' ? formatEUR(p) : '—'
}

export default function Page() {
  const partnerWa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Bonjour, je suis garagiste et je souhaite devenir garage partenaire Espace Auto 92.')}`
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PageHero
          eyebrow="Montage en garage partenaire"
          title={
            <>
              Vos pièces montées près de chez vous, <span className="text-secondary-500">à prix fixe.</span>
            </>
          }
          intro="Les pièces au prix Espace Auto 92, la main-d’œuvre annoncée avant le rendez-vous. Pas de devis surprise, pas de pièce introuvable."
          image="/blog1.jpeg"
          imagePosition="center 45%"
          stats={[
            { value: priceOf('plaquettes-av'), label: 'plaquettes avant' },
            { value: priceOf('vidange'), label: 'vidange + filtre à huile' },
            { value: priceOf('batterie'), label: 'remplacement batterie' },
            { value: '24–72 h', label: 'pour un rendez-vous' },
          ]}
        >
          <Link href="/boutique" className={heroPrimaryBtn}>
            Choisir mes pièces <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2.4} />
          </Link>
          <a href="#tarifs" className={heroSecondaryBtn}>
            Voir tous les tarifs
          </a>
        </PageHero>

        {/* How it works */}
        <section className="bg-white py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Comment ça marche" subtitle="Quatre étapes, de la commande à la voiture prête." />
            <ol className="grid gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex flex-col bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-5xl font-extrabold leading-none text-secondary-600">{i + 1}</span>
                    <Icon name={s.icon} className="h-9 w-9 text-gray-300" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-gray-900">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Prices + garages */}
        <section id="tarifs" className="scroll-mt-36 bg-gray-50 py-10 lg:py-14">
          <div className="max-w-7xl mx-auto grid gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
            <div>
              <SectionHeading title="Tarifs de main-d’œuvre" subtitle="Prix TTC par intervention, pièces en plus. Identiques dans tous les garages partenaires." />
              <div className="overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
                <table className="w-full text-[15px]">
                  <thead className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold sm:px-5">Intervention</th>
                      <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">Durée indicative</th>
                      <th scope="col" className="px-4 py-3 text-right font-semibold sm:px-5">Main-d’œuvre</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {FITTING_JOBS.map((j) => (
                      <tr key={j.id} className="hover:bg-gray-50">
                        <th scope="row" className="px-4 py-3 text-left font-medium text-gray-900 sm:px-5">{j.label}</th>
                        <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">{j.durationLabel}</td>
                        <td className="px-4 py-3 text-right sm:px-5">
                          {j.priceTTC !== null ? (
                            <span className="font-display text-lg font-bold text-gray-900">{formatEUR(j.priceTTC)}</span>
                          ) : (
                            <span className="text-sm text-gray-500">sur devis</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                « Sur devis » : l’intervention dépend trop du moteur pour un prix unique. Le garage vous l’annonce avant de commencer.
              </p>
            </div>

            <aside aria-labelledby="garages-title">
              <div className="mb-6 border-b border-gray-200 pb-4">
                <h2 id="garages-title" className="font-display text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">Garages partenaires</h2>
                <p className="mt-1.5 text-sm text-gray-500 sm:text-base">Autour de Nanterre, réseau en cours de constitution.</p>
              </div>
              <ul className="space-y-3">
                {DEMO_GARAGES.map((g) => (
                  <li key={g.id} className="rounded-xl bg-white p-4 ring-1 ring-gray-200 sm:p-5">
                    <p className="font-display text-lg font-bold leading-tight text-gray-900">{g.name}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1 font-semibold text-gray-900">
                        <StarIcon className="h-4 w-4 text-signal-600" /> {g.rating.toLocaleString('fr-FR')}
                      </span>
                      <span>· {g.distanceKm.toLocaleString('fr-FR')} km du magasin</span>
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-gray-800">
                      <Icon name="calendar" className="h-4 w-4 text-gray-500" /> Prochain créneau : {g.nextSlot}
                    </p>
                  </li>
                ))}
              </ul>
              <Link href="/boutique?montage=1" className="mt-4 flex h-12 items-center justify-center gap-2 rounded-lg bg-secondary-600 font-display text-sm font-bold text-white hover:bg-secondary-700">
                Voir les pièces avec montage <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2.4} />
              </Link>
            </aside>
          </div>
        </section>

        {/* For garages */}
        <section id="devenir-partenaire" className="scroll-mt-36 bg-white py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 rounded-xl bg-gray-900 p-6 text-white sm:p-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-[0.12em] text-signal-400">Vous êtes garagiste ?</p>
                <h2 className="mt-2 font-display text-3xl font-bold leading-tight lg:text-4xl">Devenez garage partenaire</h2>
                <p className="mt-3 max-w-xl text-white/80">
                  On vous envoie des clients qui ont déjà leurs pièces, livrées à l’atelier, avec une intervention au prix convenu. Vous
                  remplissez votre planning sans gérer l’approvisionnement.
                </p>
              </div>
              <div>
                <ul className="divide-y divide-white/10 border-y border-white/10">
                  {PARTNER_POINTS.map((t) => (
                    <li key={t} className="flex items-center gap-3 py-3 font-semibold">
                      <Icon name="check-circle" weight="fill" className="h-5 w-5 shrink-0 text-emerald-400" /> {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a href={partnerWa} target="_blank" rel="noopener noreferrer" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-5 font-display text-sm font-bold text-white hover:bg-green-700">
                    <WhatsAppIcon className="h-5 w-5" /> Rejoindre le réseau
                  </a>
                  <Link href="/pro" className="flex h-12 flex-1 items-center justify-center rounded-lg px-5 font-display text-sm font-bold text-white ring-1 ring-white/30 hover:bg-white/10">
                    Voir l’offre pro
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HelpBanner message="Bonjour, j’ai une question sur le montage en garage partenaire." />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
