'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { PageHero, heroSecondaryBtn } from '../components/ui/PageHero'
import { Icon, WhatsAppIcon, type IconName } from '../components/ui/Icon'
import { OpeningHoursCard } from '../components/home/OpeningHoursCard'
import { StoreMap } from '../components/home/StoreMap'
import { sendEmail } from '../lib/emailService'
import { SITE } from '../lib/site'

const ADDRESS = `${SITE.street}, ${SITE.postalCode} ${SITE.city}`
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${SITE.name}, ${ADDRESS}`)}`

const SUBJECTS = ['Demande de pièce', 'Disponibilité / prix', 'Suivi de commande', 'Compte professionnel', 'Autre demande']

const CHANNELS: { icon: IconName | 'whatsapp'; title: string; value: string; note: string; href: string; external?: boolean }[] = [
  { icon: 'whatsapp', title: 'WhatsApp', value: 'Écrire au magasin', note: 'Le plus rapide : envoyez une photo de la carte grise ou de la pièce', href: `https://wa.me/${SITE.whatsapp}`, external: true },
  { icon: 'phone', title: 'Téléphone', value: SITE.phoneDisplay, note: 'Aux heures d’ouverture du magasin', href: `tel:${SITE.phone}` },
  { icon: 'map-pin', title: 'Au magasin', value: `${SITE.street}`, note: `${SITE.postalCode} ${SITE.city} · itinéraire`, href: DIRECTIONS, external: true },
  { icon: 'document', title: 'E-mail', value: 'Nous écrire', note: SITE.email, href: `mailto:${SITE.email}` },
]

const EMPTY = { name: '', email: '', phone: '', subject: SUBJECTS[0], matricule: '', message: '' }

