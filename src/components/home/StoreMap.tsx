import { SITE } from '@/lib/site'
import { Icon } from '../ui/Icon'

const ADDRESS = `${SITE.street}, ${SITE.postalCode} ${SITE.city}`
const Q = encodeURIComponent(`${SITE.name}, ${ADDRESS}`)

// Google map + one-tap directions. A placeholder sits behind the lazy iframe
// so the frame never shows as an empty white box while it loads.
export function StoreMap({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 ${className}`}>
      <div className="relative min-h-[320px] flex-1 bg-gray-100">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400" aria-hidden="true">
          <Icon name="map-pin" className="h-8 w-8 text-secondary-500" />
          <span className="text-sm font-semibold text-gray-500">{ADDRESS}</span>
        </div>
        <iframe
          src={`https://www.google.com/maps?q=${Q}&output=embed`}
          title={`Plan d’accès — ${SITE.name}, ${ADDRESS}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <div className="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200 text-sm font-semibold">
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${Q}`} target="_blank" rel="noopener noreferrer" className="py-3 text-center text-gray-800 hover:bg-gray-50">
          Google Maps
        </a>
        <a href={`https://waze.com/ul?q=${Q}&navigate=yes`} target="_blank" rel="noopener noreferrer" className="py-3 text-center text-gray-800 hover:bg-gray-50">
          Waze
        </a>
        <a href={`https://maps.apple.com/?q=${Q}`} target="_blank" rel="noopener noreferrer" className="py-3 text-center text-gray-800 hover:bg-gray-50">
          Plans (Apple)
        </a>
      </div>
    </div>
  )
}
