'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Icon, WhatsAppIcon } from '@/components/ui/Icon'
import { SITE } from '@/lib/site'
import type { FulfilmentMode } from '@/lib/shop/types'

// Steps per fulfilment mode. In production each step is set by an event:
// supplier order (TecCom / AutoPrécision), goods received at the counter,
// Uber Direct / Boxtal webhooks, partner garage confirmation.
const STEPS: Record<FulfilmentMode, { title: string; detail: string }[]> = {
  coursier: [
    { title: 'Commande confirmée', detail: 'Confirmation envoyée sur WhatsApp' },
    { title: 'Préparation', detail: 'Pièces en stock prélevées, le reste commandé automatiquement chez le fournisseur' },
    { title: 'Arrivée au magasin', detail: 'Contrôle de la référence au comptoir' },
    { title: 'Remise au coursier', detail: 'Coursier Uber Direct en route vers le magasin' },
    { title: 'En livraison', detail: 'Suivi du coursier en temps réel' },
    { title: 'Livrée', detail: 'Bonne route !' },
  ],
  retrait: [
    { title: 'Commande confirmée', detail: 'Confirmation envoyée sur WhatsApp' },
    { title: 'Préparation', detail: 'Pièces en stock prélevées, le reste commandé automatiquement chez le fournisseur' },
    { title: 'Arrivée au magasin', detail: 'Contrôle de la référence au comptoir' },
    { title: 'Prête à retirer', detail: 'Présentez votre numéro de commande au comptoir' },
    { title: 'Retirée', detail: 'Merci de votre visite !' },
  ],
  colis: [
    { title: 'Commande confirmée', detail: 'Confirmation envoyée sur WhatsApp' },
    { title: 'Préparation', detail: 'Pièces en stock prélevées, le reste commandé automatiquement chez le fournisseur' },
    { title: 'Arrivée au magasin', detail: 'Contrôle de la référence et emballage' },
    { title: 'Remise au transporteur', detail: 'Étiquette Boxtal éditée, numéro de suivi envoyé sur WhatsApp' },
    { title: 'En transit', detail: 'Livraison sous 24 à 72 h ouvrées' },
    { title: 'Livrée', detail: 'En point relais ou à domicile' },
  ],
  montage: [
    { title: 'Commande confirmée', detail: 'Confirmation envoyée sur WhatsApp' },
    { title: 'Préparation', detail: 'Pièces en stock prélevées, le reste commandé automatiquement chez le fournisseur' },
    { title: 'Livrée au garage', detail: 'Le garage partenaire a réceptionné vos pièces' },
    { title: 'Rendez-vous de montage', detail: 'Créneau confirmé par le garage' },
    { title: 'Montée', detail: 'Intervention terminée, ajoutée à votre carnet d’entretien' },
  ],
}

const MODE_LABEL: Record<FulfilmentMode, string> = {
  coursier: 'Livraison coursier',
  retrait: 'Retrait au magasin',
  colis: 'Expédition colis',
  montage: 'Montage en garage partenaire',
}

// Demo orders so the page can be shown without a back-office.
const DEMO_ORDERS: Record<string, { mode: FulfilmentMode; step: number; eta: string }> = {
  'EA92-10458': { mode: 'coursier', step: 4, eta: 'Arrivée estimée à 15 h 40' },
  'EA92-10459': { mode: 'retrait', step: 3, eta: 'Prête depuis 14 h 05' },
  'EA92-10460': { mode: 'colis', step: 4, eta: 'Livraison prévue demain' },
  'EA92-10461': { mode: 'montage', step: 3, eta: 'RDV vendredi 10 h' },
}

const isMode = (v: string): v is FulfilmentMode => v in STEPS

