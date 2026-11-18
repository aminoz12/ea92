import { HOURS_LABELS } from '@/lib/hours'
import { SITE } from '@/lib/site'
import { Icon } from '../ui/Icon'
import { StoreMap } from './StoreMap'

const ADDRESS = `${SITE.street}, ${SITE.postalCode} ${SITE.city}`

// The physical store stays at the heart of the offer.
export function StoreSection() {
  return (
    <section id="magasin" className="scroll-mt-32 bg-gray-50 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <div className="flex flex-col">
            <h2 className="font-display text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">
              Un vrai magasin à Nanterre, depuis {SITE.foundingDate}
            </h2>
            <p className="mt-3 text-gray-600">
              Le site ne remplace pas le comptoir : il le prolonge. Commandez en ligne, sur WhatsApp ou au
              magasin, on vous conseille de la même façon.
            </p>

            <div className="relative mt-6 overflow-hidden rounded-xl">
              <img src="/magasin.png" alt="Façade du magasin Espace Auto 92 à Nanterre" loading="lazy" className="h-56 w-full object-cover sm:h-64" />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-gray-900 shadow">
                <span className="h-2 w-2 rounded-full bg-secondary-600" />
                Plus de {SITE.partsInStock} pièces en stock
              </span>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3">
                <Icon name="map-pin" className="w-5 h-5 shrink-0 text-secondary-600" />
                <div>
                  <dt className="text-sm font-bold text-gray-900">Adresse</dt>
                  <dd className="text-sm text-gray-600">{ADDRESS}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Icon name="clock" className="w-5 h-5 shrink-0 text-secondary-600" />
                <div>
                  <dt className="text-sm font-bold text-gray-900">Horaires</dt>
                  {HOURS_LABELS.map((h) => (
                    <dd key={h.days} className="text-sm text-gray-600">
                      {h.days} : {h.hours}
                    </dd>
                  ))}
                </div>
              </div>
            </dl>
          </div>

          <StoreMap />
        </div>
      </div>
    </section>
  )
}
