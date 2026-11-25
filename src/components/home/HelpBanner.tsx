import { SITE } from '@/lib/site'
import { Icon, WhatsAppIcon } from '../ui/Icon'

// "Need help finding the right part?" — straight to a human.
export function HelpBanner({ message = 'Bonjour, j’ai besoin d’aide pour trouver une pièce.' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-xl bg-secondary-600 px-6 py-7 text-center text-white sm:px-10 lg:flex-row lg:text-left">
      <div className="flex-1">
        <h2 className="font-display text-xl font-bold lg:text-2xl">Besoin d’aide pour trouver la bonne pièce ?</h2>
        <p className="mt-1 text-white/85">
          Envoyez une photo de votre carte grise ou de la pièce : un conseiller vous répond avec la bonne pièce et son prix.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <a
          href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 font-display font-bold text-gray-900 hover:bg-gray-100"
        >
          <WhatsAppIcon className="w-5 h-5 text-green-600" />
          Écrire sur WhatsApp
        </a>
        <a
          href={`tel:${SITE.phone}`}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 font-display font-bold text-white ring-2 ring-white/40 hover:bg-white/10"
        >
          <Icon name="phone" className="w-5 h-5" />
          {SITE.phoneDisplay}
        </a>
      </div>
    </div>
  )
}
