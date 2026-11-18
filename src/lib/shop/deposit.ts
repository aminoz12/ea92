// "Consigne" on exchange parts: how the customer gets the deposit back,
// depending on how the new part was received.
import { DEPOSIT } from './config'
import type { FulfilmentMode } from './types'

export const DEPOSIT_RETURN: Record<FulfilmentMode, string> = {
  retrait: 'Rapportez l’ancienne pièce au comptoir : la consigne vous est rendue sur place après contrôle.',
  coursier: `Déposez l’ancienne pièce au magasin dans les ${DEPOSIT.returnDays} jours : remboursement sous ${DEPOSIT.refundDays} jours.`,
  colis: `Renvoyez l’ancienne pièce avec l’étiquette retour glissée dans le colis, dans les ${DEPOSIT.returnDays} jours : remboursement sous ${DEPOSIT.refundDays} jours.`,
  montage: 'Rien à faire : le garage partenaire nous rapporte l’ancienne pièce et la consigne vous est remboursée automatiquement.',
}
