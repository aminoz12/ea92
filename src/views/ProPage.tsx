'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Icon, WhatsAppIcon, type IconName } from '../components/ui/Icon'
import { sendEmail } from '../lib/emailService'
import { PRO } from '../lib/shop/config'
import { formatEUR } from '../lib/shop/format'
import { SITE } from '../lib/site'

const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'document', title: 'Ouvrez votre compte', text: 'SIRET + mandat de prélèvement SEPA. Réponse sous 48 h.' },
  { icon: 'search', title: 'Cherchez par référence', text: 'Référence fabricant ou d’origine (OE) : on vous donne les équivalences.' },
  { icon: 'truck', title: 'Recevez à l’atelier', text: 'Coursier en ~1 h, tournée ou retrait comptoir à Nanterre.' },
  { icon: 'banknotes', title: 'Payez chaque semaine', text: `Relevé + prélèvement automatique le ${DAYS[PRO.debitWeekday]}.` },
]

const ADVANTAGES: { icon: IconName; title: string; text: string }[] = [
  { icon: 'lock', title: 'Accès en marque blanche', text: 'Un espace de commande Espace Auto 92, sans plateforme tierce ni abonnement. Vos prix restent confidentiels.' },
  { icon: 'search', title: 'Recherche par référence', text: 'Tapez la référence, on affiche la disponibilité réelle et le prix net. Pas de catalogue à parcourir.' },
  { icon: 'percent', title: 'Prix nets pros', text: 'Le prix affiché est le prix payé, votre remise est déjà incluse. Aucun calcul à faire.' },
  { icon: 'bolt', title: 'Livraison atelier express', text: 'Pièce en stock : chez vous en ~1 h en Île-de-France. Sinon dès ~4 h via notre fournisseur.' },
  { icon: 'banknotes', title: 'Encours & prélèvement', text: `Encours de départ ${formatEUR(PRO.creditLimitDefaultTTC)}, réglé par prélèvement chaque semaine.` },
  { icon: 'chat', title: 'Un interlocuteur dédié', text: 'Sur WhatsApp ou au téléphone, quelqu’un qui connaît votre atelier.' },
]

const EMPTY_FORM = {
  companyName: '',
  siret: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  activity: 'Garage mécanique',
  monthlyVolume: 'Moins de 1 000 €',
  currentSupplier: '',
  additionalInfo: '',
}

