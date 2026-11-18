import Link from 'next/link'
import { CATEGORIES } from '@/lib/shop/categories'
import { HOURS_LABELS } from '@/lib/hours'
import { SITE } from '@/lib/site'
import { Icon, WhatsAppIcon, type IconName } from '../ui/Icon'

const REASSURANCE: { icon: IconName; title: string; text: string; href: string }[] = [
  { icon: 'store', title: 'Retrait en 30 min', text: 'Au comptoir à Nanterre', href: '/livraison-retrait#retrait' },
  { icon: 'bolt', title: 'Coursier en ~1 h', text: 'Partout en Île-de-France', href: '/livraison-retrait#coursier' },
  { icon: 'box', title: 'Expédition France', text: 'Point relais ou domicile', href: '/livraison-retrait#colis' },
  { icon: 'wrench', title: 'Montage à prix fixe', text: 'Garages partenaires', href: '/montage-garage' },
]

const COLUMNS: { title: string; links: { name: string; href: string }[] }[] = [
  {
    title: 'Boutique',
    links: [
      ...CATEGORIES.slice(0, 6).map((c) => ({ name: c.name, href: `/boutique?categorie=${c.id}` })),
      { name: 'Toute la boutique', href: '/boutique' },
    ],
  },
  {
    title: 'Services',
    links: [
      { name: 'Livraison & retrait', href: '/livraison-retrait' },
      { name: 'Montage en garage partenaire', href: '/montage-garage' },
      { name: 'Suivi de commande', href: '/suivi-commande' },
      { name: 'Club fidélité', href: '/fidelite' },
      { name: 'Carnet d’entretien digital', href: '/carnet-entretien' },
      { name: 'Ampoules', href: '/ampoules' },
      { name: 'Essuie-glaces', href: '/essuie-glaces' },
    ],
  },
  {
    title: 'Professionnels',
    links: [
      { name: 'Ouvrir un compte pro', href: '/pro#ouvrir-un-compte' },
      { name: 'Espace Pro', href: '/pro/espace' },
      { name: 'Conditions & encours', href: '/pro#conditions' },
      { name: 'Fidélité Pro', href: '/fidelite?espace=pro' },
      { name: 'À propos', href: '/about' },
      { name: 'Conseils auto', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* The 4 ways to receive a part — red band, four linked tiles separated
          by hairlines (gap-px over a lighter background). */}
      <nav aria-label="Modes de réception" className="bg-secondary-600">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <ul className="grid grid-cols-2 gap-px bg-white/20 lg:grid-cols-4">
            {REASSURANCE.map((r) => (
              <li key={r.title} className="flex bg-secondary-600">
                {/* Icon beside the text when the tile is wide enough (tablet,
                    wide desktop), above it otherwise — titles stay on one line. */}
                <Link
                  href={r.href}
                  className="flex flex-1 flex-col gap-2.5 px-4 py-5 transition-colors hover:bg-secondary-700 sm:flex-row sm:items-center sm:gap-4 sm:px-5 lg:flex-col lg:items-start lg:gap-2.5 lg:py-6 xl:flex-row xl:items-center xl:gap-4 xl:py-7"
                >
                  <Icon name={r.icon} className="h-9 w-9 shrink-0 text-white xl:h-11 xl:w-11" />
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block font-display text-base font-bold uppercase tracking-wide text-white sm:whitespace-nowrap sm:text-lg">{r.title}</span>
                    <span className="mt-1 block text-sm text-white/85">{r.text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Store */}
          <div className="lg:col-span-4">
            <div className="h-20 w-56 overflow-hidden">
              <img src="/logodark.jpeg" alt="Espace Auto 92 — Nanterre" className="h-full w-full object-cover object-center" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Magasin de pièces détachées auto à Nanterre depuis {SITE.foundingDate}, pour les particuliers
              et les professionnels. Au comptoir, en livraison express ou expédiées partout en France.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex gap-3">
                <Icon name="map-pin" className="w-5 h-5 shrink-0 text-secondary-500" />
                <span className="text-white/80">
                  {SITE.street}, {SITE.postalCode} {SITE.city}
                </span>
              </li>
              <li className="flex gap-3">
                <Icon name="clock" className="w-5 h-5 shrink-0 text-secondary-500" />
                <span className="text-white/80">
                  {HOURS_LABELS.map((h) => (
                    <span key={h.days} className="block">
                      <span className="text-white">{h.days}</span> : {h.hours}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Icon name="phone" className="w-5 h-5 shrink-0 text-secondary-500" />
                <a href={`tel:${SITE.phone}`} className="font-semibold hover:text-secondary-400">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <WhatsAppIcon className="w-5 h-5 shrink-0 text-green-500" />
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-green-400">
                  Commander sur WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="font-display text-lg font-bold">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.name}>
                    <Link href={l.href} className="text-sm text-white/70 transition-colors hover:text-white">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Official channels */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-lg font-bold">Canaux officiels</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Nous vendons uniquement au magasin, sur ce site et via notre WhatsApp officiel.
            </p>
            <p className="mt-3 rounded-xl bg-white/5 p-3 text-xs leading-relaxed text-white/70 ring-1 ring-white/10">
              <span className="font-bold text-signal-400">Attention aux arnaques :</span> nous ne vendons rien sur
              Facebook ni sur les réseaux sociaux.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name} — Pièces détachées auto à Nanterre (92)</p>
          <p>Particuliers & professionnels · Toutes marques · Pièces garanties 1 an</p>
        </div>
      </div>
    </footer>
  )
}
