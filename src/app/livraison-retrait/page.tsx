import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FulfilmentStrip } from '@/components/shop/FulfilmentStrip'
import { HelpBanner } from '@/components/home/HelpBanner'
import { PageHero, heroPrimaryBtn, heroSecondaryBtn } from '@/components/ui/PageHero'
import { Icon, type IconName } from '@/components/ui/Icon'
import { DEPOSIT, FITTING_JOBS, FULFILMENT } from '@/lib/shop/config'
import { DEPOSIT_RETURN } from '@/lib/shop/deposit'
import { formatEUR } from '@/lib/shop/format'
import { HOURS_LABELS } from '@/lib/hours'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Livraison & retrait',
  description:
    'Retrait en 30 min au magasin de Nanterre, livraison coursier en ~1 h en Île-de-France, expédition partout en France ou montage en garage partenaire.',
  alternates: { canonical: '/livraison-retrait' },
}

// One block per way of receiving a part: icon + title on the left, the price
// on the right of the header, details below with a side panel.
function Block({
  id,
  icon,
  title,
  price,
  priceNote,
  children,
  aside,
}: {
  id: string
  icon: IconName
  title: string
  price: string
  priceNote?: string
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-36 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-gray-200 px-5 py-5 sm:px-8">
        <Icon name={icon} className="h-10 w-10 shrink-0 text-secondary-600" />
        <h2 className="min-w-0 flex-1 basis-56 font-display text-2xl font-bold leading-tight text-gray-900 lg:text-3xl">{title}</h2>
        <p className="shrink-0 leading-tight sm:text-right">
          <span className="block font-display text-2xl font-bold text-gray-900">{price}</span>
          {priceNote && <span className="block text-sm text-gray-500">{priceNote}</span>}
        </p>
      </header>
      <div className={`grid gap-6 px-5 py-6 sm:px-8 ${aside ? 'lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10' : ''}`}>
        <div className="space-y-4 text-gray-700">{children}</div>
        {aside && <div>{aside}</div>}
      </div>
    </section>
  )
}

const Check = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-2.5">
    <Icon name="check-circle" weight="fill" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
    <span>{children}</span>
  </li>
)

const panel = 'rounded-lg bg-gray-50 p-5 text-sm ring-1 ring-gray-200'
const row = 'flex justify-between gap-3 py-2'

