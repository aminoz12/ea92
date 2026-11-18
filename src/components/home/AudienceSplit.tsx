import Link from 'next/link'
import { LOYALTY, PRO } from '@/lib/shop/config'
import { formatEUR } from '@/lib/shop/format'
import { Icon } from '../ui/Icon'

// The two sides of the site: PARTICULIER and PRO.
export function AudienceSplit() {
  const p = LOYALTY.particulier
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto grid gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Particuliers */}
        <div className="flex flex-col rounded-3xl bg-secondary-50 p-6 ring-1 ring-secondary-100 sm:p-8">
          <span className="self-start rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-700">
            Particuliers
          </span>
          <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight text-gray-900 lg:text-3xl">
            Le club Espace Auto 92 : votre voiture suivie, vos achats récompensés
          </h2>
          <ul className="mt-5 space-y-3 text-gray-700">
            <li className="flex gap-3">
              <Icon name="gift" className="w-5 h-5 shrink-0 text-secondary-600" />
              {p.pointsPerEuro} point par euro · {formatEUR(p.voucherValueTTC)} offerts tous les {p.voucherEveryPoints} points
            </li>
            <li className="flex gap-3">
              <Icon name="clipboard" className="w-5 h-5 shrink-0 text-secondary-600" />
              Carnet d’entretien digital rempli automatiquement à chaque achat
            </li>
            <li className="flex gap-3">
              <Icon name="bell" className="w-5 h-5 shrink-0 text-secondary-600" />
              Rappel WhatsApp quand une pièce d’usure arrive en fin de vie
            </li>
          </ul>
          <div className="mt-auto flex flex-wrap gap-3 pt-7">
            <Link href="/fidelite" className="inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-3 font-display font-bold text-white hover:bg-secondary-700">
              Rejoindre le club
              <Icon name="arrow-right" className="w-4 h-4" strokeWidth={2.2} />
            </Link>
            <Link href="/carnet-entretien" className="inline-flex items-center rounded-xl bg-white px-5 py-3 font-semibold text-gray-900 ring-1 ring-gray-200 hover:ring-gray-300">
              Voir le carnet d’entretien
            </Link>
          </div>
        </div>

        {/* Pros */}
        <div className="flex flex-col rounded-3xl bg-gray-900 p-6 text-white sm:p-8">
          <span className="self-start rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Garages & magasins
          </span>
          <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight lg:text-3xl">
            Votre fournisseur de pièces, <span className="text-secondary-500">sans plateforme</span>
          </h2>
          <ul className="mt-5 space-y-3 text-white/80">
            <li className="flex gap-3">
              <Icon name="search" className="w-5 h-5 shrink-0 text-secondary-500" />
              Accès en marque blanche, recherche par référence
            </li>
            <li className="flex gap-3">
              <Icon name="percent" className="w-5 h-5 shrink-0 text-secondary-500" />
              Prix nets pros affichés, livraison atelier ou retrait comptoir
            </li>
            <li className="flex gap-3">
              <Icon name="banknotes" className="w-5 h-5 shrink-0 text-secondary-500" />
              Prélèvement chaque semaine · encours de départ {formatEUR(PRO.creditLimitDefaultTTC)}
            </li>
          </ul>
          <div className="mt-auto flex flex-wrap gap-3 pt-7">
            <Link href="/pro" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-display font-bold text-gray-900 hover:bg-gray-100">
              Découvrir l’offre pro
              <Icon name="arrow-right" className="w-4 h-4" strokeWidth={2.2} />
            </Link>
            <Link href="/pro/espace" className="inline-flex items-center rounded-xl px-5 py-3 font-semibold text-white ring-1 ring-white/30 hover:bg-white/10">
              Espace Pro (démo)
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
