import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, LegalSection } from '@/components/legal/LegalPage'
import { LEGAL, isLegalComplete } from '@/lib/legal'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Conditions générales de vente',
  description: `Conditions générales de vente de la boutique en ligne ${SITE.name} : prix, paiement, livraison, rétractation, garanties.`,
  alternates: { canonical: '/cgv' },
  robots: { index: isLegalComplete(), follow: true },
}

const link = 'font-semibold text-gray-900 underline underline-offset-4 hover:text-secondary-600'

// ⚠️ Drafted from how the site really works (live supplier prices, payment on
// Stripe's page, pickup / courier / parcel) and from the consumer rules that
// apply to any French online shop. It is not a lawyer's work: have it read by
// the business's legal adviser, in particular the guarantees article, for
// which the law prescribes an information box with a set wording
// (Code de la consommation, art. D211-2).
export default function Page() {
  const seller = LEGAL.companyName || SITE.name
  return (
    <LegalPage title="Conditions générales de vente" current="/cgv">
      <LegalSection title="1. Objet et champ d’application">
        <p>
          Les présentes conditions régissent les ventes de pièces et accessoires automobiles conclues sur le site www.espaceauto92.fr entre {seller}, {SITE.street},{' '}
          {SITE.postalCode} {SITE.city} (« le vendeur »), et toute personne passant commande sur le site (« le client »). Elles s’appliquent aux clients consommateurs ;
          les ventes aux professionnels font l’objet de conditions particulières.
        </p>
        <p>Toute commande implique l’acceptation des présentes conditions, dans leur version en vigueur le jour de la commande.</p>
      </LegalSection>

      <LegalSection title="2. Produits et compatibilité">
        <p>
          Les pièces sont présentées avec leur marque, leur référence et leurs caractéristiques. Le site n’affiche pour un véhicule que les pièces données comme
          compatibles par le catalogue du fabricant. Il appartient au client de saisir exactement son immatriculation ou de choisir le bon véhicule (marque, modèle,
          motorisation). En cas de doute, contactez-nous avant de commander : nous vérifions la référence avec vous.
        </p>
        <p>Une recherche par référence n’indique pas la compatibilité avec un véhicule : celle-ci doit alors être vérifiée par le client ou avec notre aide.</p>
      </LegalSection>

      <LegalSection title="3. Prix">
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises (TVA française au taux en vigueur), hors frais de livraison. Les prix et la disponibilité des pièces
          sont interrogés en temps réel auprès de nos fournisseurs : le prix applicable est celui affiché dans le panier au moment du paiement.
        </p>
        <p>
          Si un prix ou une disponibilité change entre l’ajout au panier et le paiement, le panier est mis à jour et le client valide le nouveau total avant de payer.
          Les frais de livraison, calculés selon le mode choisi et l’adresse, sont indiqués dans le panier avant le paiement.
        </p>
      </LegalSection>

      <LegalSection title="4. Commande">
        <p>
          Le client ajoute les pièces à son panier, choisit le mode de réception, indique ses coordonnées, vérifie le récapitulatif puis paie. La vente est conclue
          lorsque le paiement est confirmé. Une page de confirmation affiche alors le numéro de commande, à conserver.
        </p>
        <p>Le vendeur peut refuser une commande en cas de litige existant avec le client, de paiement non confirmé ou de demande manifestement anormale.</p>
      </LegalSection>

      <LegalSection title="5. Paiement">
        <p>
          Le paiement s’effectue par carte bancaire sur la page sécurisée de notre prestataire de paiement, Stripe. Le montant est débité à la commande. Aucune donnée
          de carte bancaire ne transite par notre site ni n’y est conservée.
        </p>
      </LegalSection>

      <LegalSection title="6. Disponibilité et délais">
        <p>
          La plupart des pièces sont approvisionnées auprès de nos fournisseurs après la commande. Les délais affichés sur le site (par exemple « Dispo en 4 h » ou
          « Dispo sous 24 h ») sont ceux annoncés par le fournisseur pour une arrivée au magasin ; ils sont donnés à titre indicatif.
        </p>
        <p>
          Si une pièce commandée se révèle indisponible, nous en informons le client dans les meilleurs délais et lui remboursons les sommes versées pour cette pièce. À
          défaut de délai indiqué, la remise ou la livraison intervient au plus tard trente jours après la commande.
        </p>
      </LegalSection>

      <LegalSection title="7. Retrait et livraison">
        <p>Selon les options proposées dans le panier :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            retrait au comptoir du magasin, {SITE.street}, {SITE.postalCode} {SITE.city}, aux heures d’ouverture, sur présentation du numéro de commande ;
          </li>
          <li>livraison par coursier en Île-de-France, à l’adresse indiquée par le client ;</li>
          <li>expédition par colis en France métropolitaine, en point relais ou à domicile.</li>
        </ul>
        <p>
          Le client vérifie l’état du colis et des pièces à la réception et nous signale sans attendre toute anomalie. Les risques sont transférés au client lorsqu’il
          prend possession des pièces. Le détail des modes de réception figure sur la page{' '}
          <Link href="/livraison-retrait" className={link}>Livraison &amp; retrait</Link>.
        </p>
      </LegalSection>

      <LegalSection title="8. Droit de rétractation">
        <p>
          Conformément aux articles L221-18 et suivants du Code de la consommation, le client consommateur dispose de quatorze jours à compter de la réception de sa
          commande, ou de son retrait en magasin, pour se rétracter sans avoir à donner de motif. Il nous en informe par une déclaration dénuée d’ambiguïté, par e-mail à{' '}
          <a href={`mailto:${SITE.email}`} className={link}>{SITE.email}</a> ou par courrier à l’adresse du magasin, par exemple au moyen du modèle ci-dessous.
        </p>
        <p>
          Les pièces sont à renvoyer ou à rapporter au magasin au plus tard quatorze jours après cette déclaration, complètes et dans leur emballage. Les frais de retour
          sont à la charge du client. La responsabilité du client peut être engagée si les pièces ont été dépréciées par des manipulations autres que celles nécessaires
          pour en vérifier la nature et les caractéristiques, notamment si elles ont été montées.
        </p>
        <p>
          Nous remboursons la totalité des sommes versées, frais de livraison standard compris, au plus tard quatorze jours après avoir été informés de la rétractation,
          par le moyen de paiement utilisé pour la commande. Ce remboursement peut être différé jusqu’à la récupération des pièces ou la preuve de leur expédition.
        </p>
        <p>Le droit de rétractation ne s’applique pas aux biens confectionnés selon les spécifications du client ou nettement personnalisés.</p>
        <p className="rounded-lg bg-gray-50 p-4 text-sm">
          <span className="font-semibold text-gray-900">Modèle de formulaire de rétractation</span>
          <br />À l’attention de {seller}, {SITE.street}, {SITE.postalCode} {SITE.city} — {SITE.email}
          <br />
          Je vous notifie par la présente ma rétractation du contrat portant sur la vente des pièces suivantes : …
          <br />
          Commande n° … reçue le … — Nom du client : … — Adresse : … — Date : … — Signature (en cas d’envoi sur papier)
        </p>
      </LegalSection>

      <LegalSection title="9. Pièces en échange standard et consigne">
        <p>
          Certaines pièces sont vendues en échange standard. Une consigne, indiquée dans le panier, s’ajoute alors au prix ; elle est remboursée au retour de l’ancienne
          pièce, complète et du même type, selon les conditions indiquées sur le site.
        </p>
      </LegalSection>

      <LegalSection title="10. Garanties légales">
        <p>
          Toutes les pièces vendues bénéficient de la garantie légale de conformité (articles L217-3 et suivants du Code de la consommation) et de la garantie des vices
          cachés (articles 1641 à 1649 du Code civil), indépendamment de toute garantie commerciale du fabricant.
        </p>
        <p>
          Au titre de la garantie légale de conformité, le client dispose de deux ans à compter de la délivrance de la pièce pour agir. Il peut demander sa réparation ou
          son remplacement et, si la mise en conformité est impossible ou n’intervient pas dans un délai de trente jours, une réduction du prix ou l’annulation de la
          vente. Pendant ces deux ans, il n’a pas à prouver que le défaut existait au moment de la délivrance.
        </p>
        <p>
          Au titre de la garantie des vices cachés, le client peut, dans les deux ans suivant la découverte du vice, rendre la pièce et se faire rembourser, ou la garder
          et obtenir une réduction du prix.
        </p>
        <p>
          Ces garanties ne couvrent pas l’usure normale, ni les dommages dus à un montage non conforme aux règles de l’art ou à un usage inapproprié. Pour toute demande,
          contactez le magasin avec votre numéro de commande.
        </p>
      </LegalSection>

      <LegalSection title="11. Montage et responsabilité">
        <p>
          Le montage des pièces, en particulier des organes de sécurité (freinage, direction, suspension), doit être réalisé dans les règles de l’art ; nous recommandons
          de le confier à un professionnel. Le vendeur ne peut être tenu responsable des conséquences d’un montage incorrect ou d’une pièce montée sur un véhicule pour
          lequel elle n’était pas donnée comme compatible.
        </p>
      </LegalSection>

      <LegalSection title="12. Données personnelles">
        <p>
          Les données recueillies lors de la commande sont traitées pour l’exécuter. Le détail figure dans notre{' '}
          <Link href="/confidentialite" className={link}>politique de confidentialité</Link>.
        </p>
      </LegalSection>

      <LegalSection title="13. Réclamations et médiation">
        <p>
          Toute réclamation peut être adressée au magasin par e-mail à <a href={`mailto:${SITE.email}`} className={link}>{SITE.email}</a>, par téléphone au{' '}
          <a href={`tel:${SITE.phone}`} className={link}>{SITE.phoneDisplay}</a> ou par courrier à l’adresse du magasin.
        </p>
        <p>
          Conformément à l’article L612-1 du Code de la consommation, le client consommateur peut recourir gratuitement à un médiateur de la consommation en vue de la
          résolution amiable d’un litige, après une réclamation écrite restée sans réponse satisfaisante.
          {LEGAL.mediator.name && (
            <>
              {' '}
              Médiateur compétent : {LEGAL.mediator.name}
              {LEGAL.mediator.url && (
                <>
                  {' '}
                  — <a href={LEGAL.mediator.url} target="_blank" rel="noopener noreferrer" className={link}>{LEGAL.mediator.url.replace(/^https?:\/\//, '')}</a>
                </>
              )}
              .
            </>
          )}
        </p>
      </LegalSection>

      <LegalSection title="14. Droit applicable">
        <p>
          Les présentes conditions sont soumises au droit français. À défaut de solution amiable, le litige est porté devant la juridiction compétente selon les règles
          de droit commun.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
