'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StockBadge } from '@/components/shop/StockBadge'
import { Icon, WhatsAppIcon } from '@/components/ui/Icon'
import { evaluateCredit, nextDebitDate, type ProAccountSnapshot, type ProAccountStatus } from '@/lib/pro/credit'
import { PRO, VAT_RATE } from '@/lib/shop/config'
import { formatEUR } from '@/lib/shop/format'
import { round2 } from '@/lib/shop/ranking'
import { deburr } from '@/lib/shop/search'
import { SITE } from '@/lib/site'
import type { Availability } from '@/lib/shop/types'

// Same shape as ProCatalogLine (server) — redeclared to keep this client file
// free of any server import.
export interface ProLine {
  reference: string
  brand: string
  name: string
  oe: string[]
  availability: Availability
  priceHT: number
  publicPriceTTC: number
}

type Preset = 'actif' | 'alerte' | 'impaye'

const PRESETS: Record<Preset, ProAccountSnapshot> = {
  actif: { creditLimitTTC: PRO.creditLimitDefaultTTC, openInvoicesTTC: 312.4, uninvoicedOrdersTTC: 145.8, creditNotesTTC: 0, hasRejectedDebit: false, manualSuspension: false },
  alerte: { creditLimitTTC: PRO.creditLimitDefaultTTC, openInvoicesTTC: 812.4, uninvoicedOrdersTTC: 445.8, creditNotesTTC: 0, hasRejectedDebit: false, manualSuspension: false },
  impaye: { creditLimitTTC: PRO.creditLimitDefaultTTC, openInvoicesTTC: 798.6, uninvoicedOrdersTTC: 0, creditNotesTTC: 0, hasRejectedDebit: true, manualSuspension: false },
}

const STATUS_UI: Record<ProAccountStatus, { label: string; cls: string }> = {
  actif: { label: 'Compte actif', cls: 'bg-green-50 text-green-700 ring-green-200' },
  alerte: { label: 'Encours bientôt atteint', cls: 'bg-amber-50 text-amber-800 ring-amber-200' },
  bloque_plafond: { label: 'Plafond atteint', cls: 'bg-red-50 text-red-700 ring-red-200' },
  bloque_impaye: { label: 'Bloqué — impayé', cls: 'bg-red-50 text-red-700 ring-red-200' },
  suspendu: { label: 'Suspendu', cls: 'bg-gray-100 text-gray-700 ring-gray-300' },
}

const compact = (s: string) => deburr(s).replace(/[^a-z0-9]/g, '')

