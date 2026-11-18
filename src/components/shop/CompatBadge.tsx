'use client'

import { useShop } from '@/providers/ShopProvider'
import { isCompatible } from '@/lib/integrations/vehicle'
import type { PublicProduct } from '@/lib/shop/types'
import { Icon } from '../ui/Icon'

// "Compatible avec votre Peugeot 208" — only once a vehicle is identified.
// Same quiet status-line style as StockBadge.
export function CompatBadge({ product, className = '' }: { product: Pick<PublicProduct, 'fits'>; className?: string }) {
  const { vehicle, hydrated } = useShop()
  if (!hydrated || !vehicle) return null
  const ok = isCompatible(product, vehicle)
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${ok ? 'text-gray-800' : 'text-secondary-700'} ${className}`}>
      <Icon name={ok ? 'check-circle' : 'warning'} weight="fill" className={`h-4 w-4 shrink-0 ${ok ? 'text-emerald-600' : 'text-secondary-600'}`} />
      {ok ? `Compatible ${vehicle.make} ${vehicle.model}` : `Non compatible ${vehicle.model}`}
    </span>
  )
}
