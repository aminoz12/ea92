'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/shop/ProductCard'
import { StockBadge } from '@/components/shop/StockBadge'
import { CompatBadge } from '@/components/shop/CompatBadge'
import { VehiclePicker } from '@/components/shop/VehiclePicker'
import { Icon, WhatsAppIcon, type IconName } from '@/components/ui/Icon'
import { useShop } from '@/providers/ShopProvider'
import { DEPOSIT, FULFILMENT, getFittingJob } from '@/lib/shop/config'
import { formatEUR } from '@/lib/shop/format'
import { WEAR_INTERVALS } from '@/lib/loyalty/serviceLog'
import { SITE } from '@/lib/site'
import type { PublicProduct } from '@/lib/shop/types'

export function ProductView({ product, related }: { product: PublicProduct; related: PublicProduct[] }) {
  const { addToCart, vehicle, hydrated } = useShop()
  const [selected, setSelected] = useState(0)
  const [qty, setQty] = useState(1)
  const offer = product.offers[selected]

  // ?ref=<reference> preselects that brand (links from Google Shopping point
  // at one precise offer, whose price must be the one shown on landing).
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref')
    const i = ref ? product.offers.findIndex((o) => o.reference === ref) : -1
    if (i >= 0) setSelected(i)
  }, [product.offers])
  const fitting = getFittingJob(product.fittingJob)
  const wear = product.wearPart ? WEAR_INTERVALS[product.wearPart] : undefined

  const waText =
    `Bonjour, je souhaite commander : ${product.name} — ${offer.brand} ${offer.reference} (x${qty})` +
    (hydrated && vehicle ? ` pour ma ${vehicle.make} ${vehicle.model}${vehicle.plate ? ` (${vehicle.plate})` : ''}` : '') +
    '.'

  const pickupDelay =
    offer.availability === 'magasin'
      ? `Prête en ${FULFILMENT.pickupReadyMinutes} min`
      : offer.availability === 'fournisseur_4h'
        ? `Au magasin dans ~${FULFILMENT.supplierLeadHours} h`
        : 'Au magasin sous 24 h'

  const modes: { icon: IconName; title: string; detail: string; price: string; href: string }[] = [
    { icon: 'store', title: 'Retrait au magasin', detail: pickupDelay, price: 'Gratuit', href: '/livraison-retrait#retrait' },
    { icon: 'bolt', title: 'Coursier (Uber Direct)', detail: 'En ~1 h après préparation, Île-de-France', price: `dès ${formatEUR(FULFILMENT.courier.baseFeeTTC)}`, href: '/livraison-retrait#coursier' },
    { icon: 'box', title: 'Colis partout en France', detail: FULFILMENT.parcel.delay, price: `dès ${formatEUR(FULFILMENT.parcel.relayFromTTC)}`, href: '/livraison-retrait#colis' },
    {
      icon: 'wrench',
      title: 'Montage en garage partenaire',
      detail: fitting ? fitting.label : 'Sur demande',
      price: fitting ? (fitting.priceTTC !== null ? `${formatEUR(fitting.priceTTC)} main-d’œuvre` : 'Sur devis du garage') : 'Sur demande',
      href: '/montage-garage',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-16">
        <div className="max-w-7xl mx-auto px-4 pt-5 sm:px-6 lg:px-8">
          <nav aria-label="Fil d’Ariane" className="text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-900">Accueil</Link>
            <span className="mx-1.5">/</span>
            <Link href="/boutique" className="hover:text-gray-900">Boutique</Link>
            <span className="mx-1.5">/</span>
            <Link href={`/boutique?categorie=${product.category}`} className="hover:text-gray-900">{product.categoryName}</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="mt-5 grid gap-8 lg:grid-cols-2">
            {/* Visual */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 600px, 100vw"
                  unoptimized={product.image.endsWith('.svg')}
                  className="object-contain p-8"
                />
                {product.tags.includes('promo') && (
                  <span className="absolute left-4 top-4 rounded-lg bg-secondary-600 px-2.5 py-1 text-xs font-bold text-white">Promo</span>
                )}
              </div>
              <p className="mt-2 text-center text-xs text-gray-400">Visuel non contractuel — la référence fait foi.</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  { icon: 'shield' as const, t: 'Garantie 1 an min.' },
                  { icon: 'chat' as const, t: 'Conseil d’experts' },
                  { icon: 'store' as const, t: 'Magasin à Nanterre' },
                ].map((b) => (
                  <div key={b.t} className="flex flex-col items-center gap-1.5 rounded-xl bg-gray-50 px-2 py-3 font-semibold text-gray-700">
                    <Icon name={b.icon} className="w-5 h-5 text-secondary-600" />
                    {b.t}
                  </div>
                ))}
              </div>
            </div>

            {/* Buy box */}
            <div>
              <p className="text-sm font-semibold text-secondary-600">{product.categoryName}{product.position ? ` · ${product.position}` : ''}</p>
              <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-gray-900">{product.name}</h1>

              <div className="mt-3">
                {hydrated && vehicle ? (
                  <CompatBadge product={product} className="text-xs" />
                ) : (
                  <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200">
                    <p className="mb-2 text-sm font-semibold text-gray-900">Vérifiez la compatibilité avec votre plaque</p>
                    <VehiclePicker />
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-end gap-3">
                <span className="font-display text-4xl font-extrabold text-gray-900">{formatEUR(offer.priceTTC)}</span>
                {product.compareAtTTC && product.compareAtTTC > offer.priceTTC && (
                  <span className="pb-1 text-lg text-gray-400 line-through">{formatEUR(product.compareAtTTC)}</span>
                )}
                <span className="pb-1.5 text-sm text-gray-500">TTC</span>
              </div>
              <div className="mt-1">
                <StockBadge availability={offer.availability} long />
              </div>
              {product.depositTTC ? (
                <div className="mt-4 flex gap-3 rounded-2xl bg-gray-100 p-4 text-sm ring-1 ring-gray-200">
                  <Icon name="refresh" className="mt-0.5 h-5 w-5 shrink-0 text-gray-900" />
                  <p className="text-gray-800">
                    <span className="font-bold">Échange standard : + {formatEUR(product.depositTTC)} de consigne</span>, remboursée
                    quand vous nous rapportez l’ancienne pièce (sous {DEPOSIT.returnDays} jours).{' '}
                    <Link href="/livraison-retrait#consigne" className="font-semibold underline">Comment ça marche</Link>
                  </p>
                </div>
              ) : null}

              {/* Brand offers */}
              <fieldset className="mt-6">
                <legend className="mb-2 text-sm font-bold text-gray-900">
                  Choisissez votre marque <span className="font-normal text-gray-500">({product.offers.length} disponibles)</span>
                </legend>
                <div className="space-y-2">
                  {product.offers.map((o, i) => (
                    <label
                      key={o.reference}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl p-3 ring-1 transition ${
                        i === selected ? 'bg-secondary-50/60 ring-2 ring-secondary-500' : 'ring-gray-200 hover:ring-gray-300'
                      }`}
                    >
                      <input type="radio" name="offer" checked={i === selected} onChange={() => setSelected(i)} className="h-4 w-4 accent-secondary-600" />
                      <span className="flex h-9 w-16 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-gray-100">
                        {o.brandLogo ? (
                          <img src={o.brandLogo} alt={o.brand} className="max-h-6 max-w-[56px] object-contain" />
                        ) : (
                          <span className="text-[11px] font-bold uppercase text-gray-700">{o.brand}</span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-900">
                          {o.brand}
                          {o.recommended && (
                            <span className="rounded-md bg-secondary-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                              Meilleur choix
                            </span>
                          )}
                        </span>
                        <span className="block truncate text-xs text-gray-500">Réf. {o.reference}</span>
                        <StockBadge availability={o.availability} />
                      </span>
                      <span className="font-display text-lg font-bold text-gray-900">{formatEUR(o.priceTTC)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Quantity + CTA */}
              <div className="mt-5 flex gap-3">
                <div className="flex h-12 shrink-0 items-center rounded-xl ring-1 ring-gray-300">
                  <button type="button" aria-label="Diminuer" onClick={() => setQty((n) => Math.max(1, n - 1))} className="flex h-12 w-11 items-center justify-center text-gray-700">
                    <Icon name="minus" className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
                  <button type="button" aria-label="Augmenter" onClick={() => setQty((n) => Math.min(20, n + 1))} className="flex h-12 w-11 items-center justify-center text-gray-700">
                    <Icon name="plus" className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addToCart(
                      {
                        slug: product.slug,
                        brand: offer.brand,
                        reference: offer.reference,
                        name: product.name,
                        image: product.image,
                        priceTTC: offer.priceTTC,
                        fittingJob: product.fittingJob,
                        wearPart: product.wearPart,
                        weightKg: product.weightKg,
                        parcelForbidden: product.parcelForbidden,
                        depositTTC: product.depositTTC,
                      },
                      qty,
                    )
                  }
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-secondary-600 font-display font-bold text-white hover:bg-secondary-700"
                >
                  <Icon name="cart" className="w-5 h-5" />
                  Ajouter au panier
                </button>
              </div>
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 font-display font-bold text-white hover:bg-green-700"
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0" />
                Commander sur WhatsApp
              </a>

              {/* Delivery options for this part */}
              <div className="mt-6 rounded-2xl ring-1 ring-gray-200">
                <p className="border-b border-gray-200 px-4 py-3 text-sm font-bold text-gray-900">Comment la recevoir ?</p>
                <ul className="divide-y divide-gray-100">
                  {modes.map((m) => (
                    <li key={m.title}>
                      <Link href={m.href} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                        <Icon name={m.icon} className="w-5 h-5 shrink-0 text-secondary-600" />
                        <span className="min-w-0 flex-1 leading-tight">
                          <span className="block text-sm font-semibold text-gray-900">{m.title}</span>
                          <span className="block text-xs text-gray-500">{m.detail}</span>
                        </span>
                        <span className="text-right text-xs font-bold text-gray-900">{m.price}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <section className="rounded-2xl bg-gray-50 p-6 lg:col-span-2">
              <h2 className="font-display text-xl font-bold text-gray-900">Description</h2>
              <p className="mt-2 leading-relaxed text-gray-700">{product.description}</p>
              <h3 className="mt-6 font-display text-base font-bold text-gray-900">Caractéristiques</h3>
              <dl className="mt-2 divide-y divide-gray-200 rounded-xl bg-white ring-1 ring-gray-200">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-2 gap-4 px-4 py-2.5 text-sm">
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="font-medium text-gray-900">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <aside className="space-y-4">
              <section className="rounded-2xl p-6 ring-1 ring-gray-200">
                <h2 className="font-display text-base font-bold text-gray-900">Références & équivalences</h2>
                <p className="mt-1 text-xs text-gray-500">Vous avez une référence d’origine ? Elle doit figurer ici.</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.oe.map((r) => (
                    <li key={r} className="rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-700">{r}</li>
                  ))}
                </ul>
              </section>
              {wear && (
                <section className="rounded-2xl bg-secondary-50 p-6 ring-1 ring-secondary-100">
                  <h2 className="flex items-center gap-2 font-display text-base font-bold text-gray-900">
                    <Icon name="bell" className="w-5 h-5 text-secondary-600" />
                    Pièce d’usure suivie
                  </h2>
                  <p className="mt-1.5 text-sm text-gray-700">
                    Ajoutée automatiquement à votre carnet d’entretien. Rappel WhatsApp avant l’échéance indicative
                    ({wear.months} mois{wear.km ? ` ou ${wear.km.toLocaleString('fr-FR')} km` : ''}).
                  </p>
                  <Link href="/carnet-entretien" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-secondary-700 hover:underline">
                    Voir le carnet d’entretien <Icon name="arrow-right" className="w-4 h-4" />
                  </Link>
                </section>
              )}
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 font-display text-2xl font-bold text-gray-900">Souvent achetés avec</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                {related.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