export function ProPortalView({ catalog, initialRef }: { catalog: ProLine[]; initialRef: string }) {
  const [ref, setRef] = useState(initialRef)
  const [preset, setPreset] = useState<Preset>('actif')
  const [account, setAccount] = useState<ProAccountSnapshot>(PRESETS.actif)
  const [cart, setCart] = useState<{ line: ProLine; qty: number }[]>([])
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)
  const [today, setToday] = useState<Date | null>(null)

  useEffect(() => setToday(new Date()), [])

  // Reference-only search: no browsing, no categories — like a counter.
  const matches = useMemo(() => {
    const q = compact(ref)
    if (q.length < 3) return []
    return catalog.filter((l) => [l.reference, ...l.oe].some((r) => compact(r).includes(q))).slice(0, 12)
  }, [ref, catalog])

  const totalHT = round2(cart.reduce((s, c) => s + c.line.priceHT * c.qty, 0))
  const totalTTC = round2(totalHT * (1 + VAT_RATE))
  const current = evaluateCredit(account)
  const preview = evaluateCredit(account, totalTTC)
  const shownStatus = cart.length ? preview.status : current.status
  const usedPct = Math.min(100, Math.round((current.outstandingTTC / account.creditLimitTTC) * 100))
  const afterPct = Math.min(100, Math.round(((current.outstandingTTC + totalTTC) / account.creditLimitTTC) * 100))

  const add = (line: ProLine) => {
    setResult(null)
    setCart((prev) => {
      const ex = prev.find((c) => c.line.reference === line.reference && c.line.brand === line.brand)
      return ex ? prev.map((c) => (c === ex ? { ...c, qty: c.qty + 1 } : c)) : [...prev, { line, qty: 1 }]
    })
  }

  const validate = () => {
    const decision = evaluateCredit(account, totalTTC)
    if (decision.canOrderOnCredit) {
      setAccount((a) => ({ ...a, uninvoicedOrdersTTC: round2(a.uninvoicedOrdersTTC + totalTTC) }))
      setCart([])
      setResult({ ok: true, message: `Commande validée sur votre encours (${formatEUR(totalTTC)} TTC). Préparation lancée, livraison atelier en ~1 h si en stock.` })
    } else {
      setResult({ ok: false, message: decision.message })
    }
  }

  const choosePreset = (p: Preset) => {
    setPreset(p)
    setAccount(PRESETS[p])
    setResult(null)
  }

  const debitDate = today ? nextDebitDate(today) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {/* Account bar */}
        <div className="flex flex-col gap-4 rounded-3xl bg-gray-900 p-5 text-white sm:flex-row sm:items-center sm:p-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-600">
            <Icon name="building" className="w-6 h-6" />
          </span>
          <div className="flex-1">
            <p className="flex flex-wrap items-center gap-2 font-display text-xl font-bold">
              Espace Pro — Garage Démo
              <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold uppercase text-gray-900">démo</span>
            </p>
            <p className="text-sm text-white/70">Prix nets HT · paiement par prélèvement hebdomadaire</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">Simuler un état de compte</span>
            <div className="inline-flex rounded-xl bg-white/10 p-1 text-xs font-bold">
              {(['actif', 'alerte', 'impaye'] as const).map((p) => (
                <button key={p} type="button" onClick={() => choosePreset(p)} className={`rounded-lg px-3 py-1.5 ${preset === p ? 'bg-white text-gray-900' : 'text-white/80 hover:text-white'}`}>
                  {p === 'actif' ? 'Actif' : p === 'alerte' ? 'Alerte 80 %' : 'Impayé'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Reference search */}
            <section className="rounded-3xl bg-white p-5 ring-1 ring-gray-200 sm:p-6">
              <h1 className="font-display text-2xl font-extrabold text-gray-900">Recherche par référence</h1>
              <p className="text-sm text-gray-500">Référence fabricant ou d’origine (OE). Essayez : GDB1550, OX 171/2D, E46, KP15580XS.</p>
              <div className="relative mt-4">
                <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="Référence…"
                  aria-label="Référence pièce"
                  autoFocus
                  className="h-14 w-full rounded-2xl bg-gray-50 pl-12 pr-4 font-mono text-lg uppercase ring-1 ring-gray-200 outline-none focus:bg-white focus:ring-2 focus:ring-secondary-500"
                />
              </div>

              {compact(ref).length >= 3 && (
                <div className="mt-4 overflow-x-auto">
                  {matches.length === 0 ? (
                    <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                      Pas de résultat en ligne pour « {ref} ».{' '}
                      <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Bonjour, compte pro : je cherche la référence ${ref}.`)}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-green-700 hover:underline">
                        Demandez au comptoir sur WhatsApp
                      </a>
                    </p>
                  ) : (
                    <table className="w-full min-w-[640px] text-sm">
                      <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
                        <tr className="border-b border-gray-200">
                          <th className="py-2 pr-3 font-semibold">Référence</th>
                          <th className="py-2 pr-3 font-semibold">Désignation</th>
                          <th className="py-2 pr-3 font-semibold">Dispo</th>
                          <th className="py-2 pr-3 text-right font-semibold">Net HT</th>
                          <th className="py-2" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {matches.map((l) => (
                          <tr key={l.brand + l.reference}>
                            <td className="py-3 pr-3">
                              <span className="font-mono font-semibold text-gray-900">{l.reference}</span>
                              <span className="block text-xs text-gray-500">{l.brand}</span>
                            </td>
                            <td className="py-3 pr-3 text-gray-700">{l.name}</td>
                            <td className="py-3 pr-3"><StockBadge availability={l.availability} /></td>
                            <td className="py-3 pr-3 text-right font-display font-bold text-gray-900">{formatEUR(l.priceHT)}</td>
                            <td className="py-3 text-right">
                              <button type="button" onClick={() => add(l)} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gray-900 px-3 text-xs font-bold text-white hover:bg-gray-800">
                                <Icon name="plus" className="w-3.5 h-3.5" /> Ajouter
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </section>

            {/* Pro cart */}
            <section id="panier" className="rounded-3xl bg-white p-5 ring-1 ring-gray-200 sm:p-6">
              <h2 className="font-display text-xl font-bold text-gray-900">Commande en cours</h2>
              {cart.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">Ajoutez des références depuis la recherche.</p>
              ) : (
                <>
                  <ul className="mt-3 divide-y divide-gray-100">
                    {cart.map((c) => (
                      <li key={c.line.brand + c.line.reference} className="flex items-center gap-3 py-3 text-sm">
                        <span className="min-w-0 flex-1">
                          <span className="font-mono font-semibold">{c.line.reference}</span> · {c.line.name}
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={99}
                          value={c.qty}
                          onChange={(e) => {
                            const qty = Math.max(0, Math.min(99, Number(e.target.value) || 0))
                            setCart((prev) => (qty === 0 ? prev.filter((x) => x !== c) : prev.map((x) => (x === c ? { ...x, qty } : x))))
                          }}
                          aria-label={`Quantité ${c.line.reference}`}
                          className="h-9 w-16 rounded-lg bg-gray-50 px-2 text-center ring-1 ring-gray-200"
                        />
                        <span className="w-24 text-right font-semibold">{formatEUR(c.line.priceHT * c.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-3 space-y-1 border-t border-gray-200 pt-3 text-sm">
                    <div className="flex justify-between"><dt className="text-gray-600">Total HT</dt><dd className="font-semibold">{formatEUR(totalHT)}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-600">TVA {Math.round(VAT_RATE * 100)} %</dt><dd>{formatEUR(totalTTC - totalHT)}</dd></div>
                    <div className="flex justify-between text-base"><dt className="font-bold">Total TTC</dt><dd className="font-display font-extrabold">{formatEUR(totalTTC)}</dd></div>
                  </dl>
                  <button type="button" onClick={validate} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary-600 font-display font-bold text-white hover:bg-secondary-700">
                    Valider sur mon encours
                  </button>
                </>
              )}
              {result && (
                <div role="status" className={`mt-4 rounded-2xl p-4 text-sm ${result.ok ? 'bg-green-50 text-green-800 ring-1 ring-green-200' : 'bg-red-50 text-red-800 ring-1 ring-red-200'}`}>
                  <p className="font-semibold">{result.ok ? 'Commande validée' : 'Commande bloquée'}</p>
                  <p className="mt-0.5">{result.message}</p>
                  {!result.ok && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => { setCart([]); setResult({ ok: true, message: 'Paiement par carte accepté (démo) : commande lancée sans toucher à votre encours.' }) }} className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white">
                        Payer par carte (démo)
                      </button>
                      <a href={`tel:${SITE.phone}`} className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-gray-900 ring-1 ring-gray-200">Appeler le magasin</a>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Credit sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-40 lg:self-start">
            <section className="rounded-3xl bg-white p-5 ring-1 ring-gray-200">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-bold text-gray-900">Mon encours</h2>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${STATUS_UI[shownStatus].cls}`}>{STATUS_UI[shownStatus].label}</span>
              </div>
              <p className="mt-3 font-display text-3xl font-extrabold text-gray-900">
                {formatEUR(current.outstandingTTC)} <span className="text-base font-semibold text-gray-400">/ {formatEUR(account.creditLimitTTC)}</span>
              </p>
              <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-gray-100" role="progressbar" aria-valuenow={usedPct} aria-valuemin={0} aria-valuemax={100} aria-label="Encours utilisé">
                {cart.length > 0 && <div className="absolute inset-y-0 left-0 rounded-full bg-amber-300" style={{ width: `${afterPct}%` }} />}
                <div className={`absolute inset-y-0 left-0 rounded-full ${current.usage >= PRO.alertThreshold ? 'bg-secondary-600' : 'bg-green-500'}`} style={{ width: `${usedPct}%` }} />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Disponible : <span className="font-semibold text-gray-900">{formatEUR(current.availableTTC)}</span>
                {cart.length > 0 && <span className="text-gray-500"> · après cette commande : {formatEUR(Math.max(0, current.availableTTC - totalTTC))}</span>}
              </p>
              {(shownStatus !== 'actif' || cart.length > 0) && (
                <p className={`mt-3 rounded-xl px-3 py-2 text-xs ${shownStatus === 'actif' ? 'bg-gray-50 text-gray-600' : shownStatus === 'alerte' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-700'}`}>
                  {(cart.length ? preview : current).message}
                </p>
              )}
            </section>

            <section className="rounded-3xl bg-white p-5 ring-1 ring-gray-200">
              <h2 className="flex items-center gap-2 font-display text-base font-bold text-gray-900">
                <Icon name="calendar" className="w-5 h-5 text-secondary-600" /> Prochain prélèvement
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {debitDate ? debitDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '…'} ·{' '}
                <span className="font-semibold text-gray-900">{formatEUR(account.openInvoicesTTC)}</span>
              </p>
              <ul className="mt-3 divide-y divide-gray-100 text-sm">
                <li className="flex justify-between py-2"><span className="text-gray-600">Relevé semaine en cours</span><span className="font-semibold">{formatEUR(account.openInvoicesTTC)}</span></li>
                <li className="flex justify-between py-2"><span className="text-gray-600">Commandes non facturées</span><span className="font-semibold">{formatEUR(account.uninvoicedOrdersTTC)}</span></li>
                <li className="flex justify-between py-2">
                  <span className="text-gray-600">Dernier prélèvement</span>
                  <span className={`font-semibold ${account.hasRejectedDebit ? 'text-red-600' : 'text-green-700'}`}>{account.hasRejectedDebit ? 'Rejeté' : 'Payé'}</span>
                </li>
              </ul>
              <p className="mt-3 text-[11px] text-gray-400">Règles complètes : docs/specs/encours-et-blocage.md (pour le développeur).</p>
            </section>

            <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Bonjour, compte pro : une question sur mon encours.')}`} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 font-display font-bold text-white hover:bg-green-700">
              <WhatsAppIcon className="w-5 h-5" /> Mon interlocuteur dédié
            </a>
            <Link href="/pro" className="block text-center text-sm font-semibold text-gray-600 hover:text-gray-900">← Retour à l’offre pro</Link>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