export function ProPage() {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [sepa, setSepa] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await sendEmail("Demande d'ouverture de compte professionnel", {
        ...formData,
        sepaAgreement: sepa ? 'Oui' : 'Non',
      })
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const input = 'h-12 w-full rounded-xl bg-gray-50 px-4 text-sm text-gray-900 ring-1 ring-gray-200 outline-none focus:bg-white focus:ring-2 focus:ring-secondary-500'

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gray-900 text-white">
          <img src="/images/atelier-equipe.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/90 to-gray-900/30" />
          <div className="relative max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary-400">Garages · carrossiers · magasins · flottes</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-tight lg:text-6xl">
              Votre fournisseur de pièces, <span className="text-secondary-500">sans plateforme.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/80">
              Pas d’accès aux plateformes pros ? Commandez chez nous en marque blanche : recherche par référence, prix
              nets affichés, livraison à l’atelier et paiement par prélèvement chaque semaine.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#ouvrir-un-compte" className="inline-flex h-12 items-center gap-2 rounded-xl bg-secondary-600 px-6 font-display font-bold hover:bg-secondary-700">
                Ouvrir un compte pro <Icon name="arrow-right" className="w-4 h-4" />
              </a>
              <Link href="/pro/espace" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white/10 px-6 font-semibold ring-1 ring-white/30 hover:bg-white/20">
                <Icon name="lock" className="w-4 h-4" /> Voir l’Espace Pro (démo)
              </Link>
            </div>
            <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { k: formatEUR(PRO.creditLimitDefaultTTC), v: 'encours de départ' },
                { k: 'Hebdo', v: 'prélèvement SEPA' },
                { k: '~1 h', v: 'livraison atelier' },
                { k: '10 000+', v: 'pièces en stock' },
              ].map((s) => (
                <div key={s.v} className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                  <dt className="font-display text-2xl font-extrabold">{s.k}</dt>
                  <dd className="text-xs text-white/70">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-extrabold text-gray-900">Comment ça marche</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl bg-gray-50 p-5">
                <span className="absolute right-4 top-3 font-display text-4xl font-extrabold text-gray-200">{i + 1}</span>
                <Icon name={s.icon} className="w-7 h-7 text-secondary-600" />
                <p className="mt-3 font-display font-bold text-gray-900">{s.title}</p>
                <p className="mt-1 text-sm text-gray-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Advantages */}
        <section className="bg-gray-50 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-extrabold text-gray-900">Pourquoi les garages nous choisissent</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ADVANTAGES.map((a) => (
                <div key={a.title} className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
                    <Icon name={a.icon} className="w-5 h-5" />
                  </span>
                  <p className="mt-4 font-display text-lg font-bold text-gray-900">{a.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conditions */}
        <section id="conditions" className="scroll-mt-36 max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary-600">Conditions</p>
              <h2 className="mt-1.5 font-display text-3xl font-extrabold text-gray-900">Encours et paiement, en clair</h2>
              <p className="mt-3 text-gray-600">
                Vous commandez toute la semaine sur votre encours. Chaque {DAYS[PRO.debitWeekday]}, vous recevez le
                relevé de la semaine écoulée et le montant est prélevé automatiquement.
              </p>
            </div>
            <dl className="divide-y divide-gray-100 rounded-2xl ring-1 ring-gray-200">
              {[
                { k: 'Encours de départ', v: `${formatEUR(PRO.creditLimitDefaultTTC)} TTC` },
                { k: 'Paiement', v: `Prélèvement SEPA chaque ${DAYS[PRO.debitWeekday]}` },
                { k: 'Alerte', v: `Message à ${Math.round(PRO.alertThreshold * 100)} % de l’encours utilisé` },
                { k: 'Plafond atteint', v: 'La commande se règle par carte, ou attend le prochain prélèvement' },
                { k: 'Prélèvement rejeté', v: 'Commandes à crédit suspendues jusqu’à régularisation' },
                { k: 'Évolution', v: 'Encours revu à la hausse après 3 mois sans incident' },
              ].map((r) => (
                <div key={r.k} className="grid grid-cols-[140px_1fr] gap-4 px-4 py-3 text-sm">
                  <dt className="font-semibold text-gray-900">{r.k}</dt>
                  <dd className="text-gray-600">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Account request */}
        <section id="ouvrir-un-compte" className="scroll-mt-36 bg-gray-900 py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h2 className="font-display text-3xl font-extrabold">Prêt à passer en mode PRO ?</h2>
              <p className="mt-2 text-white/70">Demande d’ouverture de compte professionnel — réponse sous 48 h ouvrées.</p>
            </div>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Raison sociale *
                      <input name="companyName" value={formData.companyName} onChange={update} required placeholder="Nom de votre entreprise" className={`mt-1.5 ${input}`} />
                    </label>
                    <label className="block text-sm font-semibold text-gray-700">
                      Numéro SIRET *
                      <input name="siret" value={formData.siret} onChange={update} required inputMode="numeric" pattern="[0-9 ]{14,17}" title="14 chiffres" placeholder="123 456 789 00012" className={`mt-1.5 ${input}`} />
                    </label>
                    <label className="block text-sm font-semibold text-gray-700">
                      E-mail *
                      <input type="email" name="email" value={formData.email} onChange={update} required placeholder="contact@votre-garage.fr" className={`mt-1.5 ${input}`} />
                    </label>
                    <label className="block text-sm font-semibold text-gray-700">
                      Téléphone *
                      <input type="tel" name="phone" value={formData.phone} onChange={update} required placeholder="06 12 34 56 78" className={`mt-1.5 ${input}`} />
                    </label>
                  </div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Adresse *
                    <input name="address" value={formData.address} onChange={update} required placeholder="12 rue de l’Atelier" className={`mt-1.5 ${input}`} />
                  </label>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Ville *
                      <input name="city" value={formData.city} onChange={update} required placeholder="Nanterre" className={`mt-1.5 ${input}`} />
                    </label>
                    <label className="block text-sm font-semibold text-gray-700">
                      Code postal *
                      <input name="postalCode" value={formData.postalCode} onChange={update} required inputMode="numeric" pattern="[0-9]{5}" placeholder="92000" className={`mt-1.5 ${input}`} />
                    </label>
                    <label className="block text-sm font-semibold text-gray-700">
                      Activité
                      <select name="activity" value={formData.activity} onChange={update} className={`mt-1.5 ${input}`}>
                        {['Garage mécanique', 'Carrosserie', 'Magasin de pièces', 'Flotte / loueur', 'Autre'].map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </label>
                    <label className="block text-sm font-semibold text-gray-700">
                      Achats de pièces par mois
                      <select name="monthlyVolume" value={formData.monthlyVolume} onChange={update} className={`mt-1.5 ${input}`}>
                        {['Moins de 1 000 €', '1 000 à 3 000 €', '3 000 à 8 000 €', 'Plus de 8 000 €'].map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </label>
                  </div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Où achetez-vous vos pièces aujourd’hui ?
                    <input name="currentSupplier" value={formData.currentSupplier} onChange={update} placeholder="Distributeur, plateforme, magasin…" className={`mt-1.5 ${input}`} />
                  </label>
                  <label className="block text-sm font-semibold text-gray-700">
                    Informations complémentaires
                    <textarea name="additionalInfo" value={formData.additionalInfo} onChange={update} rows={3} placeholder="Marques travaillées, nombre de véhicules par mois, besoins de livraison…" className="mt-1.5 w-full rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-900 ring-1 ring-gray-200 outline-none focus:bg-white focus:ring-2 focus:ring-secondary-500" />
                  </label>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
                    <input type="checkbox" checked={sepa} onChange={(e) => setSepa(e.target.checked)} className="mt-0.5 h-4 w-4 accent-secondary-600" />
                    J’accepte le principe du paiement par prélèvement SEPA hebdomadaire (le mandat est signé à l’ouverture du compte).
                  </label>
                  <button type="submit" disabled={isSubmitting} className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-secondary-600 font-display text-lg font-bold text-white hover:bg-secondary-700 disabled:opacity-60">
                    {isSubmitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
                  </button>
                  <p className="text-center text-xs text-gray-500">
                    Plus rapide ?{' '}
                    <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Bonjour, je souhaite ouvrir un compte professionnel.')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-green-700 hover:underline">
                      <WhatsAppIcon className="w-3.5 h-3.5" /> Écrivez-nous sur WhatsApp
                    </a>
                  </p>
                </form>
              ) : (
                <div className="py-10 text-center">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
                    <Icon name="check" className="w-8 h-8" strokeWidth={3} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold text-gray-900">Demande envoyée !</h3>
                  <p className="mt-2 text-gray-600">Merci, nous revenons vers vous sous 48 h ouvrées avec votre mandat SEPA et vos accès.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData(EMPTY_FORM)
                      setSepa(false)
                    }}
                    className="mt-6 rounded-xl px-5 py-2.5 font-semibold text-secondary-700 ring-1 ring-secondary-200 hover:bg-secondary-50"
                  >
                    Nouvelle demande
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
