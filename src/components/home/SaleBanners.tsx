import Image from 'next/image'
import { GENART } from '@/lib/shop/partTypes'
import { CatalogLink } from '../shop/CatalogLink'
import { Icon } from '../ui/Icon'

const BANNERS: { genart: number; kicker: string; title: string; text: string; image: string; position: string }[] = [
  {
    genart: GENART.brakePads,
    kicker: 'Freinage',
    title: 'Plaquettes & disques',
    text: 'Montage à prix fixe possible en garage partenaire.',
    image: '/blog1.jpeg',
    position: 'center 40%',
  },
  {
    genart: GENART.oilFilter,
    kicker: 'Révision maison',
    title: 'Huile & filtres',
    text: 'Ce qu’il faut pour votre moteur, avec votre plaque.',
    image: '/blog2.jpeg',
    position: 'center 55%',
  },
]

// Two large photo banners into the real catalogue. No "dès … €": the price of
// a part depends on the vehicle and comes live from the suppliers.
export function SaleBanners() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {BANNERS.map((b) => (
          <CatalogLink
            key={b.genart}
            genart={b.genart}
            className="group relative flex min-h-[260px] flex-col justify-center overflow-hidden rounded-xl bg-gray-950 p-7 text-white sm:p-9"
          >
            <Image
              src={b.image}
              alt=""
              fill
              sizes="(min-width: 768px) 600px, 100vw"
              className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: b.position }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/70 to-transparent" />
            <div className="relative max-w-xs">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">{b.kicker}</p>
              <p className="font-display text-3xl font-extrabold uppercase leading-tight sm:text-4xl">{b.title}</p>
              <p className="mt-2 text-sm text-white/75">{b.text}</p>
              <span className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-secondary-600 px-5 font-display text-sm font-bold uppercase tracking-wide group-hover:bg-secondary-700">
                Voir les pièces <Icon name="arrow-right" className="w-4 h-4" />
              </span>
            </div>
          </CatalogLink>
        ))}
      </div>
    </div>
  )
}
