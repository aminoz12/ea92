'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Icon, WhatsAppIcon } from '@/components/ui/Icon'
import { SITE } from '@/lib/site'
import { formatEUR } from '@/lib/shop/format'
import { useShop } from '@/providers/ShopProvider'
import type { OrderConfirmation } from '@/lib/shop/checkout.server'
import type { FulfilmentMode } from '@/lib/shop/types'

// /suivi-commande has two uses:
//  - right after a payment (?session_id=…): what Stripe says about the order;
//  - opened by hand: how to ask about an order.
//
// There is no step-by-step tracking: nothing records the steps of an order
// yet (supplier order, arrival at the counter, courier, parcel). The timeline
// with sample orders that used to be here was a mock-up and is in the git
// history; bring it back when real events can feed it.

// What happens after a payment, said without promising a step nothing tracks.
const NEXT_STEP: Record<FulfilmentMode, string> = {
  retrait: `Nous préparons votre commande. Nous vous appelons dès qu’elle est prête à retirer au comptoir, ${SITE.street}, ${SITE.city}.`,
  coursier: 'Nous préparons votre commande, puis nous vous appelons pour convenir du créneau de livraison par coursier.',
  colis: 'Nous préparons votre colis. Le numéro de suivi vous est communiqué dès l’expédition.',
  montage: 'Nous préparons votre commande et vous appelons pour organiser le montage.',
}

const PAID_ORDERS_KEY = 'ea92-paid-orders'

/** Empties the cart once per paid order: opening this page again later must not wipe a new cart. */
function useClearCartOnce(orderRef: string | null) {
  const { clearCart, hydrated } = useShop()
  useEffect(() => {
    if (!hydrated || !orderRef) return
    let done: string[] = []
    try {
      done = JSON.parse(window.localStorage.getItem(PAID_ORDERS_KEY) ?? '[]') as string[]
    } catch {
      /* storage unavailable: clear anyway, the order is paid */
    }
    if (done.includes(orderRef)) return
    clearCart()
    try {
      window.localStorage.setItem(PAID_ORDERS_KEY, JSON.stringify([...done, orderRef].slice(-20)))
    } catch {
      /* nothing to remember it with */
    }
  }, [hydrated, orderRef, clearCart])
}

function ContactCard({ question }: { question: string }) {
  return (
    <div className="mt-8 rounded-xl bg-white p-5 ring-1 ring-gray-200 sm:p-6">
      <p className="font-semibold text-gray-900">Une question sur votre commande ?</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a
          href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(question)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 font-display text-sm font-bold text-white hover:bg-gray-800"
        >
          <WhatsAppIcon className="h-4 w-4 text-green-400" /> Écrire sur WhatsApp
        </a>
        <a href={`tel:${SITE.phone}`} className="flex h-11 items-center justify-center gap-2 rounded-lg px-5 font-display text-sm font-bold text-gray-900 ring-1 ring-gray-300 hover:ring-gray-900">
          <Icon name="phone" className="h-4 w-4" /> {SITE.phoneDisplay}
        </a>
      </div>
    </div>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 pb-16 pt-8 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  )
}

// Where the customer lands after the Stripe payment page.
function PaymentResult({ confirmation }: { confirmation: OrderConfirmation | 'unknown' }) {
  const order = confirmation === 'unknown' ? null : confirmation
  const paid = order?.paid ? order : null
  useClearCartOnce(paid?.orderRef ?? null)

  return (
    <Shell>
      {paid ? (
        <>
          <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 lg:text-4xl">
            <Icon name="check-circle" weight="fill" className="h-9 w-9 shrink-0 text-emerald-600" />
            Merci, votre commande est payée
          </h1>
          <p className="mt-2 text-gray-600">{NEXT_STEP[paid.mode]}</p>
          {paid.test && (
            <p className="mt-3 flex items-start gap-2 text-sm font-medium text-gray-700">
              <Icon name="info" weight="fill" className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              Paiement de test : aucun montant n’a été débité.
            </p>
          )}

          <section className="mt-6 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200" aria-label="Votre commande">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-gray-200 p-5 sm:p-6">
              <div>
                <p className="text-sm text-gray-500">Numéro de commande</p>
                <p className="font-display text-2xl font-bold tracking-wide text-gray-900">{paid.orderRef}</p>
              </div>
              <p className="text-sm font-medium text-gray-700">{paid.reception}</p>
            </div>
            <ul className="divide-y divide-gray-100 px-5 sm:px-6">
              {paid.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-4 py-3 text-[15px]">
                  <span className="min-w-0 text-gray-800">
                    {l.label}
                    {l.qty > 1 && <span className="text-gray-500"> × {l.qty}</span>}
                  </span>
                  <span className="shrink-0 font-semibold text-gray-900">{formatEUR(l.amountTTC)}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-end justify-between gap-3 border-t-2 border-gray-900 p-5 sm:p-6">
              <span className="font-display text-lg font-bold text-gray-900">
                Total payé <span className="text-sm font-medium text-gray-500">TTC</span>
              </span>
              <span className="font-display text-3xl font-bold leading-none text-gray-900">{formatEUR(paid.amountTTC)}</span>
            </div>
          </section>
          <p className="mt-4 text-sm text-gray-600">Conservez ce numéro de commande : il vous sera demandé à la remise des pièces.</p>
        </>
      ) : (
        <>
          <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-gray-900 lg:text-4xl">
            <Icon name="warning" weight="fill" className="h-9 w-9 shrink-0 text-secondary-600" />
            {order ? 'Le paiement n’est pas finalisé' : 'Paiement introuvable'}
          </h1>
          <p className="mt-2 text-gray-600">
            {order
              ? 'Aucun montant n’a été encaissé pour cette commande. Votre panier est conservé : vous pouvez reprendre le paiement.'
              : 'Nous ne retrouvons pas ce paiement. Si vous avez été débité, écrivez-nous : nous vérifions tout de suite.'}
          </p>
          <Link href="/panier" className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-secondary-600 px-6 font-display font-bold text-white hover:bg-secondary-700">
            Revenir au panier <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2.4} />
          </Link>
        </>
      )}
      <ContactCard question={paid ? `Bonjour, question sur ma commande ${paid.orderRef}.` : 'Bonjour, j’ai une question sur mon paiement.'} />
    </Shell>
  )
}

export function TrackingView({ orderId, confirmation }: { orderId: string; confirmation?: OrderConfirmation | 'unknown' }) {
  if (confirmation) return <PaymentResult confirmation={confirmation} />

  // Opened by hand, with or without an order number in the address.
  const ref = /^EA92-[A-Z0-9]{4,12}$/.test(orderId) ? orderId : ''
  return (
    <Shell>
      <h1 className="font-display text-3xl font-bold text-gray-900 lg:text-4xl">Suivi de commande</h1>
      <p className="mt-2 text-gray-600">
        Pour savoir où en est votre commande, contactez-nous avec votre numéro de commande (il commence par EA92- et figure sur la page affichée après le paiement). Nous vous répondons aux heures d’ouverture du magasin.
      </p>
      <ContactCard question={ref ? `Bonjour, où en est ma commande ${ref} ?` : 'Bonjour, où en est ma commande ? Mon numéro de commande : '} />
    </Shell>
  )
}
