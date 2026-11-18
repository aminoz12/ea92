// Site icons — Phosphor (MIT), imported one by one from the SSR build so they
// work in server and client components and only the icons used are bundled.
//
// Weight is chosen automatically so pages don't have to care:
//   - large "feature" icons (w-6 and up)  → duotone (two-tone, softer)
//   - arrows, checks, +/−, small UI icons → bold when asked (strokeWidth ≥ 2.2)
//   - everything else                     → regular
// Pass `weight` to force one.
import type { Icon as PhosphorIcon, IconWeight } from '@phosphor-icons/react'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight'
import { ArrowsClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowsClockwise'
import { BellIcon } from '@phosphor-icons/react/dist/ssr/Bell'
import { BuildingsIcon } from '@phosphor-icons/react/dist/ssr/Buildings'
import { CalendarCheckIcon } from '@phosphor-icons/react/dist/ssr/CalendarCheck'
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr/CaretLeft'
import { CaretRightIcon } from '@phosphor-icons/react/dist/ssr/CaretRight'
import { ChartBarIcon } from '@phosphor-icons/react/dist/ssr/ChartBar'
import { ChatCircleTextIcon } from '@phosphor-icons/react/dist/ssr/ChatCircleText'
import { CheckIcon } from '@phosphor-icons/react/dist/ssr/Check'
import { CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle'
import { ClipboardTextIcon } from '@phosphor-icons/react/dist/ssr/ClipboardText'
import { ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock'
import { CreditCardIcon } from '@phosphor-icons/react/dist/ssr/CreditCard'
import { FileTextIcon } from '@phosphor-icons/react/dist/ssr/FileText'
import { GiftIcon } from '@phosphor-icons/react/dist/ssr/Gift'
import { HeartIcon } from '@phosphor-icons/react/dist/ssr/Heart'
import { InfoIcon } from '@phosphor-icons/react/dist/ssr/Info'
import { KeyIcon } from '@phosphor-icons/react/dist/ssr/Key'
import { LightningIcon } from '@phosphor-icons/react/dist/ssr/Lightning'
import { ListIcon } from '@phosphor-icons/react/dist/ssr/List'
import { LockSimpleIcon } from '@phosphor-icons/react/dist/ssr/LockSimple'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass'
import { MapPinIcon } from '@phosphor-icons/react/dist/ssr/MapPin'
import { MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus'
import { MoneyIcon } from '@phosphor-icons/react/dist/ssr/Money'
import { PackageIcon } from '@phosphor-icons/react/dist/ssr/Package'
import { PercentIcon } from '@phosphor-icons/react/dist/ssr/Percent'
import { PhoneIcon } from '@phosphor-icons/react/dist/ssr/Phone'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus'
import { SealCheckIcon } from '@phosphor-icons/react/dist/ssr/SealCheck'
import { ShieldCheckIcon } from '@phosphor-icons/react/dist/ssr/ShieldCheck'
import { ShoppingCartSimpleIcon } from '@phosphor-icons/react/dist/ssr/ShoppingCartSimple'
import { SlidersHorizontalIcon } from '@phosphor-icons/react/dist/ssr/SlidersHorizontal'
import { SparkleIcon } from '@phosphor-icons/react/dist/ssr/Sparkle'
import { SquaresFourIcon } from '@phosphor-icons/react/dist/ssr/SquaresFour'
import { StarIcon as PhStarIcon } from '@phosphor-icons/react/dist/ssr/Star'
import { StorefrontIcon } from '@phosphor-icons/react/dist/ssr/Storefront'
import { TagIcon } from '@phosphor-icons/react/dist/ssr/Tag'
import { TimerIcon } from '@phosphor-icons/react/dist/ssr/Timer'
import { TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash'
import { TruckIcon } from '@phosphor-icons/react/dist/ssr/Truck'
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User'
import { UsersIcon } from '@phosphor-icons/react/dist/ssr/Users'
import { WarningIcon } from '@phosphor-icons/react/dist/ssr/Warning'
import { WrenchIcon } from '@phosphor-icons/react/dist/ssr/Wrench'
import { XIcon } from '@phosphor-icons/react/dist/ssr/X'

const ICONS = {
  search: MagnifyingGlassIcon,
  cart: ShoppingCartSimpleIcon,
  user: UserIcon,
  truck: TruckIcon,
  store: StorefrontIcon,
  bolt: LightningIcon,
  box: PackageIcon,
  wrench: WrenchIcon,
  phone: PhoneIcon,
  check: CheckIcon,
  'check-circle': CheckCircleIcon,
  x: XIcon,
  'chevron-right': CaretRightIcon,
  'chevron-left': CaretLeftIcon,
  'chevron-down': CaretDownIcon,
  menu: ListIcon,
  clock: ClockIcon,
  timer: TimerIcon,
  'map-pin': MapPinIcon,
  shield: ShieldCheckIcon,
  gift: GiftIcon,
  bell: BellIcon,
  calendar: CalendarCheckIcon,
  document: FileTextIcon,
  'credit-card': CreditCardIcon,
  lock: LockSimpleIcon,
  tag: TagIcon,
  sparkles: SparkleIcon,
  'arrow-right': ArrowRightIcon,
  info: InfoIcon,
  building: BuildingsIcon,
  key: KeyIcon,
  grid: SquaresFourIcon,
  chart: ChartBarIcon,
  users: UsersIcon,
  percent: PercentIcon,
  refresh: ArrowsClockwiseIcon,
  'seal-check': SealCheckIcon,
  heart: HeartIcon,
  warning: WarningIcon,
  clipboard: ClipboardTextIcon,
  banknotes: MoneyIcon,
  minus: MinusIcon,
  plus: PlusIcon,
  trash: TrashIcon,
  filter: SlidersHorizontalIcon,
  chat: ChatCircleTextIcon,
} satisfies Record<string, PhosphorIcon>

export type IconName = keyof typeof ICONS

// Glyphs that are pure strokes: they stay line icons at any size.
const LINE_ONLY = new Set<IconName>(['check', 'x', 'chevron-right', 'chevron-left', 'chevron-down', 'arrow-right', 'minus', 'plus', 'menu', 'search'])
const LARGE = /(?:^|\s)(?:[a-z]+:)?[wh]-(?:6|7|8|9|10|11|12|14|16)(?:\s|$)/

export function Icon({
  name,
  className = 'w-5 h-5',
  strokeWidth = 1.8,
  weight,
}: {
  name: IconName
  className?: string
  /** Kept from the previous icon set: ≥ 2.2 asks for the bold weight. */
  strokeWidth?: number
  weight?: IconWeight
}) {
  const Glyph = ICONS[name]
  const auto: IconWeight = LINE_ONLY.has(name)
    ? strokeWidth >= 2.2
      ? 'bold'
      : 'regular'
    : LARGE.test(className)
      ? 'duotone'
      : strokeWidth >= 2.2
        ? 'bold'
        : 'regular'
  return <Glyph className={className} weight={weight ?? auto} aria-hidden="true" />
}

export function StarIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return <PhStarIcon className={className} weight="fill" aria-hidden="true" />
}

export function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.739-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}
