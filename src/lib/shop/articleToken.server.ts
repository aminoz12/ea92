import 'server-only'
import { createCipheriv, createDecipheriv, createHash, createHmac } from 'node:crypto'

// ---------------------------------------------------------------------------
//  Opaque article identifiers.
//
//  The owner's rule: a customer must never learn a part's reference from the
//  site. People used it to find the right part here, then bought it cheaper
//  elsewhere. So the reference (and the brand code that goes with it) never
//  reaches the browser: not in the page, not in its data, not in the calls it
//  makes, not in the cart, not on the payment page.
//
//  What the browser gets instead is this token: the pair "brand code |
//  reference", encrypted with a key only the server has. The server reads it
//  back when it needs the reference (to ask the suppliers, to prepare the
//  order). The same article always gives the same token, so it can be used as
//  a stable id in lists and in the cart.
//
//  The key comes from ARTICLE_TOKEN_SECRET when set, otherwise it is derived
//  from the catalogue key, so nothing extra has to be configured. Changing
//  either only makes carts already in customers' browsers unreadable (their
//  lines are dropped at the next price check).
// ---------------------------------------------------------------------------

/** Two independent keys from the one secret: one to encrypt, one to derive the nonce. */
function keys(): { enc: Buffer; nonce: Buffer } {
  const secret = process.env.ARTICLE_TOKEN_SECRET || process.env.AUTOPRECISION_CATALOG_KEY || process.env.AUTOPRECISION_EASYORDER_TOKEN
  if (!secret) throw new Error('No secret available to protect article references (ARTICLE_TOKEN_SECRET)')
  const derive = (use: string) => createHash('sha256').update(`ea92-article-token:${use}:${secret}`).digest()
  return { enc: derive('enc'), nonce: derive('nonce') }
}

const NONCE = 12
const TAG = 16

/**
 * What the server needs to know about an article later, without asking the
 * catalogue again: its shipping weight and its part type (a battery may not
 * travel as a parcel). Sealed in the token, so the browser can neither read
 * nor change them.
 */
export interface ArticleFacts {
  /** Shipping weight of one article, kg. */
  weightKg?: number
  /** TecDoc part type. */
  partType?: number
}

/** The opaque id of an article, safe to send to the browser. */
export function articleToken(dlNr: number, artNr: string, facts: ArticleFacts = {}): string {
  const k = keys()
  // "v2|brand code|grams|part type|reference" (the reference last: it may contain "|").
  // Tokens made before had "brand code|reference" only; readArticleToken reads both.
  const grams = facts.weightKg !== undefined ? Math.max(1, Math.round(facts.weightKg * 1000)) : ''
  const plain = Buffer.from(facts.weightKg !== undefined || facts.partType !== undefined ? `v2|${dlNr}|${grams}|${facts.partType ?? ''}|${artNr}` : `${dlNr}|${artNr}`, 'utf8')
  // Derived from the content instead of random: same article, same token. Two
  // different articles get different nonces, which is all AES-GCM needs.
  const nonce = createHmac('sha256', k.nonce).update(plain).digest().subarray(0, NONCE)
  const cipher = createCipheriv('aes-256-gcm', k.enc, nonce)
  const body = Buffer.concat([cipher.update(plain), cipher.final()])
  return Buffer.concat([nonce, body, cipher.getAuthTag()]).toString('base64url')
}

/** The article behind a token, or null when the token is not one of ours (forged, cut, made with another key). */
export function readArticleToken(token: string): ({ dlNr: number; artNr: string } & ArticleFacts) | null {
  if (typeof token !== 'string' || token.length < 40 || token.length > 200 || !/^[A-Za-z0-9_-]+$/.test(token)) return null
  try {
    const raw = Buffer.from(token, 'base64url')
    if (raw.length <= NONCE + TAG) return null
    const decipher = createDecipheriv('aes-256-gcm', keys().enc, raw.subarray(0, NONCE))
    decipher.setAuthTag(raw.subarray(raw.length - TAG))
    const plain = Buffer.concat([decipher.update(raw.subarray(NONCE, raw.length - TAG)), decipher.final()]).toString('utf8')
    const v2 = plain.match(/^v2\|(\d+)\|(\d*)\|(\d*)\|(.+)$/s)
    if (v2) {
      const dlNr = Number(v2[1])
      if (!Number.isInteger(dlNr) || dlNr <= 0) return null
      return { dlNr, artNr: v2[4], weightKg: v2[2] ? Number(v2[2]) / 1000 : undefined, partType: v2[3] ? Number(v2[3]) : undefined }
    }
    const at = plain.indexOf('|')
    const dlNr = Number(plain.slice(0, at))
    const artNr = plain.slice(at + 1)
    return at > 0 && Number.isInteger(dlNr) && dlNr > 0 && artNr ? { dlNr, artNr } : null
  } catch {
    return null // authentication failed: not a token made with our key
  }
}
