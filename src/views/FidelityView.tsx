'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PageHero, heroPrimaryBtn, heroSecondaryBtn } from '@/components/ui/PageHero'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Icon, WhatsAppIcon, type IconName } from '@/components/ui/Icon'
import { LOYALTY, PRO } from '@/lib/shop/config'
import { formatEUR } from '@/lib/shop/format'
import { planCtReminders, planFollowUps, type FollowUp } from '@/lib/loyalty/followUps'
import { formatDateFR } from '@/lib/loyalty/serviceLog'
import { SITE } from '@/lib/site'

type Tab = 'particuliers' | 'pro'

// How the WhatsApp template variables read for the customer.
const PREVIEW_LINKS: Record<string, string> = {
  '{{lien_suivi}}': 'espaceauto92.fr/suivi-commande',
  '{{lien_avis}}': 'lien vers nos avis Google',
  '{{lien_checklist}}': 'espaceauto92.fr/carnet-entretien',
}

const FOLLOW_ICON: Record<FollowUp['kind'], IconName> = {
  confirmation: 'check-circle',
  suivi: 'truck',
  avis: 'heart',
  'rappel-usure': 'bell',
  'rappel-ct': 'calendar',
}

const FOLLOW_TITLE: Record<FollowUp['kind'], string> = {
  confirmation: 'Confirmation + facture',
  suivi: 'Lien de suivi en temps réel',
  avis: 'Demande d’avis Google',
  'rappel-usure': 'Rappel pièce d’usure',
  'rappel-ct': 'Rappel contrôle technique',
}

// Mini preview of the service log (same status style as the real page).
const LOG_PREVIEW: { label: string; due: string; icon: IconName; cls: string }[] = [
  { label: 'Balais d’essuie-glace', due: 'à faire', icon: 'warning', cls: 'text-secondary-600' },
  { label: 'Vidange + filtre à huile', due: 'dans 3 semaines', icon: 'timer', cls: 'text-gray-500' },
  { label: 'Contrôle technique', due: 'dans 7 semaines', icon: 'timer', cls: 'text-gray-500' },
  { label: 'Plaquettes de frein', due: 'dans 11 mois', icon: 'check-circle', cls: 'text-emerald-600' },
]

const darkField =
  'h-12 w-full rounded-lg bg-white px-3.5 text-[15px] text-gray-900 outline-none ring-1 ring-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-signal-400'
const darkLabel = 'mb-1.5 block text-sm font-semibold text-white/90'

