'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useShop } from '@/providers/ShopProvider'
import { CATEGORIES } from '@/lib/shop/categories'
import { formatEUR } from '@/lib/shop/format'
import { storeStatus } from '@/lib/hours'
import { SITE } from '@/lib/site'
import { vehicleLabel } from '@/lib/integrations/vehicle'
import { VehiclePicker } from '../shop/VehiclePicker'
import { Icon, WhatsAppIcon } from '../ui/Icon'

const PARTICULIER_NAV = [
  { name: 'Boutique', href: '/boutique' },
  { name: 'Promos', href: '/boutique?promo=1' },
  { name: 'Livraison & retrait', href: '/livraison-retrait' },
  { name: 'Montage en garage', href: '/montage-garage' },
  { name: 'Fidélité', href: '/fidelite' },
  { name: 'Conseils', href: '/blog' },
  { name: 'Le magasin', href: '/contact' },
]

const PRO_NAV = [
  { name: 'Espace Pro', href: '/pro/espace' },
  { name: 'Conditions & encours', href: '/pro#conditions' },
  { name: 'Livraison atelier', href: '/livraison-retrait' },
  { name: 'Fidélité Pro', href: '/fidelite?espace=pro' },
  { name: 'Le magasin', href: '/contact' },
]

// Close a popover when clicking outside of it.
function useOutsideClose(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])
  return ref
}

