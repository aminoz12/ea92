'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Icon, WhatsAppIcon } from '@/components/ui/Icon'
import { useShop } from '@/providers/ShopProvider'
import { vehicleLabel } from '@/lib/integrations/vehicle'
import {
  WEAR_INTERVALS,
  WEAR_PRODUCT_SLUG,
  dueStatus,
  formatDateFR,
  nextDueDate,
  reminderDate,
  type DueStatus,
} from '@/lib/loyalty/serviceLog'
import { CT_CHECKLIST, computeCt } from '@/lib/loyalty/controleTechnique'
import { SITE } from '@/lib/site'
import type { WearPartKind } from '@/lib/shop/types'

interface Entry {
  id: string
  kind: WearPartKind
  doneAt: string // ISO date
  source: 'Magasin' | 'En ligne' | 'Garage partenaire' | 'Ajout manuel'
}

const STORAGE_KEY = 'ea92-carnet-v1'
const CT_STORAGE_KEY = 'ea92-ct-v1'
const DAY = 86_400_000

interface CtDates {
  firstRegistration: string // YYYY-MM-DD
  lastCt: string // YYYY-MM-DD or ''
}

const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// Demo history, relative to today so the statuses always make sense.
const demoEntries = (now: number): Entry[] => [
  { id: 'd1', kind: 'balais', doneAt: new Date(now - 380 * DAY).toISOString(), source: 'Magasin' },
  { id: 'd2', kind: 'vidange', doneAt: new Date(now - 340 * DAY).toISOString(), source: 'Garage partenaire' },
  { id: 'd3', kind: 'plaquettes', doneAt: new Date(now - 400 * DAY).toISOString(), source: 'En ligne' },
  { id: 'd4', kind: 'filtre-habitacle', doneAt: new Date(now - 200 * DAY).toISOString(), source: 'Magasin' },
  { id: 'd5', kind: 'batterie', doneAt: new Date(now - 600 * DAY).toISOString(), source: 'Magasin' },
]

const STATUS: Record<DueStatus, { label: string; cls: string }> = {
  'a-faire': { label: 'À faire', cls: 'bg-red-50 text-red-700 ring-red-200' },
  bientot: { label: 'Bientôt', cls: 'bg-amber-50 text-amber-800 ring-amber-200' },
  ok: { label: 'À jour', cls: 'bg-green-50 text-green-700 ring-green-200' },
}

