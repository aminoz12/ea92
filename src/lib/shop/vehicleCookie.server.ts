import 'server-only'
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

// ---------------------------------------------------------------------------
//  The visitor's exact vehicle, for the pages rendered on the server.
//
//  The catalogue pages know the vehicle TYPE from their address (/pieces/<type>);
//  to show only the parts of the customer's exact car they also need its VIN,
//  which the plate lookup gives. The VIN is kept in a cookie the browser cannot
//  read (httpOnly) and cannot forge (encrypted and authenticated with the
//  server's key), tied to the vehicle type it was found for.
// ---------------------------------------------------------------------------

export const VEHICLE_COOKIE = 'ea92_vehicle'
export const VEHICLE_COOKIE_MAX_AGE = 90 * 24 * 3600

function key(): Buffer {
  const secret = process.env.ARTICLE_TOKEN_SECRET || process.env.AUTOPRECISION_CATALOG_KEY || process.env.AUTOPRECISION_EASYORDER_TOKEN
  if (!secret) throw new Error('No secret available to protect the vehicle cookie (ARTICLE_TOKEN_SECRET)')
  return createHash('sha256').update(`ea92-vehicle-cookie:${secret}`).digest()
}

export interface VehicleIdentity {
  /** TecDoc vehicle type (KTYP). */
  ktype: number
  vin: string
}

export function sealVehicle(v: VehicleIdentity): string {
  const nonce = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(), nonce)
  const body = Buffer.concat([cipher.update(JSON.stringify({ k: v.ktype, v: v.vin }), 'utf8'), cipher.final()])
  return Buffer.concat([nonce, body, cipher.getAuthTag()]).toString('base64url')
}

export function openVehicle(sealed: string | undefined): VehicleIdentity | null {
  if (!sealed || sealed.length > 300 || !/^[A-Za-z0-9_-]+$/.test(sealed)) return null
  try {
    const raw = Buffer.from(sealed, 'base64url')
    if (raw.length <= 28) return null
    const decipher = createDecipheriv('aes-256-gcm', key(), raw.subarray(0, 12))
    decipher.setAuthTag(raw.subarray(raw.length - 16))
    const plain = Buffer.concat([decipher.update(raw.subarray(12, raw.length - 16)), decipher.final()]).toString('utf8')
    const j = JSON.parse(plain) as { k?: unknown; v?: unknown }
    return typeof j.k === 'number' && Number.isInteger(j.k) && typeof j.v === 'string' && j.v ? { ktype: j.k, vin: j.v } : null
  } catch {
    return null
  }
}

/** Cookie options: sent back on every page of the site, invisible to scripts. */
export const vehicleCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: VEHICLE_COOKIE_MAX_AGE,
})
