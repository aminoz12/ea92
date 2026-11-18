import Link from 'next/link'
import { LOYALTY } from '@/lib/shop/config'
import { formatEUR } from '@/lib/shop/format'
import { SITE } from '@/lib/site'
import { SectionHeading } from '../ui/SectionHeading'
import { Icon, WhatsAppIcon, type IconName } from '../ui/Icon'

const club = LOYALTY.particulier

// Services for private customers, beyond the 4 ways to receive a part
// (those sit in the strip under the hero).
const SERVICES: { icon: IconName | 'whatsapp'; title: string; text: string; href: string; cta: string; external?: boolean }[] = [
  {
    icon: 'seal-check',
    title: 'La bonne pièce avec votre plaque',
    text: 'Saisissez votre immatriculation : seules les pièces compatibles avec votre véhicule s’affichent.',
    href: '/boutique',
    cta: 'Trouver ma pièce',
  },
  {
    icon: 'whatsapp',
    title: 'Conseil sur WhatsApp',
    text: 'Une photo de la carte grise ou de l’ancienne pièce suffit : un vendeur vous répond avec la bonne référence.',
    href: `https://wa.me/${SITE.whatsapp}`,
    cta: 'Écrire au magasin',
    external: true,
  },
  {
    icon: 'wrench',
    title: 'Montage à prix fixe',
    text: 'Votre pièce livrée chez un garage partenaire, qui la monte à un prix annoncé à l’avance.',
    href: '/montage-garage',
    cta: 'Voir les tarifs',
  },
  {
    icon: 'truck',
    title: 'Suivi en temps réel',
    text: 'Préparation, arrivée au magasin, coursier ou colis : suivez votre commande étape par étape.',
    href: '/suivi-commande',
    cta: 'Suivre une commande',
  },
  {
    icon: 'clipboard',
    title: 'Carnet d’entretien & rappel CT',
    text: 'Vos achats remplissent votre carnet. Rappel WhatsApp avant chaque échéance et avant le contrôle technique.',
    href: '/carnet-entretien',
    cta: 'Voir le carnet',
  },
  {
    icon: 'gift',
    title: 'Club fidélité',
    text: `${club.pointsPerEuro} point par euro, ${formatEUR(club.voucherValueTTC)} offerts tous les ${club.voucherEveryPoints} points, +${club.welcomePoints} points à l’inscription.`,
    href: '/fidelite',
    cta: 'Rejoindre le club',
  },
  {
    icon: 'bolt',
    title: 'Test de batterie gratuit',
    text: 'Passez au magasin : on teste votre batterie gratuitement, avant qu’elle ne vous lâche un matin d’hiver.',
    href: '/boutique?categorie=demarrage',
    cta: 'Voir les batteries',
  },
  {
    icon: 'refresh',
    title: 'Échange standard',
    text: 'Démarreurs, alternateurs, étriers : la consigne vous est remboursée au retour de l’ancienne pièce.',
    href: '/livraison-retrait#consigne',
    cta: 'Comment ça marche',
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-32 bg-white py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Plus qu’un magasin de pièces"
          subtitle="Tout ce qu’on fait pour vous simplifier l’entretien, au comptoir comme en ligne."
        />
        {/* One bordered grid with hairline dividers (gap-px over a gray
            background), not eight separate cards. */}
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 lg:grid-cols-4">
          {SERVICES.map((s) => {
            const inner = (
              <>
                <span className={`shrink-0 ${s.icon === 'whatsapp' ? 'text-green-600' : 'text-secondary-600'}`}>
                  {s.icon === 'whatsapp' ? <WhatsAppIcon className="w-7 h-7" /> : <Icon name={s.icon} className="w-7 h-7" strokeWidth={1.6} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-display text-sm font-bold leading-snug text-gray-900 sm:text-base">
                    {s.title}
                    <Icon name="arrow-right" className="hidden h-4 w-4 shrink-0 text-secondary-600 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 sm:block" />
                  </span>
                  <span className="mt-1 hidden text-sm leading-relaxed text-gray-600 sm:block">{s.text}</span>
                </span>
              </>
            )
            // Phones: icon + title; the description shows from tablet width up.
            const cls = 'group flex h-full flex-col gap-2 bg-white p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:gap-4 sm:p-5'
            return (
              <li key={s.title}>
                {s.external ? (
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link href={s.href} className={cls}>
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
