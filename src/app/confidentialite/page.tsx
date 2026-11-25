import type { Metadata } from 'next'
import { LegalPage, LegalSection } from '@/components/legal/LegalPage'
import { LEGAL, isLegalComplete } from '@/lib/legal'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: `Comment ${SITE.name} traite vos données personnelles : commande, paiement, recherche par plaque, vos droits.`,
  alternates: { canonical: '/confidentialite' },
  robots: { index: isLegalComplete(), follow: true },
}

const link = 'font-semibold text-gray-900 underline underline-offset-4 hover:text-secondary-600'

// ⚠️ Describes what the site does today (see the code: /api/vehicle/identify,
// /api/checkout, ShopProvider, the contact form). Update it whenever a feature
// starts collecting something new, and have it reviewed with the legal texts.
export default function Page() {
  const controller = LEGAL.companyName || SITE.name
  return (
    <LegalPage title="Politique de confidentialité" current="/confidentialite">
      <LegalSection title="Responsable du traitement">
        <p>
          {controller}, {SITE.street}, {SITE.postalCode} {SITE.city}. Pour toute question sur vos données :{' '}
          <a href={`mailto:${SITE.email}`} className={link}>{SITE.email}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Les données que nous traitons, et pourquoi">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-semibold text-gray-900">Recherche par plaque.</span> L’immatriculation que vous saisissez est transmise à notre fournisseur de données
            d’immatriculation pour identifier votre véhicule (marque, modèle, motorisation, date de première mise en circulation, numéro de série). Elle sert uniquement à
            afficher les pièces compatibles.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Panier et véhicule.</span> Votre panier et le véhicule sélectionné sont enregistrés dans votre navigateur
            (stockage local), sur votre appareil. Ils ne nous sont pas transmis tant que vous ne commandez pas.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Commande.</span> Nom, numéro de mobile, mode de réception et, pour une livraison, adresse : ces données sont
            nécessaires pour préparer la commande, vous la remettre et vous contacter à son sujet.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Paiement.</span> Le paiement est effectué sur la page de notre prestataire Stripe, qui recueille votre adresse
            e-mail et vos données de carte. Nous ne recevons jamais vos données de carte ; nous recevons la confirmation du paiement et votre adresse e-mail.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Formulaire de contact et messages.</span> Les informations que vous nous envoyez par le formulaire, par e-mail,
            par téléphone ou sur WhatsApp servent à vous répondre.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Mesure d’audience.</span> Nous mesurons la fréquentation du site de façon agrégée, sans cookie publicitaire.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Bases légales">
        <p>
          L’exécution de votre commande (contrat) pour les données de commande et de paiement ; notre intérêt légitime à vous montrer les bonnes pièces et à améliorer le
          site pour la recherche par plaque et la mesure d’audience ; nos obligations légales pour la conservation des pièces comptables ; votre accord lorsque vous
          choisissez d’être contacté sur WhatsApp.
        </p>
      </LegalSection>

      <LegalSection title="Destinataires">
        <p>
          Vos données sont destinées au magasin. Elles sont transmises, dans la limite de ce qui est nécessaire, à nos prestataires : Stripe (paiement), notre fournisseur
          de données d’immatriculation et de catalogue (identification du véhicule), notre plateforme d’expédition (recherche des points relais proches de votre adresse),
          le transporteur ou le coursier pour une livraison, et notre hébergeur ({LEGAL.host.name}).
          Certains de ces prestataires sont établis hors de l’Union européenne ; les transferts sont alors encadrés par les garanties prévues par la réglementation.
        </p>
        <p>Nous ne vendons ni ne louons vos données.</p>
      </LegalSection>

      <LegalSection title="Durées de conservation">
        <p>
          Les données de commande sont conservées pendant la durée nécessaire à son exécution et au service après-vente, puis archivées le temps imposé par les obligations
          comptables et fiscales (dix ans pour les pièces comptables). Les messages sont conservés le temps de leur traitement. Le panier reste dans votre navigateur
          jusqu’à ce que vous le vidiez.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Vous pouvez accéder à vos données, les faire rectifier ou effacer, en demander la limitation ou la portabilité, et vous opposer à leur traitement, en écrivant à{' '}
          <a href={`mailto:${SITE.email}`} className={link}>{SITE.email}</a> ou au magasin. Si vous estimez, après nous avoir contactés, que vos droits ne sont pas
          respectés, vous pouvez adresser une réclamation à la CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className={link}>cnil.fr</a>).
        </p>
      </LegalSection>
    </LegalPage>
  )
}