export function ContactPage() {
  const [form, setForm] = useState(EMPTY)
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('sending')
    try {
      const { matricule, ...rest } = form
      await sendEmail(form.subject || 'Nouveau message de contact', matricule.trim() ? form : rest)
      setState('sent')
      setForm(EMPTY)
    } catch (error) {
      console.error('Error submitting form:', error)
      setState('error')
    }
  }

  const input =
    'h-12 w-full rounded-lg bg-white px-3.5 text-[15px] text-gray-900 ring-1 ring-gray-300 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900'
  const label = 'mb-1.5 block text-sm font-semibold text-gray-800'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <PageHero
          eyebrow="Le magasin"
          title={
            <>
              Passez au comptoir, <span className="text-secondary-500">ou écrivez-nous.</span>
            </>
          }
          intro={`${SITE.street} à ${SITE.city}. Pour une référence ou une disponibilité, WhatsApp est le plus rapide : envoyez une photo de la carte grise ou de la pièce.`}
          image="/magasin.png"
          imagePosition="center 40%"
        >
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-green-600 px-6 font-display font-bold text-white hover:bg-green-700"
          >
            <WhatsAppIcon className="w-5 h-5" /> Écrire sur WhatsApp
          </a>
          <a href={DIRECTIONS} target="_blank" rel="noopener noreferrer" className={heroSecondaryBtn}>
            <Icon name="map-pin" className="w-4 h-4" /> Itinéraire
          </a>
        </PageHero>

        {/* Ways to reach us — one band of four linked tiles */}
        <div className="relative z-10 max-w-7xl mx-auto -mt-8 px-4 sm:px-6 lg:px-8">
          <ul className="grid gap-px overflow-hidden rounded-xl bg-gray-200 shadow-[0_12px_32px_-16px_rgba(23,23,22,0.45)] ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map((c) => (
              <li key={c.title} className="flex bg-white">
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex flex-1 items-start gap-4 p-5 transition-colors hover:bg-gray-50"
                >
                  {c.icon === 'whatsapp' ? (
                    <WhatsAppIcon className="h-8 w-8 shrink-0 text-green-600" />
                  ) : (
                    <Icon name={c.icon} className="h-9 w-9 shrink-0 text-secondary-600" />
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm text-gray-500">{c.title}</span>
                    <span className="block font-display text-lg font-bold leading-tight text-gray-900 group-hover:text-secondary-600">{c.value}</span>
                    <span className="mt-1 block break-words text-sm text-gray-600">{c.note}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-7xl mx-auto grid gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:px-8 lg:py-14">
          {/* Form */}
          <section className="rounded-xl bg-white p-5 ring-1 ring-gray-200 sm:p-8" aria-labelledby="contact-form-title">
            <h2 id="contact-form-title" className="font-display text-3xl font-bold leading-tight text-gray-900">Envoyez-nous un message</h2>
            <p className="mt-1.5 text-gray-600">On vous répond par e-mail ou par téléphone, aux heures d’ouverture du magasin.</p>

            {state === 'sent' ? (
              <div role="status" className="mt-6 rounded-lg bg-gray-50 p-8 text-center ring-1 ring-gray-200">
                <Icon name="check-circle" weight="fill" className="mx-auto h-12 w-12 text-emerald-600" />
                <p className="mt-3 font-display text-lg font-bold text-gray-900">Message envoyé, merci !</p>
                <p className="mt-1 text-sm text-gray-600">Nous revenons vers vous rapidement. Pour une urgence, appelez le {SITE.phoneDisplay}.</p>
                <button type="button" onClick={() => setState('idle')} className="mt-4 text-sm font-bold text-secondary-600 hover:underline">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className={label}>Nom complet <span className="text-secondary-600">*</span></label>
                  <input id="c-name" name="name" required autoComplete="name" value={form.name} onChange={update} placeholder="Jean Dupont" className={input} />
                </div>
                <div>
                  <label htmlFor="c-phone" className={label}>Téléphone</label>
                  <input id="c-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update} placeholder="06 12 34 56 78" className={input} />
                </div>
                <div>
                  <label htmlFor="c-email" className={label}>E-mail <span className="text-secondary-600">*</span></label>
                  <input id="c-email" name="email" type="email" required autoComplete="email" value={form.email} onChange={update} placeholder="vous@exemple.fr" className={input} />
                </div>
                <div>
                  <label htmlFor="c-subject" className={label}>Sujet <span className="text-secondary-600">*</span></label>
                  <select id="c-subject" name="subject" required value={form.subject} onChange={update} className={input}>
                    {SUBJECTS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="c-plate" className={label}>
                    Plaque d’immatriculation <span className="font-normal text-gray-400">(facultatif, pour trouver la bonne pièce)</span>
                  </label>
                  <input id="c-plate" name="matricule" value={form.matricule} onChange={update} placeholder="AA-123-BB" className={`${input} font-mono uppercase tracking-wider`} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="c-message" className={label}>Message <span className="text-secondary-600">*</span></label>
                  <textarea
                    id="c-message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={update}
                    placeholder="Décrivez la pièce recherchée ou votre question…"
                    className="w-full rounded-lg bg-white px-3.5 py-3 text-[15px] text-gray-900 ring-1 ring-gray-300 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                {state === 'error' && (
                  <p role="alert" className="sm:col-span-2 flex items-start gap-2 rounded-lg bg-secondary-50 px-4 py-3 text-sm font-medium text-secondary-800 ring-1 ring-secondary-200">
                    Le message n’a pas pu partir. Réessayez, ou contactez-nous par WhatsApp ou au {SITE.phoneDisplay}.
                  </p>
                )}
                <div className="flex flex-col-reverse items-start gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-500"><span className="text-secondary-600">*</span> Champs obligatoires</p>
                  <button
                    type="submit"
                    disabled={state === 'sending'}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-secondary-600 px-6 font-display text-sm font-bold text-white hover:bg-secondary-700 disabled:opacity-60 sm:w-auto"
                  >
                    {state === 'sending' ? 'Envoi…' : 'Envoyer le message'}
                    <Icon name="arrow-right" className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            <p className="mt-6 border-t border-gray-200 pt-5 text-sm text-gray-600">
              Garage ou magasin ?{' '}
              <Link href="/pro" className="font-bold text-secondary-600 hover:underline">
                Ouvrez un compte professionnel
              </Link>{' '}
              : prix nets, livraison à l’atelier, paiement à la semaine.
            </p>
          </section>

          {/* Hours + map */}
          <div className="flex flex-col gap-6">
            <OpeningHoursCard />
            <StoreMap className="flex-1" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