export function ServiceLogView() {
  const { vehicle, hydrated } = useShop()
  const [entries, setEntries] = useState<Entry[] | null>(null)
  const [reminders, setReminders] = useState(true)
  const [newKind, setNewKind] = useState<WearPartKind>('vidange')
  const [newDate, setNewDate] = useState('')
  const [ctDates, setCtDates] = useState<CtDates | null>(null)

  // CT dates: saved values first, else the first registration returned by the
  // plate lookup, else a demo car whose first CT is due in ~7 weeks.
  useEffect(() => {
    if (!hydrated) return
    let stored: CtDates | null = null
    try {
      const raw = window.localStorage.getItem(CT_STORAGE_KEY)
      stored = raw ? (JSON.parse(raw) as CtDates) : null
    } catch {
      stored = null
    }
    if (stored?.firstRegistration || stored?.lastCt) {
      setCtDates(stored)
      return
    }
    const demo = new Date()
    demo.setFullYear(demo.getFullYear() - 4)
    demo.setDate(demo.getDate() + 50)
    setCtDates({ firstRegistration: vehicle?.firstRegistration ?? isoDay(demo), lastCt: '' })
  }, [hydrated, vehicle])

  const saveCt = (next: CtDates) => {
    setCtDates(next)
    try {
      window.localStorage.setItem(CT_STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* not persisted */
    }
  }

  const ct = useMemo(() => (ctDates ? computeCt(ctDates) : null), [ctDates])
  const todayISO = useMemo(() => isoDay(new Date()), [])

  // Load after mount: dates depend on the visitor's clock and storage.
  useEffect(() => {
    let stored: Entry[] | null = null
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      stored = raw ? (JSON.parse(raw) as Entry[]) : null
    } catch {
      stored = null
    }
    setEntries(stored && stored.length ? stored : demoEntries(Date.now()))
    setNewDate(new Date().toISOString().slice(0, 10))
  }, [])

  const save = (next: Entry[]) => {
    setEntries(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* not persisted */
    }
  }

  const rows = useMemo(() => {
    if (!entries) return []
    const today = new Date()
    return entries
      .map((e) => {
        const done = new Date(e.doneAt)
        const due = nextDueDate(e.kind, done)
        return { ...e, done, due, reminder: reminderDate(due), status: dueStatus(due, today) }
      })
      .sort((a, b) => a.due.getTime() - b.due.getTime())
  }, [entries])

  const urgent = rows.filter((r) => r.status !== 'ok').length

  const plate = hydrated && vehicle ? vehicle.plate || 'Plaque non renseignée' : 'AB-123-CD'
  const label = hydrated && vehicle ? vehicleLabel(vehicle) : 'Peugeot 208 II 1.2 PureTech 100'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-3xl font-extrabold text-gray-900">Carnet d’entretien digital</h1>
          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold uppercase text-amber-800">démo</span>
        </div>
        <p className="mt-1 text-gray-500">Rempli automatiquement à chaque achat. Échéances indicatives : le carnet constructeur fait foi.</p>

        <section className="mt-6 flex flex-col gap-4 rounded-3xl bg-gray-900 p-6 text-white sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="font-display text-xl font-bold">{label}</p>
            <p className="text-sm text-white/70">
              <span className="font-mono">{plate}</span> · {rows.length} intervention{rows.length > 1 ? 's' : ''} suivie{rows.length > 1 ? 's' : ''}
              {urgent > 0 && <span className="ml-2 rounded bg-secondary-600 px-1.5 py-0.5 text-xs font-bold">{urgent} à prévoir</span>}
            </p>
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold">
            <input type="checkbox" checked={reminders} onChange={(e) => setReminders(e.target.checked)} className="h-4 w-4 accent-green-500" />
            <WhatsAppIcon className="w-4 h-4 text-green-400" />
            Rappels WhatsApp
          </label>
        </section>

        {/* Contrôle technique */}
        <section className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-gray-200 sm:p-6" aria-labelledby="ct-title">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="ct-title" className="font-display text-lg font-bold text-gray-900">Contrôle technique</h2>
              <p className="text-sm text-gray-500">
                Calculé à partir de la 1re mise en circulation (case B de la carte grise) ou de votre dernier contrôle.
              </p>
            </div>
            {ct?.kind === 'due' && (
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${STATUS[ct.status].cls}`}>{STATUS[ct.status].label}</span>
            )}
          </div>

          {!ctDates ? (
            <div className="mt-4 h-24 animate-pulse rounded-2xl bg-gray-50" aria-hidden="true" />
          ) : (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-semibold text-gray-700">1re mise en circulation</span>
                  <input
                    type="date"
                    value={ctDates.firstRegistration}
                    max={todayISO}
                    onChange={(e) => saveCt({ ...ctDates, firstRegistration: e.target.value })}
                    className="mt-1 h-11 w-full rounded-xl bg-gray-50 px-3 text-sm ring-1 ring-gray-200"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold text-gray-700">
                    Dernier contrôle technique <span className="font-normal text-gray-400">(si déjà fait)</span>
                  </span>
                  <input
                    type="date"
                    value={ctDates.lastCt}
                    max={todayISO}
                    onChange={(e) => saveCt({ ...ctDates, lastCt: e.target.value })}
                    className="mt-1 h-11 w-full rounded-xl bg-gray-50 px-3 text-sm ring-1 ring-gray-200"
                  />
                </label>
              </div>

              {ct?.kind === 'due' ? (
                <div className={`mt-4 rounded-2xl p-4 text-sm ${ct.status === 'a-faire' ? 'bg-red-50 text-red-800' : 'bg-gray-50 text-gray-700'}`}>
                  <p>
                    À faire avant le <span className="font-bold text-gray-900">{formatDateFR(ct.due)}</span>
                    {ct.basis === 'premier' ? ' — premier contrôle, possible dès 6 mois avant cette date.' : ' — puis tous les 2 ans.'}
                  </p>
                  {ct.status === 'a-faire' ? (
                    <p className="mt-1 text-xs">Date dépassée : rouler sans contrôle valide expose à une amende de 135 €. Prenez rendez-vous rapidement.</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      {reminders
                        ? `Rappels WhatsApp le ${ct.reminders.filter((r) => r.getTime() > Date.now()).map(formatDateFR).join(' et le ') || '— (échéance proche)'}`
                        : 'Rappels désactivés'}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
                  {ct?.kind === 'missing' && ct.reason === 'last-ct-needed'
                    ? 'Votre véhicule a plus de 4 ans : indiquez la date de votre dernier contrôle pour calculer le prochain.'
                    : 'Indiquez la date de 1re mise en circulation pour calculer votre prochain contrôle.'}
                </p>
              )}

              <h3 className="mt-5 text-sm font-bold text-gray-900">Avant le contrôle : les points qui font échouer le plus souvent</h3>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {CT_CHECKLIST.map((item) => (
                  <li key={item.label} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3 text-sm">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={2.5} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-gray-900">{item.label}</span>
                      <span className="block text-xs text-gray-500">{item.tip}</span>
                      {item.href && (
                        <Link href={item.href} className="mt-1 inline-block text-xs font-bold text-secondary-600 hover:underline">
                          Voir les pièces →
                        </Link>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl bg-white ring-1 ring-gray-200">
          {!entries ? (
            <div className="h-64 animate-pulse bg-gray-50" aria-hidden="true" />
          ) : (
            <ul className="divide-y divide-gray-100">
              {rows.map((r) => {
                const info = WEAR_INTERVALS[r.kind]
                const st = STATUS[r.status]
                return (
                  <li key={r.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-gray-900">{info.label}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ring-1 ${st.cls}`}>{st.label}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600">
                        Fait le {formatDateFR(r.done)} ({r.source}) · prochaine échéance <span className="font-semibold text-gray-900">{formatDateFR(r.due)}</span>
                        {info.km ? ` ou ${info.km.toLocaleString('fr-FR')} km` : ''}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {reminders ? `Rappel WhatsApp le ${formatDateFR(r.reminder)}` : 'Rappels désactivés'} · {info.tip}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/boutique/${WEAR_PRODUCT_SLUG[r.kind]}`} className="inline-flex h-10 items-center rounded-xl bg-secondary-600 px-4 text-sm font-bold text-white hover:bg-secondary-700">
                        Commander
                      </Link>
                      <button type="button" onClick={() => save(entries.filter((e) => e.id !== r.id))} aria-label={`Supprimer ${info.label}`} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 ring-1 ring-gray-200 hover:text-red-600">
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-gray-200 sm:p-6">
          <h2 className="font-display text-lg font-bold text-gray-900">Ajouter une intervention</h2>
          <p className="text-sm text-gray-500">Faite ailleurs ? Ajoutez-la pour garder un historique complet.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!entries || !newDate) return
              save([...entries, { id: `m${Date.now()}`, kind: newKind, doneAt: new Date(newDate).toISOString(), source: 'Ajout manuel' }])
            }}
            className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px_auto]"
          >
            <select value={newKind} onChange={(e) => setNewKind(e.target.value as WearPartKind)} aria-label="Intervention" className="h-11 rounded-xl bg-gray-50 px-3 text-sm ring-1 ring-gray-200">
              {(Object.keys(WEAR_INTERVALS) as WearPartKind[]).map((k) => (
                <option key={k} value={k}>{WEAR_INTERVALS[k].label}</option>
              ))}
            </select>
            <input type="date" value={newDate} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setNewDate(e.target.value)} aria-label="Date de l’intervention" className="h-11 rounded-xl bg-gray-50 px-3 text-sm ring-1 ring-gray-200" />
            <button type="submit" className="h-11 rounded-xl bg-gray-900 px-5 text-sm font-bold text-white hover:bg-gray-800">Ajouter</button>
          </form>
        </section>

        <p className="mt-6 text-center text-sm text-gray-500">
          Une question sur l’entretien de votre véhicule ?{' '}
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-green-700 hover:underline">
            Demandez-nous sur WhatsApp
          </a>
        </p>
      </main>
      <Footer />
    </div>
  )
}
