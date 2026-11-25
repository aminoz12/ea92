'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icon, WhatsAppIcon } from '../ui/Icon'
import { SITE } from '@/lib/site'

interface FAQItem {
  id: number
  question: string
  answer: string
  links?: { href: string; label: string }[]
}

// Keep in sync with faqItems in src/lib/structuredData.ts (FAQPage JSON-LD).
const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: 'Comment puis-je retourner un article ?',
    answer:
      "Achat en ligne : vous disposez de 14 jours après réception pour exercer votre droit de rétractation, la pièce doit être retournée non montée, dans son emballage et son état d'origine. Achat en magasin : sauf erreur de notre part, les articles ne sont ni repris ni échangés. Dans tous les cas, une erreur de référence de notre part est échangée immédiatement.",
    links: [{ href: '/livraison-retrait', label: 'Livraison, retrait et retours' }],
  },
  {
    id: 2,
    question: 'Après avoir passé commande, quel est le délai de réception ?',
    answer:
      "Notre boutique dispose d'un vaste stock. Si l'article est épuisé et nécessite une commande, celle-ci arrive en boutique dans un délai allant de 4h à 24h (sous réserve de disponibilité).",
  },
  {
    id: 6,
    question: 'Puis-je commander en ligne et me faire livrer ?',
    answer:
      'Oui, partout en France. Choisissez au moment du paiement : retrait au magasin de Nanterre (ou en casier click & collect), livraison express par coursier en Île-de-France, envoi en colis partout en France, ou livraison directe dans un garage partenaire qui monte la pièce à prix fixe.',
    links: [{ href: '/livraison-retrait', label: 'Voir les modes de livraison et de retrait' }],
  },
  {
    id: 7,
    question: 'Comment être sûr que la pièce est compatible avec mon véhicule ?',
    answer:
      "Saisissez votre plaque d'immatriculation dans la boutique : nous identifions votre véhicule et n'affichons que les pièces compatibles. En cas de doute, envoyez-nous votre carte grise sur WhatsApp et un conseiller vérifie la compatibilité avant l'envoi.",
    links: [{ href: '/boutique', label: 'Rechercher par plaque dans la boutique' }],
  },
  {
    id: 3,
    question: 'Les pièces sont-elles garanties ?',
    answer: "Oui, l'ensemble de nos pièces est garanti 1 an, dans le respect des conditions fournisseurs.",
  },
  {
    id: 4,
    question: "Je souhaiterais avoir plus d'informations sur vos services, comment faire ?",
    answer:
      'Retrait au magasin, livraison, montage en garage partenaire, club fidélité, carnet d’entretien : tout est détaillé dans le menu du site. Vous pouvez aussi nous poser directement vos questions, nous serons ravis de vous renseigner au 01 47 85 10 00.',
    links: [
      { href: '/montage-garage', label: 'Montage en garage partenaire' },
      { href: '/fidelite', label: 'Club fidélité' },
    ],
  },
  // TEMP (Google Ads — certification en cours) : question FAQ « carte grise »
  // retirée. Décommenter ce bloc pour la restaurer après certification.
  // {
  //   id: 5,
  //   question: "Quelles sont les documents nécessaires pour la création d'une carte grise ?",
  //   answer: "Vos cartes grises et plaques d'immatriculation sont réalisés en seulement 10 minutes en magasin ou en ligne. Les documents nécessaires sont disponibles ci-dessous :",
  //   links: [{ href: '/documents.pdf', label: 'Télécharger la liste des documents nécessaires' }],
  // },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(FAQ_ITEMS[0].id)

  return (
    <section id="faq" className="scroll-mt-32 bg-gray-50 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto grid gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12 lg:px-8">
        {/* Intro + contact */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="font-display text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">Une question avant de commander ?</h2>
          <p className="mt-3 text-gray-600">
            Les réponses à ce qu’on nous demande le plus souvent au comptoir. Pour une pièce précise, le plus rapide reste
            WhatsApp : envoyez une photo de la carte grise ou de la pièce.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 font-display font-bold text-white hover:bg-green-700"
            >
              <WhatsAppIcon className="w-5 h-5" /> Écrire sur WhatsApp
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 font-display font-bold text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50"
            >
              <Icon name="phone" className="w-5 h-5 text-secondary-600" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Accordion */}
        <div className="divide-y divide-gray-200 overflow-hidden rounded-xl ring-1 ring-gray-200">
          {FAQ_ITEMS.map((item) => {
            const isOpen = open === item.id
            const panelId = `faq-panel-${item.id}`
            return (
              <div key={item.id} className="bg-white">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="flex-1 font-semibold text-gray-900">{item.question}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                        isOpen ? 'rotate-180 bg-secondary-600 text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <Icon name="chevron-down" className="w-4 h-4" strokeWidth={2.4} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 sm:px-6">
                      <p className="leading-relaxed text-gray-700">{item.answer}</p>
                      {item.links && (
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                          {item.links.map((l) => (
                            <Link key={l.href} href={l.href} className="inline-flex items-center gap-1 text-sm font-bold text-secondary-600 hover:underline">
                              {l.label} <Icon name="arrow-right" className="w-4 h-4" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