const DEPOSIT_MODES = [
  ['retrait', 'Retrait au magasin', 'store'],
  ['coursier', 'Coursier', 'bolt'],
  ['colis', 'Colis', 'box'],
  ['montage', 'Montage en garage', 'wrench'],
] as const

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-14">
        <PageHero
          eyebrow="Livraison & retrait"
          title={
            <>
              Au magasin, chez vous, <span className="text-secondary-500">ou directement au garage.</span>
            </>
          }
          intro="Vous choisissez au moment de commander. Le prix de livraison est calculé selon votre adresse, avant de payer."
          image="/images/atelier-equipe.jpg"
          imagePosition="center 30%"
        >
          <Link href="/boutique" className={heroPrimaryBtn}>
            Choisir mes pièces <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2.4} />
          </Link>
          <Link href="/suivi-commande" className={heroSecondaryBtn}>
            <Icon name="box" className="h-4 w-4" /> Suivre une commande
          </Link>
        </PageHero>

        <div className="max-w-7xl mx-auto space-y-5 px-4 sm:px-6 lg:px-8">
          {/* The 4 modes, as shortcuts to their block */}
          <FulfilmentStrip className="relative z-10 -mt-8 shadow-[0_12px_32px_-16px_rgba(23,23,22,0.45)]" />

          <Block
            id="retrait"
            icon="store"
            title="Retrait au magasin de Nanterre"
            price="Gratuit"
            priceNote={`prêt en ${FULFILMENT.pickupReadyMinutes} min si en stock`}
            aside={
              <div className={panel}>
                <p className="font-display text-lg font-bold text-gray-900">{SITE.street}</p>
                <p className="text-gray-600">
                  {SITE.postalCode} {SITE.city}
                </p>
                <dl className="mt-3 divide-y divide-gray-200 border-t border-gray-200">
                  {HOURS_LABELS.map((h) => (
                    <div key={h.days} className={row}>
                      <dt className="text-gray-600">{h.days}</dt>
                      <dd className="text-right font-semibold text-gray-900">{h.hours}</dd>
                    </div>
                  ))}
                </dl>
                <Link href="/contact" className="mt-3 inline-flex items-center gap-1.5 font-semibold text-gray-900 underline underline-offset-4 hover:text-secondary-600">
                  Plan et itinéraire <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              </div>
            }
          >
            <ul className="space-y-2.5">
              <Check>
                Prête en {FULFILMENT.pickupReadyMinutes} min si la pièce est en stock, dès ~{FULFILMENT.supplierLeadHours} h si elle vient de notre fournisseur.
              </Check>
              <Check>On vérifie la pièce avec vous au comptoir avant que vous partiez.</Check>
              <Check>Vous êtes prévenu sur WhatsApp dès que c’est prêt.</Check>
            </ul>
            <div className="flex gap-3 border-t border-gray-200 pt-4">
              <Icon name="clock" className="mt-0.5 h-6 w-6 shrink-0 text-gray-500" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Bientôt : casiers click &amp; collect 24 h/24.</span> Votre commande
                déposée dans un casier devant le magasin, avec un code d’ouverture reçu sur WhatsApp : retrait à toute heure, même le
                dimanche. Un distributeur de produits d’urgence (ampoules, fusibles, lave-glace…) est aussi à l’étude.
              </p>
            </div>
          </Block>

          <Block
            id="coursier"
            icon="bolt"
            title="Livraison express par coursier"
            price={`dès ${formatEUR(FULFILMENT.courier.baseFeeTTC)}`}
            priceNote="en ~1 h, Île-de-France"
            aside={
              <div className={panel}>
                <p className="font-display text-lg font-bold text-gray-900">Tarifs par zone</p>
                <dl className="mt-2 divide-y divide-gray-200 border-t border-gray-200">
                  {FULFILMENT.courier.zones.map((z) => (
                    <div key={z.label} className={row}>
                      <dt className="text-gray-600">{z.label}</dt>
                      <dd className="shrink-0 font-display text-base font-bold text-gray-900">{formatEUR(FULFILMENT.courier.baseFeeTTC + z.extraTTC)}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-xs text-gray-500">Prix indicatifs : le prix exact est calculé selon votre adresse.</p>
              </div>
            }
          >
            <p>Un coursier récupère votre commande au magasin et vous la livre à domicile, au bureau ou à l’atelier.</p>
            <ul className="space-y-2.5">
              <Check>En ~1 h après préparation, partout en Île-de-France.</Check>
              <Check>Suivi du coursier en temps réel : le lien arrive sur WhatsApp.</Check>
              <Check>Idéal pour une immobilisation : batterie, plaquettes, ampoule, courroie…</Check>
            </ul>
          </Block>

          <Block
            id="colis"
            icon="box"
            title="Expédition partout en France"
            price={`dès ${formatEUR(FULFILMENT.parcel.relayFromTTC)}`}
            priceNote={`offerte dès ${formatEUR(FULFILMENT.parcel.freeAboveTTC)} d’achat`}
            aside={
              <div className={panel}>
                <p className="font-display text-lg font-bold text-gray-900">Tarifs</p>
                <dl className="mt-2 divide-y divide-gray-200 border-t border-gray-200">
                  <div className={row}>
                    <dt className="text-gray-600">Point relais</dt>
                    <dd className="font-display text-base font-bold text-gray-900">dès {formatEUR(FULFILMENT.parcel.relayFromTTC)}</dd>
                  </div>
                  <div className={row}>
                    <dt className="text-gray-600">À domicile</dt>
                    <dd className="font-display text-base font-bold text-gray-900">dès {formatEUR(FULFILMENT.parcel.homeFromTTC)}</dd>
                  </div>
                  <div className={row}>
                    <dt className="text-gray-600">Délai</dt>
                    <dd className="font-semibold text-gray-900">{FULFILMENT.parcel.delay}</dd>
                  </div>
                </dl>
              </div>
            }
          >
            <p>On compare les transporteurs (Colissimo, Mondial Relay, Chronopost…) et on choisit le meilleur rapport prix/délai pour votre colis.</p>
            <ul className="space-y-2.5">
              <Check>Numéro de suivi envoyé sur WhatsApp dès l’expédition.</Check>
              <Check>Pièces emballées et contrôlées au magasin avant le départ.</Check>
              <Check>Les batteries ne voyagent pas en colis (matière dangereuse) : retrait, coursier ou montage.</Check>
            </ul>
          </Block>

          <Block
            id="montage"
            icon="wrench"
            title="Livraison + montage en garage partenaire"
            price="Prix fixe"
            priceNote="annoncé avant le rendez-vous"
            aside={
              <div className={panel}>
                <p className="font-display text-lg font-bold text-gray-900">Exemples de main-d’œuvre</p>
                <dl className="mt-2 divide-y divide-gray-200 border-t border-gray-200">
                  {FITTING_JOBS.filter((j) => j.priceTTC !== null)
                    .slice(0, 4)
                    .map((j) => (
                      <div key={j.id} className={row}>
                        <dt className="text-gray-600">{j.label}</dt>
                        <dd className="shrink-0 font-display text-base font-bold text-gray-900">{formatEUR(j.priceTTC!)}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            }
          >
            <p>
              Vos pièces sont livrées au garage partenaire de votre choix, qui les monte à un prix fixe annoncé à l’avance. Vous réglez
              la main-d’œuvre directement au garage, après l’intervention.
            </p>
            <Link href="/montage-garage" className="inline-flex h-11 items-center gap-2 rounded-lg bg-gray-900 px-5 font-display text-sm font-bold text-white hover:bg-secondary-600">
              Voir les tarifs et les garages <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2.4} />
            </Link>
          </Block>

          <Block
            id="consigne"
            icon="refresh"
            title="Consigne sur l’ancienne pièce"
            price="Remboursée"
            priceNote={`au retour, sous ${DEPOSIT.returnDays} jours`}
            aside={
              <div className={panel}>
                <p className="font-display text-lg font-bold text-gray-900">L’ancienne pièce est acceptée si elle est :</p>
                <ul className="mt-3 space-y-2 text-gray-700">
                  {DEPOSIT.conditions.map((c) => (
                    <li key={c} className="flex gap-2">
                      <Icon name="check-circle" weight="fill" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            }
          >
            <p>
              Démarreurs, alternateurs, étriers… sont vendus en <strong className="text-gray-900">échange standard</strong> : vous payez
              une consigne en plus du prix, remboursée quand vous nous rapportez l’ancienne pièce. Son montant est indiqué sur la fiche
              de chaque pièce concernée.
            </p>
            <dl className="divide-y divide-gray-200 border-y border-gray-200">
              {DEPOSIT_MODES.map(([mode, label, icon]) => (
                <div key={mode} className="grid gap-1 py-3 sm:grid-cols-[210px_minmax(0,1fr)] sm:gap-4">
                  <dt className="flex items-center gap-2 font-semibold text-gray-900">
                    <Icon name={icon} className="h-5 w-5 shrink-0 text-gray-500" /> {label}
                  </dt>
                  <dd className="text-gray-700">{DEPOSIT_RETURN[mode]}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block id="retours" icon="shield" title="Retours sur les achats en ligne" price="14 jours" priceNote="après réception">
            <p>
              Pour un achat en ligne, vous disposez de 14 jours après réception pour changer d’avis : la pièce doit être retournée non
              montée, dans son emballage d’origine. Une erreur de référence de notre part ? On l’échange immédiatement.
            </p>
          </Block>

          <HelpBanner />
        </div>
      </main>
      <Footer />
    </div>
  )
}