export function Header() {
  const pathname = usePathname() ?? '/'
  const isPro = pathname.startsWith('/pro')
  const { count, subtotalTTC, vehicle, hydrated } = useShop()

  const [menuOpen, setMenuOpen] = useState(false)
  const [catsOpen, setCatsOpen] = useState(false)
  const [vehicleOpen, setVehicleOpen] = useState(false)
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null)

  const catsRef = useOutsideClose(catsOpen, () => setCatsOpen(false))
  const vehicleRef = useOutsideClose(vehicleOpen, () => setVehicleOpen(false))

  // Open/closed badge — computed on the client to avoid hydration mismatch.
  useEffect(() => {
    const tick = () => setStatus(storeStatus())
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setCatsOpen(false)
    setVehicleOpen(false)
  }, [pathname])

  // Lock page scroll behind the mobile drawer.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const nav = isPro ? PRO_NAV : PARTICULIER_NAV
  // Vehicle from storage: only known after hydration.
  const myVehicle = hydrated ? vehicle : null
  const isActive = (href: string) => {
    // Filtered views (e.g. Promos = /boutique?promo=1) never take the active
    // state, otherwise they light up together with their parent page.
    if (href.includes('?') || href.includes('#')) return false
    const path = href.split('#')[0]
    return path === '/' ? pathname === '/' : pathname === path
  }

  // The search takes the name of a part, never a reference (the site does not
  // give references away). The search page then asks for the plate, unless the
  // visitor's vehicle is already known: a part is always looked up for a vehicle.
  const searchAction = myVehicle?.ktype ? `/pieces/${myVehicle.ktype}` : '/pieces/recherche'
  const searchName = 'q'
  // Short enough to show whole on a phone.
  const searchPlaceholder = 'Rechercher une pièce (ex. plaquettes)'

  // The search bar is the main tool of the header: full-height field with an
  // ink border and a labelled button. Callers set the display (flex / hidden).
  const searchForm = (className: string) => (
    <form
      action={searchAction}
      role="search"
      className={`h-11 overflow-hidden rounded-lg bg-white ring-2 ring-gray-900 transition-shadow focus-within:ring-secondary-600 lg:h-12 ${className}`}
    >
      <input
        type="search"
        name={searchName}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-gray-900 outline-none placeholder:text-gray-500"
      />
      <button
        type="submit"
        aria-label="Rechercher"
        className="flex shrink-0 items-center gap-2 bg-gray-900 px-4 font-display text-sm font-bold text-white transition-colors hover:bg-secondary-600 lg:px-5"
      >
        <Icon name="search" className="h-5 w-5" strokeWidth={2.4} />
        <span className="hidden xl:inline">Rechercher</span>
      </button>
    </form>
  )

  // Particuliers / Professionnels as two flat tabs (active = red underline).
  const audienceTab = (active: boolean) =>
    `flex h-9 items-center border-b-2 px-3 font-semibold transition-colors ${
      active ? 'border-secondary-500 bg-white/10 text-white' : 'border-transparent text-white/60 hover:text-white'
    }`
  const audienceSwitch = (className = '') => (
    <nav aria-label="Espace" className={`flex items-stretch ${className}`}>
      <Link href="/" aria-current={!isPro ? 'page' : undefined} className={audienceTab(!isPro)}>
        Particuliers
      </Link>
      <Link href="/pro" aria-current={isPro ? 'page' : undefined} className={audienceTab(isPro)}>
        Professionnels
      </Link>
    </nav>
  )

  return (
    <>
      {/* Utility bar */}
      <div className="bg-gray-900 text-xs text-white">
        <div className="max-w-7xl mx-auto flex h-9 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {audienceSwitch()}
          <div className="hidden items-center gap-6 text-white/75 md:flex">
            {status && (
              <span className="flex items-center gap-1.5">
                <Icon
                  name={status.open ? 'check-circle' : 'clock'}
                  weight={status.open ? 'fill' : 'regular'}
                  className={`h-4 w-4 ${status.open ? 'text-emerald-400' : 'text-white/50'}`}
                />
                Magasin de Nanterre · {status.label}
              </span>
            )}
            <Link href="/livraison-retrait" className="flex items-center gap-1.5 hover:text-white">
              <Icon name="truck" className="h-4 w-4" />
              Livraison partout en France
            </Link>
            <Link href="/suivi-commande" className="flex items-center gap-1.5 hover:text-white">
              <Icon name="box" className="h-4 w-4" />
              Suivi de commande
            </Link>
          </div>
          <a href={`tel:${SITE.phone}`} className="flex items-center gap-1.5 font-display text-sm font-bold text-white hover:text-signal-400">
            <Icon name="phone" weight="fill" className="h-4 w-4" />
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>

      {/* Sticky main bar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3 lg:h-[76px] lg:gap-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              className="lg:hidden -ml-1 p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Icon name="menu" className="w-6 h-6" />
            </button>

            <Link href={isPro ? '/pro' : '/'} className="flex shrink-0 items-center gap-2" aria-label="Espace Auto 92 — accueil">
              <img src="/logo.png" alt="Espace Auto 92" className="h-10 lg:h-14 w-auto object-contain" />
              {isPro && (
                <span className="rounded-md bg-gray-900 px-2 py-1 text-[11px] font-bold tracking-widest text-white">
                  PRO
                </span>
              )}
            </Link>

            {/* My vehicle (desktop, particuliers) */}
            {!isPro && (
              <div ref={vehicleRef} className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setVehicleOpen((v) => !v)}
                  aria-expanded={vehicleOpen}
                  aria-haspopup="dialog"
                  aria-label={myVehicle ? `Mon véhicule : ${vehicleLabel(myVehicle)}` : 'Ajouter mon véhicule avec ma plaque'}
                  className={`flex h-12 items-stretch overflow-hidden rounded-lg bg-white text-left transition-shadow hover:ring-2 hover:ring-gray-900 ${
                    vehicleOpen ? 'ring-2 ring-gray-900' : 'ring-1 ring-gray-300'
                  }`}
                >
                  {/* Shaped like a French plate: blue band, then the plate
                      number + model once a vehicle is identified. */}
                  <span className="flex w-7 shrink-0 items-end justify-center bg-[#003399] pb-1.5 text-[10px] font-bold leading-none text-white" aria-hidden="true">
                    F
                  </span>
                  <span className="flex min-w-0 max-w-[170px] flex-col justify-center pl-3 pr-1 leading-tight">
                    <span className={myVehicle ? 'font-display text-xs font-semibold tracking-[0.1em] text-gray-600' : 'text-[11px] text-gray-500'}>
                      {myVehicle?.plate || 'Mon véhicule'}
                    </span>
                    <span className="flex items-center gap-1 font-display text-[15px] font-bold text-gray-900">
                      <span className="truncate">{myVehicle ? `${myVehicle.make} ${myVehicle.model}` : 'Ajouter ma plaque'}</span>
                      {myVehicle && <Icon name="check-circle" weight="fill" className="h-4 w-4 shrink-0 text-emerald-600" />}
                    </span>
                  </span>
                  <span className="flex items-center pl-1 pr-2.5 text-gray-500">
                    <Icon name="chevron-down" strokeWidth={2.4} className={`h-4 w-4 transition-transform ${vehicleOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                {/* z-[60]: above the menu row below, which otherwise paints over the panel */}
                {vehicleOpen && (
                  <div role="dialog" aria-label="Mon véhicule" className="absolute left-0 top-full z-[60] mt-2 w-[420px] rounded-xl bg-white p-5 shadow-2xl ring-1 ring-gray-200">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-xl font-bold text-gray-900">Mon véhicule</p>
                        <p className="mt-0.5 text-sm text-gray-600">
                          {myVehicle
                            ? 'Les pièces compatibles sont signalées dans toute la boutique.'
                            : 'Saisissez votre plaque : on vous montre les pièces compatibles.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVehicleOpen(false)}
                        aria-label="Fermer"
                        className="-mr-1.5 -mt-1.5 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <Icon name="x" strokeWidth={2.4} className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-4">
                      <VehiclePicker compact autoFocus />
                    </div>
                    {myVehicle ? (
                      <Link
                        href={myVehicle.ktype ? `/pieces/${myVehicle.ktype}` : '/boutique'}
                        onClick={() => setVehicleOpen(false)}
                        className="mt-4 flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 font-display text-sm font-bold text-white hover:bg-secondary-600"
                      >
                        Voir les pièces compatibles <Icon name="arrow-right" strokeWidth={2.4} className="h-4 w-4" />
                      </Link>
                    ) : (
                      <p className="mt-4 border-t border-gray-200 pt-3 text-sm text-gray-600">
                        Pas la plaque sous la main ?{' '}
                        <a
                          href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Bonjour, voici ma carte grise pour trouver la bonne pièce :')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-gray-900 underline underline-offset-4 hover:text-secondary-600"
                        >
                          Envoyez votre carte grise sur WhatsApp
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {searchForm('hidden md:flex flex-1')}

            <div className="ml-auto flex items-center gap-1 sm:gap-3">
              {!isPro ? (
                <>
                  <Link href="/fidelite" className="hidden items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-100 sm:flex">
                    <Icon name="user" className="h-7 w-7 text-gray-900" />
                    <span className="hidden text-left leading-tight xl:block">
                      <span className="block text-[11px] text-gray-500">Club fidélité</span>
                      <span className="block font-display text-[15px] font-bold text-gray-900">Mon compte</span>
                    </span>
                  </Link>
                  <Link href="/panier" aria-label={`Panier (${count} article${count > 1 ? 's' : ''})`} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-100">
                    <span className="relative">
                      <Icon name="cart" className="h-7 w-7 text-gray-900" />
                      {hydrated && count > 0 && (
                        <span className="absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-secondary-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                          {count}
                        </span>
                      )}
                    </span>
                    <span className="hidden text-left leading-tight xl:block">
                      <span className="block text-[11px] text-gray-500">Mon panier</span>
                      <span className="block font-display text-[15px] font-bold text-gray-900">{formatEUR(hydrated ? subtotalTTC : 0)}</span>
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/pro/espace" className="inline-flex h-11 items-center gap-2 rounded-lg bg-gray-900 px-3 font-display text-sm font-bold text-white hover:bg-gray-800 sm:px-4">
                    <Icon name="lock" className="h-4 w-4" />
                    <span className="hidden sm:inline">Espace Pro</span>
                  </Link>
                  <Link href="/pro#ouvrir-un-compte" className="hidden h-11 items-center rounded-lg bg-secondary-600 px-4 font-display text-sm font-bold text-white hover:bg-secondary-700 sm:inline-flex">
                    Ouvrir un compte
                  </Link>
                </>
              )}
            </div>
          </div>

          {searchForm('mb-3 flex md:hidden')}
        </div>

        {/* Navigation row (desktop) */}
        <div className="hidden lg:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex h-12 items-center gap-5 px-4 sm:px-6 lg:px-8 xl:gap-6">
            {!isPro && (
              <>
                <div ref={catsRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setCatsOpen((v) => !v)}
                    aria-expanded={catsOpen}
                    className="flex h-12 w-56 items-center gap-3 rounded-t-lg bg-secondary-600 px-5 font-display text-sm font-bold text-white transition-colors hover:bg-secondary-700 xl:w-64"
                  >
                    <Icon name="menu" className="w-5 h-5" />
                    Tous les rayons
                    <Icon name="chevron-down" className={`ml-auto w-4 h-4 transition-transform ${catsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {/* Vertical department list hanging under the red block */}
                  {catsOpen && (
                    <div className="absolute left-0 top-full z-50 w-56 overflow-hidden rounded-b-lg bg-white shadow-2xl ring-1 ring-gray-200 xl:w-64">
                      <ul className="py-1.5">
                        {CATEGORIES.map((c) => (
                          <li key={c.id}>
                            <Link
                              href={`/boutique?categorie=${c.id}`}
                              className="group flex items-center gap-3 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 hover:text-secondary-600"
                            >
                              <img src={c.image} alt="" className="h-7 w-7 shrink-0 object-contain mix-blend-multiply" />
                              <span className="flex-1 font-medium">{c.name}</span>
                              <Icon name="chevron-right" className="w-4 h-4 text-gray-300 group-hover:text-secondary-600" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-gray-100 py-1.5 text-sm">
                        <Link href="/boutique?promo=1" className="flex items-center justify-between px-4 py-2 font-semibold text-secondary-600 hover:bg-gray-50">
                          Promos & petits prix
                          <span className="rounded bg-secondary-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">promo</span>
                        </Link>
                        <Link href="/boutique" className="block px-4 py-2 font-semibold text-gray-900 hover:bg-gray-50">
                          Toute la boutique
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Same condensed uppercase as the buttons; Promos stays red */}
            <nav className="flex items-center gap-4 xl:gap-6" aria-label="Navigation principale">
              {nav.map((item) => {
                const active = isActive(item.href)
                const promo = item.href.includes('promo=1')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex h-12 items-center whitespace-nowrap font-display text-sm font-semibold transition-colors ${
                      active || promo ? 'text-secondary-600' : 'text-gray-800 hover:text-secondary-600'
                    }`}
                  >
                    {item.name}
                    {active && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-secondary-600" />}
                  </Link>
                )
              })}
            </nav>

            <div className="ml-auto">
              {!isPro ? (
                <Link href="/pro" className="hidden h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-3 font-display text-xs font-bold text-gray-900 ring-1 ring-gray-300 hover:ring-gray-900 xl:inline-flex">
                  <Icon name="building" className="h-4 w-4" />
                  Vous êtes un pro ?
                </Link>
              ) : (
                <Link href="/" className="hidden h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-3 font-display text-xs font-bold text-gray-900 ring-1 ring-gray-300 hover:ring-gray-900 xl:inline-flex">
                  <Icon name="user" className="h-4 w-4" />
                  Espace particuliers
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gray-900 px-4 py-3 text-xs text-white">
              {audienceSwitch()}
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Fermer" className="rounded-lg p-1.5 hover:bg-white/10">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            {!isPro && (
              <div className="border-b border-gray-100 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Mon véhicule</p>
                {hydrated && vehicle && <p className="sr-only">{vehicleLabel(vehicle)}</p>}
                <VehiclePicker compact />
              </div>
            )}

            <nav className="p-2" aria-label="Navigation mobile">
              {nav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-base font-semibold ${
                    isActive(item.href) ? 'bg-secondary-50 text-secondary-700' : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                  <Icon name="chevron-right" className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
              <Link href="/suivi-commande" className="flex items-center justify-between rounded-xl px-3 py-3 text-base font-semibold text-gray-800 hover:bg-gray-50">
                Suivi de commande
                <Icon name="chevron-right" className="w-4 h-4 text-gray-400" />
              </Link>
            </nav>

            {!isPro && (
              <div className="border-t border-gray-100 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Rayons</p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((c) => (
                    <Link key={c.id} href={`/boutique?categorie=${c.id}`} className="flex items-center gap-2 rounded-xl bg-gray-50 p-2 text-xs font-semibold text-gray-800">
                      <img src={c.image} alt="" className="h-8 w-8 object-contain" />
                      <span className="leading-tight">{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto space-y-2 border-t border-gray-100 p-4">
              {status && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <span className={`h-2 w-2 rounded-full ${status.open ? 'bg-green-500' : 'bg-red-500'}`} />
                  Magasin de Nanterre · {status.label}
                </p>
              )}
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 font-bold text-white">
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp
              </a>
              <a href={`tel:${SITE.phone}`} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-900 font-bold text-white">
                <Icon name="phone" className="w-5 h-5" />
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
