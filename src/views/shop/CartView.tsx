'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Icon, StarIcon, WhatsAppIcon, type IconName } from '@/components/ui/Icon'
import { useShop } from '@/providers/ShopProvider'
import { FULFILMENT, getFittingJob } from '@/lib/shop/config'
import { FULFILMENT_MODES, type QuoteEstimate } from '@/lib/shop/fulfilment'
import { DEMO_GARAGES } from '@/lib/shop/garages'
import { formatEUR } from '@/lib/shop/format'
import { DEPOSIT_RETURN } from '@/lib/shop/deposit'
import { normalizePhone } from '@/lib/loyalty/cartRecovery'
import { SITE } from '@/lib/site'
import type { CartLine, FulfilmentMode } from '@/lib/shop/types'
import type { RelayPoint } from '@/lib/integrations/boxtal.server'
import { parcelWeightKg } from '@/lib/shop/weight'

const formatKg = (kg: number) => `${kg.toFixed(1).replace('.', ',')} kg`

const formatDistance = (m: number) => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1).replace('.', ',')} km`)

const MODE_ICONS: Record<FulfilmentMode, IconName> = { retrait: 'store', coursier: 'bolt', colis: 'box', montage: 'wrench' }

type Quote = QuoteEstimate & { source: string }

const field =
  'h-12 w-full rounded-lg bg-white px-3.5 text-[15px] text-gray-900 ring-1 ring-gray-300 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900'
const fieldLabel = 'mb-1.5 block text-sm font-semibold text-gray-800'
const radioCard = (selected: boolean, disabled = false) =>
  `relative flex gap-3 rounded-lg bg-white p-4 transition-shadow focus-within:ring-2 focus-within:ring-gray-900 ${
    selected ? 'ring-2 ring-gray-900' : 'ring-1 ring-gray-200 hover:ring-gray-400'
  } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`

// Numbered step title (1 Panier · 2 Réception · 3 Coordonnées).
function StepTitle({ n, children, aside }: { n: number; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-900 font-display text-base font-bold text-white">{n}</span>
      <h2 className="font-display text-2xl font-bold text-gray-900">{children}</h2>
      {aside && <span className="text-sm text-gray-500">{aside}</span>}
    </div>
  )
}

export function CartView() {
  const { cart, count, subtotalTTC, depositsTTC, setQty, removeLine, restoreCart, vehicle, hydrated } = useShop()

  const [mode, setMode] = useState<FulfilmentMode>('retrait')
  const [pickup, setPickup] = useState<'comptoir' | 'casier'>('comptoir')
  const [parcelOption, setParcelOption] = useState<'relais' | 'domicile'>('relais')
  const [address, setAddress] = useState({ street: '', postalCode: '', city: '' })
  const [quote, setQuote] = useState<Quote | null>(null)
  const [quoting, setQuoting] = useState(false)
  const [quoteError, setQuoteError] = useState('')
  // Relay delivery: the points near the address, asked with the delivery price.
  // 'off' = the shop has no relay list to offer (no carrier account connected): no choice is asked.
  const [relayStatus, setRelayStatus] = useState<'idle' | 'loading' | 'ready' | 'off' | 'error'>('idle')
  const [relays, setRelays] = useState<RelayPoint[]>([])
  const [relayCode, setRelayCode] = useState('')
  const [relayError, setRelayError] = useState('')
  const [garageId, setGarageId] = useState(DEMO_GARAGES[0].id)
  const [contact, setContact] = useState({ name: '', phone: '' })
  const [optIn, setOptIn] = useState(false)
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')

  const phoneE164 = normalizePhone(contact.phone)

  // Back from the payment page without paying: the cart is untouched.
  useEffect(() => {
    if (!hydrated) return
    if (new URLSearchParams(window.location.search).get('paiement') !== 'annule') return
    setNotice({ ok: false, text: 'Paiement annulé : rien n’a été débité et votre panier est conservé.' })
    window.history.replaceState(null, '', '/panier')
  }, [hydrated])

  // Parcel weight (parts + packaging), computed like the server does (lib/shop/weight.ts).
  const weightKg = useMemo(() => parcelWeightKg(cart), [cart])
  const parcelBattery = cart.some((l) => l.parcelForbidden)
  const parcelTooHeavy = weightKg > FULFILMENT.parcel.maxKg
  const parcelBlocked = parcelBattery || parcelTooHeavy
  const courierBlocked = cart.some((l) => (l.weightKg ?? 0) > FULFILMENT.courier.maxItemKg)
  const fittingLines = cart.filter((l) => getFittingJob(l.fittingJob))
  const fittingTotal = fittingLines.reduce((s, l) => s + (getFittingJob(l.fittingJob)?.priceTTC ?? 0), 0)
  const fittingHasQuote = fittingLines.some((l) => getFittingJob(l.fittingJob)?.priceTTC === null)

  const needsQuote = mode === 'coursier' || mode === 'colis'
  const deliveryFee = needsQuote ? (quote?.available ? quote.feeTTC : null) : 0
  const totalTTC = Math.round((subtotalTTC + (deliveryFee ?? 0) + depositsTTC) * 100) / 100

  const wantsRelay = mode === 'colis' && parcelOption === 'relais'

  const resetRelay = () => {
    setRelayStatus('idle')
    setRelays([])
    setRelayCode('')
    setRelayError('')
  }

  const fetchRelays = async () => {
    setRelayStatus('loading')
    setRelayCode('')
    setRelayError('')
    try {
      const res = await fetch('/api/delivery/relay-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      })
      const json = (await res.json().catch(() => ({}))) as { configured?: boolean; points?: RelayPoint[]; error?: string }
      if (!res.ok) throw new Error(json.error || 'Les points relais sont momentanément indisponibles.')
      setRelays(json.points ?? [])
      setRelayStatus(json.configured === false ? 'off' : 'ready')
    } catch (err) {
      setRelays([])
      setRelayStatus('error')
      setRelayError(err instanceof Error ? err.message : 'Les points relais sont momentanément indisponibles.')
    }
  }

  const fetchQuote = async () => {
    setQuoteError('')
    if (!/^\d{5}$/.test(address.postalCode)) {
      setQuoteError('Indiquez un code postal à 5 chiffres.')
      return
    }
    setQuoting(true)
    try {
      const res = await fetch('/api/delivery/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, ...address, cartTotalTTC: subtotalTTC, weightKg, option: parcelOption }),
      })
      const json = (await res.json()) as { quote?: Quote; error?: string }
      if (!res.ok || !json.quote) throw new Error(json.error || 'Tarif indisponible')
      setQuote(json.quote)
      if (wantsRelay && json.quote.available) await fetchRelays()
    } catch (err) {
      setQuoteError(err instanceof Error ? err.message : 'Tarif indisponible')
    } finally {
      setQuoting(false)
    }
  }

  const changeMode = (m: FulfilmentMode) => {
    setMode(m)
    setQuote(null)
    setQuoteError('')
    resetRelay()
  }

  // A relay must be chosen whenever the shop has a list to choose from (the server checks it again).
  const relayRequired = wantsRelay && (relayStatus === 'ready' || relayStatus === 'error' || relayStatus === 'loading')
  const chosenRelay = relays.find((p) => p.code === relayCode)
  // Monday-first index of today, for the "open today" line of each relay.
  const today = (new Date().getDay() + 6) % 7

  // What still has to be filled in before paying — shown under the button.
  const missing: string[] = []
  if (mode === 'colis' && parcelBlocked) missing.push(parcelBattery ? 'un autre mode de réception (batterie)' : 'un autre mode de réception (colis trop lourd)')
  if (mode === 'coursier' && courierBlocked) missing.push('un autre mode de réception (pièce trop lourde pour un coursier)')
  if (needsQuote && address.street.trim().length <= 3) missing.push('votre adresse')
  if (needsQuote && !quote?.available) missing.push('le calcul de la livraison')
  if (relayRequired && !chosenRelay) missing.push('le choix du point relais')
  if (contact.name.trim().length <= 1) missing.push('votre nom')
  if (contact.phone.replace(/\D/g, '').length < 9) missing.push('votre numéro de mobile')
  const canCheckout = cart.length > 0 && missing.length === 0

  // Online payment. The server re-prices the cart at the suppliers and creates
  // the Stripe payment page; the browser only goes there. The cart is emptied
  // on the confirmation page, once Stripe says the order is paid.
  const payOnline = async () => {
    if (paying) return
    setPaying(true)
    setPayError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // The slug carries the article's opaque token: the server reads the reference from it.
          items: cart.map((l) => ({ slug: l.slug, qty: l.qty, name: l.name, brand: l.brand, image: l.image, href: l.href, priceTTC: l.priceTTC })),
          mode,
          pickup,
          parcelOption,
          relayCode: wantsRelay ? relayCode : '',
          address,
          contact: { name: contact.name, phone: phoneE164 ?? contact.phone },
          whatsappOptIn: optIn,
          vehicle: vehicle ? `${vehicle.make} ${vehicle.model} ${vehicle.version}${vehicle.plate ? ` (${vehicle.plate})` : ''}` : '',
          totalTTC,
        }),
      })
      const json = (await res.json().catch(() => ({}))) as {
        url?: string
        error?: string
        message?: string
        lines?: CartLine[]
        removed?: { slug: string; reference: string }[]
        quote?: Quote
      }
      if (res.ok && json.url) {
        window.location.assign(json.url) // the Stripe payment page
        return // keep the button busy while the browser leaves
      }
      if (res.status === 409) {
        // Prices, stock or delivery moved: show the cart as it is now, the customer pays the total they see.
        for (const r of json.removed ?? []) removeLine(r.slug, r.reference)
        if (json.lines?.length) restoreCart(json.lines)
        if (json.quote) setQuote(json.quote)
        setPayError(json.message ?? 'Votre panier a été mis à jour. Vérifiez le total avant de payer.')
      } else {
        setPayError(json.error ?? 'Le paiement est momentanément indisponible. Réessayez dans quelques minutes.')
      }
    } catch {
      setPayError('Connexion impossible. Vérifiez votre réseau et réessayez.')
    }
    setPaying(false)
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8" aria-busy="true" />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <nav aria-label="Fil d’Ariane" className="text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-900">Accueil</Link>
          <span className="mx-1.5">/</span>
          <Link href="/boutique" className="hover:text-gray-900">Boutique</Link>
          <span className="mx-1.5">/</span>
          <span className="text-gray-900">Panier</span>
        </nav>
        <h1 className="mt-2 font-display text-3xl font-bold text-gray-900 lg:text-4xl">Mon panier</h1>

        {notice && (
          <p role="status" className="mt-4 flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-800 ring-1 ring-gray-200">
            <Icon name={notice.ok ? 'check-circle' : 'info'} weight="fill" className={`h-5 w-5 shrink-0 ${notice.ok ? 'text-emerald-600' : 'text-gray-500'}`} />
            {notice.text}
          </p>
        )}

        {cart.length === 0 ? (
          <div className="mt-6 rounded-xl bg-white px-6 py-14 text-center ring-1 ring-gray-200">
            <Icon name="cart" className="mx-auto h-14 w-14 text-gray-300" />
            <p className="mt-4 font-display text-2xl font-bold text-gray-900">Votre panier est vide</p>
            <p className="mx-auto mt-1 max-w-md text-gray-600">
              Trouvez votre pièce avec votre plaque, ou écrivez-nous : on vous répond sur WhatsApp.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/boutique" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-secondary-600 px-6 font-display font-bold text-white hover:bg-secondary-700">
                Aller à la boutique <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2.4} />
              </Link>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 font-display font-bold text-gray-900 ring-1 ring-gray-300 hover:ring-gray-900"
              >
                <WhatsAppIcon className="h-5 w-5 text-green-600" /> Demander une pièce
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <div className="space-y-6">
              {/* 1 — Lines */}
              <section className="rounded-xl bg-white ring-1 ring-gray-200" aria-labelledby="cart-lines">
                <div className="border-b border-gray-200 p-4 sm:p-6" id="cart-lines">
                  <StepTitle n={1} aside={`${count} article${count > 1 ? 's' : ''}`}>
                    Votre panier
                  </StepTitle>
                </div>
                <ul className="divide-y divide-gray-200">
                  {cart.map((l) => (
                    <li key={l.slug + l.reference} className="flex gap-4 p-4 sm:gap-5 sm:p-6">
                      <Link href={l.href ?? `/boutique/${l.slug}`} className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white text-gray-300 ring-1 ring-gray-200 sm:h-24 sm:w-24">
                        {l.image ? (
                          // Catalogue pictures come from the supplier's CDN at a fixed size: served as they are.
                          <Image src={l.image} alt="" fill sizes="96px" unoptimized={l.image.endsWith('.svg') || l.image.startsWith('http')} className="object-contain p-1.5" />
                        ) : (
                          <Icon name="box" className="h-10 w-10" />
                        )}
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link href={l.href ?? `/boutique/${l.slug}`} className="font-semibold leading-snug text-gray-900 hover:text-secondary-600">
                              {l.name}
                            </Link>
                            {/* No reference here, on purpose: see lib/shop/articleToken.server.ts */}
                            <p className="mt-0.5 text-xs font-display font-bold uppercase tracking-wide text-gray-700">{l.brand}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="font-display text-xl font-bold leading-none text-gray-900">{formatEUR(l.priceTTC * l.qty)}</p>
                            {l.qty > 1 && <p className="mt-1 text-xs text-gray-500">{formatEUR(l.priceTTC)} l’unité</p>}
                          </div>
                        </div>
                        {l.depositTTC ? (
                          <p className="mt-1.5 flex items-start gap-1.5 text-xs text-gray-600">
                            <Icon name="refresh" className="mt-px h-4 w-4 shrink-0 text-gray-500" />
                            <span>
                              + <span className="font-semibold text-gray-900">{formatEUR(l.depositTTC * l.qty)}</span> de consigne, remboursée au retour de l’ancienne pièce
                            </span>
                          </p>
                        ) : null}
                        <div className="mt-auto flex items-center gap-4 pt-3">
                          <div className="flex h-10 items-center rounded-lg ring-1 ring-gray-300">
                            <button type="button" aria-label={`Diminuer la quantité de ${l.name}`} onClick={() => setQty(l.slug, l.reference, l.qty - 1)} className="flex h-10 w-10 items-center justify-center text-gray-700 hover:text-gray-900">
                              <Icon name="minus" className="h-4 w-4" strokeWidth={2.4} />
                            </button>
                            <span className="w-8 text-center font-display text-base font-bold" aria-live="polite">{l.qty}</span>
                            <button type="button" aria-label={`Augmenter la quantité de ${l.name}`} onClick={() => setQty(l.slug, l.reference, l.qty + 1)} className="flex h-10 w-10 items-center justify-center text-gray-700 hover:text-gray-900">
                              <Icon name="plus" className="h-4 w-4" strokeWidth={2.4} />
                            </button>
                          </div>
                          <button type="button" onClick={() => removeLine(l.slug, l.reference)} className="inline-flex items-center gap-1.5 text-sm text-gray-500 underline-offset-4 hover:text-secondary-600 hover:underline">
                            <Icon name="trash" className="h-4 w-4" /> Retirer
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 2 — Fulfilment */}
              <section className="rounded-xl bg-white p-4 ring-1 ring-gray-200 sm:p-6">
                <StepTitle n={2}>Réception</StepTitle>
                <fieldset className="mt-5">
                  <legend className="sr-only">Mode de réception</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {FULFILMENT_MODES.map((m) => {
                      const soon = m.id === 'montage' && !FULFILMENT.partnerGaragesAvailable
                      const disabled = (m.id === 'colis' && parcelBlocked) || (m.id === 'coursier' && courierBlocked) || soon
                      const selected = mode === m.id
                      return (
                        <label key={m.id} className={radioCard(selected, disabled)}>
                          <input type="radio" name="mode" disabled={disabled} checked={selected} onChange={() => changeMode(m.id)} className="sr-only" />
                          <Icon name={MODE_ICONS[m.id]} className="h-8 w-8 shrink-0 text-secondary-600" />
                          <span className="min-w-0 flex-1 pr-6">
                            <span className="block font-display text-lg font-bold leading-tight text-gray-900">{m.name}</span>
                            <span className="mt-0.5 block text-sm text-gray-500">{soon ? 'Bientôt disponible' : m.delay}</span>
                            <span className="mt-1.5 block text-sm font-semibold text-gray-900">{m.priceLabel}</span>
                          </span>
                          {selected && <Icon name="check-circle" weight="fill" className="absolute right-3 top-3 h-6 w-6 text-gray-900" />}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
                {parcelBattery && (
                  <p className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                    <Icon name="info" weight="fill" className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                    Votre panier contient une batterie : elle ne peut pas voyager en colis (matière dangereuse). Retrait, coursier ou montage uniquement.
                  </p>
                )}
                {!parcelBattery && parcelTooHeavy && (
                  <p className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                    <Icon name="info" weight="fill" className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                    Votre commande pèse environ {formatKg(weightKg)} : au-delà de {FULFILMENT.parcel.maxKg} kg, elle ne peut pas partir en un seul colis. Retrait ou coursier, ou écrivez-nous pour un envoi en plusieurs colis.
                  </p>
                )}
                {courierBlocked && (
                  <p className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                    <Icon name="info" weight="fill" className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                    Une pièce de votre panier dépasse {FULFILMENT.courier.maxItemKg} kg : trop lourde pour un coursier.
                  </p>
                )}

                {/* Details for the chosen mode */}
                <div className="mt-5 rounded-lg bg-gray-50 p-4 sm:p-5">
                  {mode === 'retrait' && (
                    <fieldset>
                      <legend className={fieldLabel}>Où retirer votre commande ?</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className={radioCard(pickup === 'comptoir')}>
                          <input type="radio" name="pickup" checked={pickup === 'comptoir'} onChange={() => setPickup('comptoir')} className="mt-1 h-4 w-4 accent-gray-900" />
                          <span>
                            <span className="block font-semibold text-gray-900">Au comptoir</span>
                            <span className="block text-sm text-gray-500">{SITE.street}, Nanterre · aux heures d’ouverture</span>
                          </span>
                        </label>
                        <label className={radioCard(pickup === 'casier', !FULFILMENT.lockersAvailable)}>
                          <input type="radio" name="pickup" disabled={!FULFILMENT.lockersAvailable} checked={pickup === 'casier'} onChange={() => setPickup('casier')} className="mt-1 h-4 w-4 accent-gray-900" />
                          <span>
                            <span className="block font-semibold text-gray-900">
                              Casier 24 h/24{!FULFILMENT.lockersAvailable && <span className="font-normal text-gray-500"> — bientôt disponible</span>}
                            </span>
                            <span className="block text-sm text-gray-500">Code d’ouverture envoyé sur WhatsApp</span>
                          </span>
                        </label>
                      </div>
                    </fieldset>
                  )}

                  {needsQuote && (
                    <div>
                      {mode === 'colis' && (
                        <div className="mb-4 inline-flex rounded-lg bg-white p-1 ring-1 ring-gray-300" role="group" aria-label="Type de livraison">
                          {(['relais', 'domicile'] as const).map((o) => (
                            <button
                              key={o}
                              type="button"
                              aria-pressed={parcelOption === o}
                              onClick={() => {
                                setParcelOption(o)
                                setQuote(null)
                                resetRelay()
                              }}
                              className={`h-9 rounded-md px-4 text-sm font-semibold transition-colors ${parcelOption === o ? 'bg-gray-900 text-white' : 'text-gray-700 hover:text-gray-900'}`}
                            >
                              {o === 'relais' ? 'Point relais' : 'À domicile'}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_130px_minmax(0,1fr)]">
                        <div>
                          <label htmlFor="cart-street" className={fieldLabel}>N° et rue</label>
                          <input id="cart-street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} autoComplete="address-line1" className={field} />
                        </div>
                        <div>
                          <label htmlFor="cart-cp" className={fieldLabel}>Code postal</label>
                          <input
                            id="cart-cp"
                            value={address.postalCode}
                            onChange={(e) => {
                              setAddress({ ...address, postalCode: e.target.value.replace(/\D/g, '').slice(0, 5) })
                              setQuote(null)
                              resetRelay()
                            }}
                            inputMode="numeric"
                            autoComplete="postal-code"
                            className={field}
                          />
                        </div>
                        <div>
                          <label htmlFor="cart-city" className={fieldLabel}>Ville</label>
                          <input id="cart-city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} autoComplete="address-level2" className={field} />
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <button type="button" onClick={fetchQuote} disabled={quoting} className="inline-flex h-11 items-center gap-2 rounded-lg bg-gray-900 px-4 font-display text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-60">
                          <Icon name="refresh" className={`h-4 w-4 ${quoting ? 'animate-spin' : ''}`} />
                          {quoting ? 'Calcul…' : 'Calculer la livraison'}
                        </button>
                        {quote && quote.available && (
                          <p className="text-sm text-gray-700">
                            <span className="font-display text-xl font-bold text-gray-900">{quote.feeTTC === 0 ? 'Offerte' : formatEUR(quote.feeTTC)}</span> · {quote.etaLabel}
                            {mode === 'colis' && <> · colis de {formatKg(weightKg)}</>}
                            {quote.source === 'estimate' && <span className="text-gray-500"> (estimation)</span>}
                          </p>
                        )}
                        {quote && !quote.available && <p role="alert" className="text-sm font-medium text-secondary-700">{quote.reason}</p>}
                        {quoteError && <p role="alert" className="text-sm font-medium text-secondary-700">{quoteError}</p>}
                      </div>

                      {/* Relay delivery: which relay? Listed once the address is known. */}
                      {wantsRelay && relayStatus !== 'idle' && relayStatus !== 'off' && (
                        <div className="mt-5 border-t border-gray-200 pt-4">
                          <p id="relay-title" className={fieldLabel}>
                            Choisissez votre point relais
                          </p>
                          {relayStatus === 'loading' && (
                            <p className="flex items-center gap-2 text-sm text-gray-600" aria-busy="true">
                              <Icon name="refresh" className="h-4 w-4 animate-spin" /> Recherche des points relais près de chez vous…
                            </p>
                          )}
                          {relayStatus === 'error' && (
                            <p role="alert" className="flex items-start gap-1.5 text-sm font-medium text-secondary-700">
                              <Icon name="warning" weight="fill" className="mt-0.5 h-4 w-4 shrink-0" />
                              {relayError}
                            </p>
                          )}
                          {relayStatus === 'ready' && relays.length === 0 && (
                            <p className="text-sm text-gray-700">Aucun point relais trouvé près de cette adresse. Vérifiez le code postal, ou choisissez « À domicile ».</p>
                          )}
                          {relayStatus === 'ready' && relays.length > 0 && (
                            <div role="radiogroup" aria-labelledby="relay-title" className="grid gap-2 sm:grid-cols-2">
                              {relays.map((p) => {
                                const open = p.hours[today]?.periods ?? []
                                return (
                                  <label key={p.code} className={radioCard(relayCode === p.code)}>
                                    <input type="radio" name="relay" checked={relayCode === p.code} onChange={() => setRelayCode(p.code)} className="mt-1 h-4 w-4 shrink-0 accent-gray-900" />
                                    <span className="min-w-0 flex-1">
                                      <span className="flex items-baseline justify-between gap-2">
                                        <span className="font-semibold leading-snug text-gray-900">{p.name}</span>
                                        {p.distanceM !== undefined && <span className="shrink-0 text-sm text-gray-500">{formatDistance(p.distanceM)}</span>}
                                      </span>
                                      <span className="block text-sm text-gray-600">
                                        {p.street}, {p.postalCode} {p.city}
                                      </span>
                                      <span className="mt-1 block text-[13px] text-gray-500">{open.length ? `Aujourd’hui : ${open.join(', ')}` : 'Fermé aujourd’hui'}</span>
                                      {relayCode === p.code && (
                                        <span className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 border-t border-gray-200 pt-2 text-[13px] text-gray-600">
                                          {p.hours.map((h) => (
                                            <span key={h.day} className="contents">
                                              <span className="font-medium text-gray-800">{h.day}</span>
                                              <span>{h.periods.length ? h.periods.join(', ') : 'Fermé'}</span>
                                            </span>
                                          ))}
                                        </span>
                                      )}
                                    </span>
                                  </label>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}
                      <p className="mt-3 text-xs text-gray-500">
                        {mode === 'coursier'
                          ? 'Prix calculé selon la distance entre le magasin et votre adresse.'
                          : `Le transporteur le plus adapté est choisi pour vous. Livraison offerte dès ${formatEUR(FULFILMENT.parcel.freeAboveTTC)} d’achat.`}
                      </p>
                    </div>
                  )}

                  {mode === 'montage' && (
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                      <fieldset>
                        <legend className={fieldLabel}>Choisissez votre garage</legend>
                        <div className="grid gap-2">
                          {DEMO_GARAGES.map((g) => (
                            <label key={g.id} className={radioCard(garageId === g.id)}>
                              <input type="radio" name="garage" checked={garageId === g.id} onChange={() => setGarageId(g.id)} className="mt-1 h-4 w-4 accent-gray-900" />
                              <span className="min-w-0 flex-1">
                                <span className="block font-semibold text-gray-900">{g.name}</span>
                                <span className="flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
                                  <span className="inline-flex items-center gap-1 text-gray-800">
                                    <StarIcon className="h-3.5 w-3.5 text-signal-600" /> {g.rating.toLocaleString('fr-FR')}
                                  </span>
                                  <span>· {g.distanceKm.toLocaleString('fr-FR')} km · prochain créneau : {g.nextSlot}</span>
                                </span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <div className="self-start rounded-lg bg-white p-4 text-sm ring-1 ring-gray-200">
                        <p className="font-semibold text-gray-900">Main-d’œuvre à prix fixe</p>
                        {fittingLines.length === 0 ? (
                          <p className="mt-1 text-gray-600">Aucune pièce de votre panier n’a de forfait : le garage vous fera un devis.</p>
                        ) : (
                          <ul className="mt-2 divide-y divide-gray-100">
                            {fittingLines.map((l) => {
                              const j = getFittingJob(l.fittingJob)!
                              return (
                                <li key={l.slug + l.reference} className="flex justify-between gap-3 py-1.5 text-gray-600">
                                  <span>{j.label}</span>
                                  <span className="font-semibold text-gray-900">{j.priceTTC !== null ? formatEUR(j.priceTTC) : 'sur devis'}</span>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                        <p className="mt-2 text-xs text-gray-500">Réglée directement au garage après l’intervention.</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* 3 — Contact */}
              <section className="rounded-xl bg-white p-4 ring-1 ring-gray-200 sm:p-6">
                <StepTitle n={3}>Vos coordonnées</StepTitle>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cart-name" className={fieldLabel}>Prénom et nom</label>
                    <input id="cart-name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} autoComplete="name" className={field} />
                  </div>
                  <div>
                    <label htmlFor="cart-phone" className={fieldLabel}>
                      Téléphone mobile <span className="font-normal text-gray-500">(pour le suivi)</span>
                    </label>
                    <input id="cart-phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78" className={field} />
                  </div>
                </div>
                <div className="mt-5 space-y-3 border-t border-gray-200 pt-5">
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
                    <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-gray-900" />
                    <span>
                      Je préfère être contacté(e) sur WhatsApp au sujet de ma commande.
                      <span className="block text-xs text-gray-500">Sinon, nous vous appelons au numéro indiqué.</span>
                    </span>
                  </label>
                </div>
              </section>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-36">
              <div className="overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
                <div className="p-5 sm:p-6">
                  <h2 className="font-display text-2xl font-bold text-gray-900">Récapitulatif</h2>
                  <dl className="mt-4 space-y-2.5 text-[15px]">
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-600">Sous-total ({count} article{count > 1 ? 's' : ''})</dt>
                      <dd className="font-semibold text-gray-900">{formatEUR(subtotalTTC)}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-600">{mode === 'retrait' ? 'Retrait au magasin' : mode === 'montage' ? 'Livraison au garage' : 'Livraison'}</dt>
                      <dd className={deliveryFee === null ? 'text-gray-500' : 'font-semibold text-gray-900'}>
                        {deliveryFee === null ? 'à calculer' : deliveryFee === 0 ? 'Gratuit' : formatEUR(deliveryFee)}
                      </dd>
                    </div>
                    {depositsTTC > 0 && (
                      <div className="flex justify-between gap-3">
                        <dt className="text-gray-600">Consigne (remboursable)</dt>
                        <dd className="font-semibold text-gray-900">{formatEUR(depositsTTC)}</dd>
                      </div>
                    )}
                    {mode === 'montage' && fittingLines.length > 0 && (
                      <div className="flex justify-between gap-3 text-gray-500">
                        <dt>Montage (réglé au garage)</dt>
                        <dd>
                          {formatEUR(fittingTotal)}
                          {fittingHasQuote ? ' + devis' : ''}
                        </dd>
                      </div>
                    )}
                  </dl>
                  <div className="mt-4 flex items-end justify-between gap-3 border-t-2 border-gray-900 pt-4">
                    <span className="font-display text-lg font-bold text-gray-900">
                      Total <span className="text-sm font-medium text-gray-500">TTC</span>
                    </span>
                    <span className="font-display text-4xl font-bold leading-none text-gray-900">{formatEUR(totalTTC)}</span>
                  </div>

                  {depositsTTC > 0 && (
                    <p className="mt-4 text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">Consigne :</span> {DEPOSIT_RETURN[mode]}{' '}
                      <Link href="/livraison-retrait#consigne" className="font-semibold text-gray-900 underline underline-offset-4">Conditions</Link>
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={payOnline}
                    disabled={!canCheckout || paying}
                    aria-busy={paying}
                    className="mt-5 flex h-14 w-full items-center justify-center gap-2.5 rounded-lg bg-secondary-600 font-display text-lg font-bold text-white hover:bg-secondary-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
                  >
                    <Icon name="lock" weight="fill" className="h-5 w-5" />
                    {paying ? 'Redirection…' : 'Payer en ligne'}
                  </button>
                  {payError && (
                    <p className="mt-2.5 flex items-start gap-2 text-sm font-medium text-secondary-700" role="alert">
                      <Icon name="warning" weight="fill" className="mt-0.5 h-4 w-4 shrink-0" />
                      {payError}
                    </p>
                  )}
                  {!canCheckout && (
                    <p className="mt-2.5 text-sm text-gray-600" role="status">
                      Pour payer, il manque : <span className="font-semibold text-gray-900">{missing.join(', ')}</span>.
                    </p>
                  )}

                  <p className="mt-2.5 text-xs text-gray-500">
                    Paiement par carte sur la page sécurisée de Stripe : aucune donnée bancaire ne passe par notre site. En payant, vous acceptez nos{' '}
                    <Link href="/cgv" className="font-semibold text-gray-700 underline underline-offset-2 hover:text-gray-900">conditions générales de vente</Link>.
                  </p>

                </div>

                <ul className="space-y-2.5 border-t border-gray-200 bg-gray-50 p-5 text-sm text-gray-700 sm:px-6">
                  <li className="flex items-center gap-2.5">
                    <Icon name="shield" className="h-5 w-5 shrink-0 text-gray-900" /> Garantie légale de conformité : 2 ans
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Icon name="refresh" className="h-5 w-5 shrink-0 text-gray-900" /> Rétractation sous 14 jours pour un achat en ligne
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Icon name="phone" className="h-5 w-5 shrink-0 text-gray-900" />
                    <span>
                      Une question ?{' '}
                      <a href={`tel:${SITE.phone}`} className="font-semibold text-gray-900 underline underline-offset-4">{SITE.phoneDisplay}</a>
                    </span>
                  </li>
                </ul>
              </div>
              <Link href="/boutique" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900">
                <Icon name="chevron-left" className="h-4 w-4" strokeWidth={2.4} /> Continuer mes achats
              </Link>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
