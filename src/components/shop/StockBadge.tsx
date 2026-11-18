import { AVAILABILITY } from '@/lib/shop/format'
import type { Availability } from '@/lib/shop/types'
import { Icon, type IconName } from '../ui/Icon'

// Availability as a quiet status line (solid icon + plain text), not a chip:
// green tick when it is on the shelf, a neutral timer when it has to come in.
const TONES: Record<'green' | 'amber' | 'gray', { icon: IconName; iconCls: string; textCls: string }> = {
  green: { icon: 'check-circle', iconCls: 'text-emerald-600', textCls: 'text-gray-800' },
  amber: { icon: 'timer', iconCls: 'text-gray-500', textCls: 'text-gray-600' },
  gray: { icon: 'clock', iconCls: 'text-gray-400', textCls: 'text-gray-600' },
}

export function StockBadge({ availability, long = false }: { availability: Availability; long?: boolean }) {
  const a = AVAILABILITY[availability]
  const t = TONES[a.tone]
  return (
    <span className={`inline-flex items-center gap-1.5 ${long ? 'text-sm' : 'text-xs'} font-medium ${t.textCls}`}>
      <Icon name={t.icon} weight="fill" className={`${long ? 'h-[18px] w-[18px]' : 'h-4 w-4'} shrink-0 ${t.iconCls}`} />
      {long ? a.label : a.short}
    </span>
  )
}
