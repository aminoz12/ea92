'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useShop } from '@/providers/ShopProvider'
import { SITE } from '@/lib/site'
import { Icon } from '../ui/Icon'
import { VehiclePicker } from './VehiclePicker'

// The big plate search: "La bonne pièce du premier coup". It is how every
// search for a part starts: the plate first, then the parts of that vehicle.
// Promise on the left, a large plate field + search button on the right, and
// a way forward for visitors who don't have their plate at hand. A plate that
// is recognised takes the visitor straight to the parts of the vehicle; coming
// back, the bar shows the vehicle and a link to its parts.
export function PlateSearchBar({ className = '' }: { className?: string }) {
  const router = useRouter()
  const { vehicle, hydrated } = useShop()
  const found = hydrated && !!vehicle
  const cardWa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Bonjour, voici ma carte grise pour trouver la bonne pièce :')}`

  return (
    <div className={`overflow-hidden rounded-xl border-l-4 border-secondary-600 bg-gray-900 ${className}`}>
      {/* grid-cols-1: a single column that may shrink below the plate field's natural width (it overflowed the frame on phones) */}
      <div className="grid grid-cols-1 gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-10">
        <div>
          <p className="font-display text-2xl font-bold leading-tight text-white lg:text-3xl">
            La bonne pièce <span className="block text-secondary-500">du premier coup</span>
          </p>
          <p className="mt-1 text-sm text-white/70 sm:text-base">
            {found
              ? 'Votre véhicule est enregistré : nous n’affichons que les pièces qui se montent dessus.'
              : 'Entrez votre plaque : on ne vous montre que les pièces compatibles.'}
          </p>
        </div>

        <div>
          <div className={found ? 'flex flex-col gap-4 xl:flex-row xl:items-center' : ''}>
            <div className="min-w-0 flex-1">
              <VehiclePicker
                tone="dark"
                size="lg"
                submitLabel="Trouver mes pièces"
                onIdentified={(v) => {
                  if (v.ktype) router.push(`/pieces/${v.ktype}`)
                }}
              />
            </div>
            {found && (
              <Link
                href={vehicle?.ktype ? `/pieces/${vehicle.ktype}` : '/pieces#marque-modele'}
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-secondary-600 px-5 font-display text-sm font-bold text-white hover:bg-secondary-700"
              >
                {vehicle?.ktype ? 'Voir les pièces compatibles' : 'Choisir marque et modèle'} <Icon name="arrow-right" strokeWidth={2.4} className="h-4 w-4" />
              </Link>
            )}
          </div>
          {!found && (
            <p className="mt-3 text-sm text-white/60">
              Pas la plaque sous la main ?{' '}
              <Link href="/pieces#marque-modele" className="font-semibold text-white underline underline-offset-4 hover:text-signal-400">
                Choisir marque et modèle
              </Link>{' '}
              ou{' '}
              <a href={cardWa} target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline underline-offset-4 hover:text-signal-400">
                envoyer la carte grise sur WhatsApp
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
