import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, LegalSection } from '@/components/legal/LegalPage'
import { LEGAL, isLegalComplete } from '@/lib/legal'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: `Mentions légales du site ${SITE.name} : éditeur, hébergeur, propriété intellectuelle.`,
  alternates: { canonical: '/mentions-legales' },
  robots: { index: isLegalComplete(), follow: true },
}

export default function Page() {
  const identity = [LEGAL.companyName || SITE.name, LEGAL.legalForm, LEGAL.shareCapital && `au capital de ${LEGAL.shareCapital}`].filter(Boolean).join(', ')
  return (
    <LegalPage title="Mentions légales" current="/mentions-legales">
      <LegalSection title="Éditeur du site">
        <p>
          {identity}
          <br />
          {SITE.street}, {SITE.postalCode} {SITE.city}
          <br />
          Téléphone : <a href={`tel:${SITE.phone}`} className="font-semibold text-gray-900 underline underline-offset-4">{SITE.phoneDisplay}</a>
          <br />
          E-mail : <a href={`mailto:${SITE.email}`} className="font-semibold text-gray-900 underline underline-offset-4">{SITE.email}</a>
        </p>
        {(LEGAL.rcs || LEGAL.siret || LEGAL.vatNumber) && (
          <p>
            {LEGAL.rcs && <>{LEGAL.rcs}<br /></>}
            {LEGAL.siret && <>SIRET : {LEGAL.siret}<br /></>}
            {LEGAL.vatNumber && <>TVA intracommunautaire : {LEGAL.vatNumber}</>}
          </p>
        )}
        {LEGAL.publicationDirector && <p>Directeur de la publication : {LEGAL.publicationDirector}</p>}
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Le site est hébergé par {LEGAL.host.name}, {LEGAL.host.address} —{' '}
          <a href={LEGAL.host.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 underline underline-offset-4">{LEGAL.host.url.replace('https://', '')}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          Les textes, la mise en page et les éléments graphiques propres au site sont la propriété de {SITE.name}. Les marques, logos et photographies de pièces
          appartiennent à leurs fabricants respectifs et sont utilisés pour désigner les produits vendus. Toute reproduction du site, même partielle, est soumise à notre
          accord écrit.
        </p>
      </LegalSection>

      <LegalSection title="Données du catalogue">
        <p>
          Les informations de compatibilité entre pièces et véhicules proviennent du catalogue TecDoc et des données d’immatriculation fournies par nos partenaires. Elles
          sont données de bonne foi ; en cas de doute, contactez-nous avant de commander ou de monter une pièce.
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles">
        <p>
          Le traitement de vos données est décrit dans notre{' '}
          <Link href="/confidentialite" className="font-semibold text-gray-900 underline underline-offset-4">politique de confidentialité</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
