import Image from 'next/image'
import Link from 'next/link'
import { FITTING_JOBS } from '@/lib/shop/config'
import { formatEUR } from '@/lib/shop/format'
import { Icon } from '../ui/Icon'

// "Buy the part, we handle the fitting" — partner garages at a fixed price.
// Text on the left, the photo on ~60 % of the block at full brightness (only
// a short fade where it meets the text). On phones the photo sits on top.
export function GarageFittingPromo() {
  const featured = FITTING_JOBS.filter((j) => j.priceTTC !== null).slice(0, 4)
  return (
    <section className="bg-gray-50 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-xl bg-gray-900 md:grid-cols-2 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative order-first h-60 sm:h-72 md:order-last md:h-auto md:min-h-[480px] xl:min-h-[540px]">
            <Image
              src="/images/atelier-equipe.jpg"
              alt="Deux mécaniciens dans un atelier de pièces détachées"
              fill
              sizes="(min-width: 1280px) 720px, (min-width: 768px) 58vw, 100vw"
              className="object-cover"
              style={{ objectPosition: 'center 35%' }}
            />
            {/* Blend into the text panel: from the left on desktop, from the bottom on phones */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/10 to-transparent md:bg-gradient-to-r md:via-transparent" />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <span className="inline-flex items-center gap-1.5 self-start rounded bg-secondary-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
              <Icon name="wrench" className="w-3.5 h-3.5" />
              Nouveau · Montage en garage partenaire
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white lg:text-4xl">
              Achetez la pièce,
              <br />
              <span className="text-secondary-500">on s’occupe du montage.</span>
            </h2>
            <p className="mt-3 max-w-md text-white/75">
              Votre pièce est livrée chez un garage partenaire près de chez vous, qui la monte à un prix fixe annoncé à l’avance. Pas de
              devis surprise.
            </p>

            <ul className="mt-6 grid max-w-md grid-cols-2 gap-2">
              {featured.map((j) => (
                <li key={j.id} className="rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10">
                  <span className="block text-xs text-white/70">{j.label}</span>
                  <span className="block font-display text-lg font-bold text-white">
                    {formatEUR(j.priceTTC as number)} <span className="block text-xs font-medium text-white/60 xl:inline">main-d’œuvre</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/montage-garage"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-secondary-600 px-5 font-display text-sm font-bold text-white hover:bg-secondary-700"
              >
                Voir les tarifs de montage
                <Icon name="arrow-right" className="w-4 h-4" strokeWidth={2.2} />
              </Link>
              <Link
                href="/montage-garage#tarifs"
                className="inline-flex h-12 items-center rounded-xl px-5 font-display text-sm font-bold text-white ring-1 ring-white/30 hover:bg-white/10"
              >
                Voir les garages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
