import Link from 'next/link'
import { FULFILMENT_MODES } from '@/lib/shop/fulfilment'
import type { FulfilmentMode } from '@/lib/shop/types'
import { Icon, type IconName } from '../ui/Icon'

const ICONS: Record<FulfilmentMode, IconName> = {
  retrait: 'store',
  coursier: 'bolt',
  colis: 'box',
  montage: 'wrench',
}

const LINKS: Record<FulfilmentMode, string> = {
  retrait: '/livraison-retrait#retrait',
  coursier: '/livraison-retrait#coursier',
  colis: '/livraison-retrait#colis',
  montage: '/montage-garage',
}

// The 4 ways to get a part — compact strip (home, product page).
export function FulfilmentStrip({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 overflow-hidden rounded-xl border border-gray-200 bg-white lg:grid-cols-4 ${className}`}>
      {FULFILMENT_MODES.map((m, i) => (
        <Link
          key={m.id}
          href={LINKS[m.id]}
          className={`group flex items-start gap-3 p-4 transition-colors hover:bg-gray-50 sm:p-5 ${
            i % 2 === 1 ? 'border-l border-gray-200' : ''
          } ${i >= 2 ? 'border-t border-gray-200 lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}
        >
          {/* Two-tone icon on its own — no tinted square behind it */}
          <Icon name={ICONS[m.id]} className="h-9 w-9 shrink-0 text-secondary-600" />
          <span className="min-w-0 leading-tight">
            <span className="block font-display text-base font-bold text-gray-900 sm:text-lg">{m.short}</span>
            <span className="mt-0.5 block text-xs text-gray-500">{m.delay}</span>
            <span className="mt-1 block text-xs font-semibold text-gray-900">{m.priceLabel}</span>
          </span>
        </Link>
      ))}
    </div>
  )
}
