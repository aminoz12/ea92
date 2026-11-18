import { SITE } from '@/lib/site'

// Floating WhatsApp shortcut. The "Devis rapide ?" label only shows from
// tablet width up: on phones it covered buttons and text, so the round button
// alone stays (bottom-right, out of the way).
export function WhatsAppWidget() {
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}`

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-center gap-3 sm:bottom-6 sm:right-6">
      {/* Label bubble (tablet / desktop) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group pointer-events-auto relative hidden items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-5 py-2.5 font-display font-bold text-gray-900 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-green-500 hover:shadow-green-500/20 sm:flex"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50 motion-safe:animate-pulse" />
        <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-sm font-extrabold tracking-wide text-transparent md:text-base">
          Devis Rapide ?
        </span>
        <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-gray-200 bg-white transition-colors duration-300 group-hover:border-green-500" />
      </a>

      {/* Round WhatsApp button */}
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group pointer-events-auto relative" aria-label="Contactez-nous sur WhatsApp">
        <span className="absolute inset-0 rounded-full bg-green-500 opacity-40 blur-md transition-opacity duration-300 group-hover:opacity-80 motion-safe:animate-pulse" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 bg-gradient-to-tr from-green-600 via-green-500 to-green-400 text-white shadow-2xl transition-all duration-300 group-hover:scale-110 group-active:scale-95 md:h-16 md:w-16">
          <svg className="h-8 w-8 text-white drop-shadow-md md:h-9 md:w-9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
        </span>
      </a>
    </div>
  )
}