export function TrackingView({ orderId, modeParam }: { orderId: string; modeParam: string }) {
  const router = useRouter()
  const [input, setInput] = useState(orderId)

  const known = DEMO_ORDERS[orderId]
  // An order just placed from the cart arrives with its mode in the URL.
  const order = known ?? (orderId && isMode(modeParam) ? { mode: modeParam, step: 1, eta: 'On vous prévient dès que c’est prêt' } : null)
  const steps = order ? STEPS[order.mode] : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold text-gray-900">Suivi de commande</h1>
        <p className="mt-1 text-gray-500">Chaque étape vous est aussi envoyée sur WhatsApp.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            router.push(`/suivi-commande?commande=${encodeURIComponent(input.trim().toUpperCase())}`)
          }}
          className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-gray-200 sm:flex-row"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="N° de commande (ex. EA92-10458)"
            aria-label="Numéro de commande"
            className="h-12 flex-1 rounded-xl bg-gray-50 px-4 font-mono text-sm uppercase ring-1 ring-gray-200 outline-none focus:bg-white focus:ring-2 focus:ring-secondary-500"
          />
          <button type="submit" className="h-12 rounded-xl bg-secondary-600 px-6 font-display font-bold text-white hover:bg-secondary-700">
            Suivre
          </button>
        </form>

        {orderId && !order && (
          <div className="mt-6 rounded-2xl bg-white p-6 text-center ring-1 ring-gray-200">
            <p className="font-semibold text-gray-900">Commande {orderId} introuvable.</p>
            <p className="mt-1 text-sm text-gray-500">
              Démo : essayez EA92-10458 (coursier), EA92-10459 (retrait), EA92-10460 (colis) ou EA92-10461 (montage).
            </p>
          </div>
        )}

        {!orderId && (
          <p className="mt-4 text-sm text-gray-500">
            Démo : essayez{' '}
            {Object.keys(DEMO_ORDERS).map((id, i) => (
              <span key={id}>
                {i > 0 && ', '}
                <Link href={`/suivi-commande?commande=${id}`} className="font-mono font-semibold text-secondary-600 hover:underline">
                  {id}
                </Link>
              </span>
            ))}
            .
          </p>
        )}

        {order && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <section className="rounded-3xl bg-white p-6 ring-1 ring-gray-200">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm text-gray-500">{orderId}</p>
                  <p className="font-display text-xl font-bold text-gray-900">{MODE_LABEL[order.mode]}</p>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">{order.eta}</span>
              </div>

              <ol className="mt-6">
                {steps.map((s, i) => {
                  const done = i < order.step
                  const current = i === order.step
                  return (
                    <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
                      {i < steps.length - 1 && (
                        <span className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 ${done ? 'bg-green-500' : 'bg-gray-200'}`} aria-hidden="true" />
                      )}
                      <span
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          done ? 'bg-green-500 text-white' : current ? 'bg-secondary-600 text-white ring-4 ring-secondary-100' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {done ? <Icon name="check" className="w-4 h-4" strokeWidth={3} /> : <span className="text-xs font-bold">{i + 1}</span>}
                      </span>
                      <div className="pt-1">
                        <p className={`font-semibold ${current ? 'text-secondary-700' : done ? 'text-gray-900' : 'text-gray-400'}`}>
                          {s.title}
                          {current && <span className="ml-2 rounded bg-secondary-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-secondary-700">en cours</span>}
                        </p>
                        <p className={`text-sm ${done || current ? 'text-gray-600' : 'text-gray-400'}`}>{s.detail}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>

              {order.mode === 'coursier' && order.step >= 4 && (
                <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-gray-200">
                  <svg viewBox="0 0 600 220" className="block h-48 w-full bg-[#eef2f6]" role="img" aria-label="Position du coursier (illustration)">
                    <g stroke="#ffffff" strokeWidth="14">
                      <path d="M0 60 H600 M0 150 H600 M120 0 V220 M300 0 V220 M470 0 V220" />
                    </g>
                    <path d="M120 150 H300 V60 H470" fill="none" stroke="#dc2626" strokeWidth="5" strokeDasharray="10 8" strokeLinecap="round" />
                    <circle cx="120" cy="150" r="11" fill="#111827" />
                    <circle cx="470" cy="60" r="11" fill="#16a34a" />
                    <circle cx="300" cy="96" r="16" fill="#dc2626" opacity="0.25">
                      <animate attributeName="r" values="12;22;12" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="300" cy="96" r="9" fill="#dc2626" stroke="#fff" strokeWidth="3" />
                    <text x="120" y="185" textAnchor="middle" fontSize="13" fontFamily="Inter, Arial" fill="#111827">Magasin</text>
                    <text x="470" y="40" textAnchor="middle" fontSize="13" fontFamily="Inter, Arial" fill="#166534">Chez vous</text>
                  </svg>
                  <div className="flex flex-col gap-2 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-600">Le lien de suivi Uber en direct vous est envoyé sur WhatsApp.</p>
                    <span className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white opacity-60" title="Disponible une fois Uber Direct connecté">
                      Suivre le coursier (démo)
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* WhatsApp preview */}
            <aside className="space-y-4">
              <div className="rounded-3xl bg-[#e7ddd3] p-4">
                <p className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <WhatsAppIcon className="w-5 h-5 text-green-600" /> Espace Auto 92
                </p>
                <div className="space-y-2">
                  <p className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-gray-800 shadow-sm">
                    Merci pour votre commande {orderId} ! On vous prévient à chaque étape.
                  </p>
                  {order.step >= 2 && (
                    <p className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-gray-800 shadow-sm">
                      Vos pièces sont arrivées au magasin ✅
                    </p>
                  )}
                  {order.step >= 4 && order.mode !== 'retrait' && (
                    <p className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-gray-800 shadow-sm">
                      {order.mode === 'montage' ? 'Rendez-vous de montage confirmé.' : 'Votre commande est en route 🚚 — suivez-la en temps réel.'}
                    </p>
                  )}
                </div>
              </div>
              <div className="rounded-3xl bg-white p-5 ring-1 ring-gray-200">
                <p className="font-semibold text-gray-900">Une question sur votre commande ?</p>
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Bonjour, question sur ma commande ${orderId}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-bold text-white hover:bg-green-700"
                >
                  <WhatsAppIcon className="w-4 h-4" /> Écrire sur WhatsApp
                </a>
                <a href={`tel:${SITE.phone}`} className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50">
                  <Icon name="phone" className="w-4 h-4" /> {SITE.phoneDisplay}
                </a>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