export function FidelityView({ initialTab }: { initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab)
  const [plan, setPlan] = useState<FollowUp[] | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', plate: '' })
  const [consent, setConsent] = useState(false)
  const p = LOYALTY.particulier
  const isPro = tab === 'pro'

  // Example schedule for an order placed "now" — computed after mount so the
  // dates match the visitor's clock (no hydration mismatch).
  useEffect(() => {
    const now = new Date()
    const ctDue = new Date(now.getTime() + 120 * 86_400_000) // demo: CT due in ~4 months
    setPlan(
      [
        ...planFollowUps({
          orderId: 'EA92-10458',
          firstName: 'Karim',
          purchasedAt: now,
          mode: 'coursier',
          lines: [
            { name: 'Plaquettes de frein avant', wearPart: 'plaquettes' },
            { name: 'Balais d’essuie-glace avant', wearPart: 'balais' },
          ],
        }),
        ...planCtReminders({ firstName: 'Karim', plate: 'AB-123-CD', due: ctDue }, now),
      ].sort((a, b) => a.sendAt.getTime() - b.sendAt.getTime()),
    )
  }, [])

  const switchTab = (t: Tab) => {
    setTab(t)
    window.history.replaceState(null, '', t === 'pro' ? '/fidelite?espace=pro' : '/fidelite')
  }

  const canJoin = consent && form.name.trim().length > 0
  const joinWa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Bonjour, je souhaite rejoindre le club fidélité Espace Auto 92.${form.name ? ` Nom : ${form.name}.` : ''}${form.phone ? ` Mobile : ${form.phone}.` : ''}${form.plate ? ` Plaque : ${form.plate}.` : ''} J’accepte de recevoir les messages du club sur WhatsApp.`,
  )}`

  const rebates = LOYALTY.pro.rebateTiers

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PageHero
          eyebrow={isPro ? 'Fidélité professionnels' : 'Club fidélité'}
          title={
            <>
              Plus vous roulez avec nous, <span className="text-secondary-500">plus on vous le rend.</span>
            </>
          }
          intro={
            isPro
              ? 'Garages et magasins : une remise de fin d’année sur vos achats, en plus de vos prix nets.'
              : 'Des points à chaque achat, un carnet d’entretien qui se remplit tout seul et des rappels avant chaque échéance. Gratuit, sans carte.'
          }
          image="/blog5.jpeg"
          imagePosition="center 40%"
          stats={
            isPro
              ? [
                  ...rebates.map((t) => ({ value: `${Math.round(t.rate * 100)} %`, label: `dès ${formatEUR(t.fromYearlyHT)} HT / an` })),
                  { value: formatEUR(PRO.creditLimitDefaultTTC), label: 'encours de départ' },
                ]
              : [
                  { value: `${p.pointsPerEuro} pt / €`, label: 'en ligne et au magasin' },
                  { value: formatEUR(p.voucherValueTTC), label: `offerts tous les ${p.voucherEveryPoints} points` },
                  { value: `+${p.welcomePoints} pts`, label: 'à l’inscription' },
                  { value: `+${p.reviewPoints} pts`, label: 'pour un avis Google' },
                ]
          }
        >
          {isPro ? (
            <>
              <Link href="/pro#ouvrir-un-compte" className={heroPrimaryBtn}>
                Ouvrir un compte pro <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2.4} />
              </Link>
              <Link href="/pro" className={heroSecondaryBtn}>
                Voir l’offre pro
              </Link>
            </>
          ) : (
            <>
              <a href="#rejoindre" className={heroPrimaryBtn}>
                Rejoindre le club <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2.4} />
              </a>
              <Link href="/carnet-entretien" className={heroSecondaryBtn}>
                <Icon name="clipboard" className="h-4 w-4" /> Voir le carnet d’entretien
              </Link>
            </>
          )}
        </PageHero>

        {/* Programme tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div role="tablist" aria-label="Programme" className="max-w-7xl mx-auto flex gap-6 px-4 sm:px-6 lg:px-8">
            {(['particuliers', 'pro'] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => switchTab(t)}
                className={`-mb-px flex h-14 items-center border-b-2 font-display text-base font-bold transition-colors ${
                  tab === t ? 'border-secondary-600 text-secondary-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {t === 'particuliers' ? 'Particuliers' : 'Professionnels'}
              </button>
            ))}
          </div>
        </div>

        {!isPro ? (
          <>
            {/* Tiers */}
            <section className="bg-white py-10 lg:py-14">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading title="Trois niveaux, selon vos achats de l’année" subtitle="Vous montez de niveau automatiquement : rien à demander." />
                <div className="grid gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 md:grid-cols-3">
                  {p.tiers.map((tier, i) => {
                    const top = i === p.tiers.length - 1
                    return (
                      <div key={tier.id} className={`flex flex-col p-6 sm:p-7 ${top ? 'bg-gray-900 text-white' : 'bg-white'}`}>
                        <p className={`font-display text-sm font-bold uppercase tracking-[0.1em] ${top ? 'text-signal-400' : 'text-gray-500'}`}>
                          {tier.fromYearlyTTC === 0 ? 'Dès l’inscription' : `Dès ${formatEUR(tier.fromYearlyTTC)} d’achats / an`}
                        </p>
                        <h3 className="mt-1 font-display text-3xl font-bold">{tier.name}</h3>
                        <ul className="mt-5 space-y-2.5 text-[15px]">
                          {i > 0 && <li className={top ? 'text-white/60' : 'text-gray-500'}>Tous les avantages {p.tiers[i - 1].name}, plus :</li>}
                          {tier.perks.map((perk) => (
                            <li key={perk} className="flex gap-2.5">
                              <Icon name="check-circle" weight="fill" className={`mt-0.5 h-5 w-5 shrink-0 ${top ? 'text-emerald-400' : 'text-emerald-600'}`} />
                              {perk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* Service log + WhatsApp follow-up */}
            <section className="bg-gray-50 py-10 lg:py-14">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading title="Un suivi qui travaille pour vous" subtitle="Votre voiture suivie, vos échéances rappelées : vous n’avez rien à noter." />
                <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                  <div className="rounded-xl bg-white p-6 ring-1 ring-gray-200 sm:p-8 lg:sticky lg:top-36">
                    <div className="flex items-center gap-3">
                      <Icon name="clipboard" className="h-9 w-9 shrink-0 text-secondary-600" />
                      <h3 className="font-display text-2xl font-bold leading-tight text-gray-900">Votre carnet d’entretien, rempli tout seul</h3>
                    </div>
                    <p className="mt-3 text-gray-700">
                      Chaque pièce achetée (en ligne ou au comptoir) s’ajoute à l’historique de votre véhicule, avec la prochaine échéance
                      calculée à partir de la date d’achat. Le contrôle technique aussi.
                    </p>
                    <ul className="mt-5 divide-y divide-gray-200 rounded-lg ring-1 ring-gray-200" aria-label="Exemple de carnet">
                      {LOG_PREVIEW.map((r) => (
                        <li key={r.label} className="flex items-center justify-between gap-3 px-4 py-3 text-[15px]">
                          <span className="font-semibold text-gray-900">{r.label}</span>
                          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-gray-700">
                            <Icon name={r.icon} weight="fill" className={`h-4 w-4 ${r.cls}`} /> {r.due}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/carnet-entretien" className="mt-5 inline-flex h-12 items-center gap-2 rounded-lg bg-gray-900 px-5 font-display text-sm font-bold text-white hover:bg-secondary-600">
                      Voir un carnet d’exemple <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2.4} />
                    </Link>
                  </div>

                  <div className="rounded-xl bg-white p-6 ring-1 ring-gray-200 sm:p-8">
                    <div className="flex items-center gap-3">
                      <WhatsAppIcon className="h-8 w-8 shrink-0 text-green-600" />
                      <h3 className="font-display text-2xl font-bold leading-tight text-gray-900">Le suivi sur WhatsApp</h3>
                    </div>
                    <p className="mt-3 text-gray-700">Exemple pour une commande passée aujourd’hui (plaquettes + essuie-glaces) :</p>
                    <ol className="mt-5 space-y-5 border-l-2 border-gray-200 pl-5">
                      {(plan ?? []).map((f, i) => (
                        <li key={f.kind + i} className="relative">
                          <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-gray-900 ring-4 ring-white" aria-hidden="true" />
                          <p className="flex flex-wrap items-center gap-x-2 text-[15px] font-semibold text-gray-900">
                            <Icon name={FOLLOW_ICON[f.kind]} className="h-5 w-5 text-gray-500" />
                            {FOLLOW_TITLE[f.kind]}
                            <span className="text-sm font-normal text-gray-500">{formatDateFR(f.sendAt)}</span>
                          </p>
                          <p className="mt-1.5 rounded-lg bg-gray-100 px-3.5 py-2.5 text-sm leading-relaxed text-gray-700">
                            {/* Template placeholders ({{lien_suivi}}…) shown as the link the customer will get */}
                            {f.preview.split(/(\{\{\w+\}\})/).map((part, j) =>
                              /^\{\{\w+\}\}$/.test(part) ? (
                                <span key={j} className="font-semibold text-gray-900 underline underline-offset-2">{PREVIEW_LINKS[part] ?? 'espaceauto92.fr'}</span>
                              ) : (
                                part
                              ),
                            )}
                          </p>
                        </li>
                      ))}
                      {!plan && <li className="h-40 animate-pulse rounded-lg bg-gray-100" aria-hidden="true" />}
                    </ol>
                  </div>
                </div>
              </div>
            </section>

            {/* Join */}
            <section id="rejoindre" className="scroll-mt-36 bg-white py-10 lg:py-14">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 rounded-xl bg-gray-900 p-6 text-white sm:p-10 lg:grid-cols-2 lg:items-center">
                  <div>
                    <h2 className="font-display text-3xl font-bold leading-tight lg:text-4xl">Rejoindre le club</h2>
                    <p className="mt-3 max-w-md text-white/80">Gratuit, sans carte : votre numéro de mobile suffit, au magasin comme en ligne.</p>
                    <ul className="mt-5 space-y-2.5 text-white/90">
                      {[`+${p.welcomePoints} points offerts dès l’inscription`, 'Vos achats au comptoir comptent aussi', 'Désinscription à tout moment en répondant STOP'].map((t) => (
                        <li key={t} className="flex gap-2.5">
                          <Icon name="check-circle" weight="fill" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="club-name" className={darkLabel}>Prénom</label>
                        <input id="club-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="given-name" className={darkField} />
                      </div>
                      <div>
                        <label htmlFor="club-phone" className={darkLabel}>Mobile</label>
                        <input id="club-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78" className={darkField} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="club-plate" className={darkLabel}>
                        Plaque d’immatriculation <span className="font-normal text-white/60">(facultatif)</span>
                      </label>
                      <input id="club-plate" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value.toUpperCase() })} placeholder="AA-123-BB" autoComplete="off" className={`${darkField} font-display text-lg font-bold tracking-[0.1em]`} />
                    </div>
                    <label className="flex cursor-pointer items-start gap-3 text-sm text-white/85">
                      <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-green-500" />
                      J’accepte de recevoir les messages du club (points, rappels d’entretien) sur WhatsApp.
                    </label>
                    <a
                      href={canJoin ? joinWa : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-disabled={!canJoin}
                      className={`flex h-12 items-center justify-center gap-2 rounded-lg font-display text-sm font-bold ${
                        canJoin ? 'bg-green-600 text-white hover:bg-green-700' : 'pointer-events-none bg-white/10 text-white/50'
                      }`}
                    >
                      <WhatsAppIcon className="h-5 w-5" /> M’inscrire via WhatsApp
                    </a>
                    {!canJoin && <p className="text-sm text-white/60">Indiquez votre prénom et cochez la case pour vous inscrire.</p>}
                  </form>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="bg-white py-10 lg:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                title="Remise de fin d’année sur vos achats"
                subtitle="Calculée sur vos achats HT de l’année civile, versée en avoir en janvier."
              />
              <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                <div className="overflow-hidden rounded-xl ring-1 ring-gray-200">
                  <table className="w-full text-[15px]">
                    <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-semibold">Achats annuels HT</th>
                        <th scope="col" className="px-5 py-3 text-right font-semibold">Remise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rebates.map((t) => (
                        <tr key={t.fromYearlyHT}>
                          <th scope="row" className="px-5 py-4 text-left font-medium text-gray-800">Dès {formatEUR(t.fromYearlyHT)}</th>
                          <td className="px-5 py-4 text-right font-display text-2xl font-bold text-gray-900">{Math.round(t.rate * 100)} %</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-xl bg-gray-900 p-6 text-white sm:p-8">
                  <h3 className="font-display text-2xl font-bold">Et en plus</h3>
                  <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
                    {[...LOYALTY.pro.perks, `Encours de départ ${formatEUR(PRO.creditLimitDefaultTTC)}, prélèvement chaque semaine`].map((perk) => (
                      <li key={perk} className="flex gap-3 py-3">
                        <Icon name="check-circle" weight="fill" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link href="/pro#ouvrir-un-compte" className="flex h-12 flex-1 items-center justify-center rounded-lg bg-secondary-600 px-5 font-display text-sm font-bold text-white hover:bg-secondary-700">
                      Ouvrir un compte pro
                    </Link>
                    <Link href="/pro/espace" className="flex h-12 flex-1 items-center justify-center rounded-lg px-5 font-display text-sm font-bold text-white ring-1 ring-white/30 hover:bg-white/10">
                      Voir l’Espace Pro (démo)
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
