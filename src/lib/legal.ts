// ---------------------------------------------------------------------------
//  Legal identity of the business, shown on /mentions-legales, /cgv and
//  /confidentialite.
//
//  ⚠️ TO COMPLETE BY THE OWNER before the shop takes orders from the public.
//  An empty value is simply not printed, so the pages read fine while they are
//  incomplete — but a French online shop must show all of them (Code de la
//  consommation, art. L111-1 and L221-5; loi du 21 juin 2004, art. 6 and 19).
//  The three pages stay out of search engines until `isLegalComplete()`.
// ---------------------------------------------------------------------------

interface LegalIdentity {
  companyName: string
  legalForm: string
  shareCapital: string
  rcs: string
  siret: string
  vatNumber: string
  publicationDirector: string
  mediator: { name: string; url: string }
  host: { name: string; address: string; url: string }
  updated: string
}

export const LEGAL: LegalIdentity = {
  /** Exact registered name, e.g. "ESPACE AUTO 92". */
  companyName: '',
  /** Legal form, e.g. "SAS", "SARL", "EURL". */
  legalForm: '',
  /** Share capital with its currency, e.g. "10 000 €". */
  shareCapital: '',
  /** Registration, e.g. "RCS Nanterre 123 456 789". */
  rcs: '',
  /** 14 digits. */
  siret: '',
  /** Intra-community VAT number, e.g. "FR 12 123456789". */
  vatNumber: '',
  /** Name of the person legally responsible for what the site publishes (usually the manager). */
  publicationDirector: '',
  /**
   * Consumer mediator the business has joined (mandatory, art. L612-1 Code de
   * la consommation): its name and the address where a customer files a claim.
   */
  mediator: { name: '', url: '' },
  /** The company that hosts the site. */
  host: { name: 'Vercel Inc.', address: '440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis', url: 'https://vercel.com' },
  /** Date of the last change to the legal texts, as shown on the pages. */
  updated: '25 novembre 2026',
}

export const isLegalComplete = () =>
  Boolean(
    LEGAL.companyName &&
      LEGAL.legalForm &&
      LEGAL.shareCapital &&
      LEGAL.rcs &&
      LEGAL.siret &&
      LEGAL.vatNumber &&
      LEGAL.publicationDirector &&
      LEGAL.mediator.name &&
      LEGAL.mediator.url,
  )
