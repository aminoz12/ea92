import Link from 'next/link'
import type { CatalogCar } from '@/lib/integrations/autoprecision/catalog.server'
import { Icon } from '@/components/ui/Icon'

const year = (yyyymm?: number) => (yyyymm ? Math.floor(yyyymm / 100) : null)

// The vehicle the catalogue pages are filtered on: name, the facts that tell
// two versions apart (fuel, power, years, engine codes) and a way to change it.
export function CatalogVehicleBar({ car, backTo }: { car: CatalogCar; backTo?: { href: string; label: string } }) {
  const from = year(car.from)
  const to = year(car.to)
  const facts = [
    car.fuel,
    car.powerHp ? `${car.powerHp} ch${car.powerKw ? ` (${car.powerKw} kW)` : ''}` : '',
    from ? (to ? `${from} – ${to}` : `depuis ${from}`) : '',
    car.body ?? '',
    car.engineCodes.length ? `Moteur ${car.engineCodes.slice(0, 3).join(', ')}` : '',
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-4 rounded-xl border-l-4 border-secondary-600 bg-gray-900 p-5 text-white sm:flex-row sm:items-center sm:p-6">
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-white/70">
          <Icon name="check-circle" weight="fill" className="h-4 w-4 shrink-0 text-emerald-400" />
          Votre véhicule
        </p>
        <p className="mt-1 font-display text-2xl font-bold leading-tight lg:text-3xl">
          {car.make} {car.model} <span className="text-secondary-500">{car.version}</span>
        </p>
        <p className="mt-1 text-sm text-white/70">{facts.join(' · ')}</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
        {backTo && (
          <Link href={backTo.href} className="underline underline-offset-4 hover:text-signal-400">
            {backTo.label}
          </Link>
        )}
        <Link href="/pieces" className="underline underline-offset-4 hover:text-signal-400">
          Changer de véhicule
        </Link>
      </div>
    </div>
  )
}
