import 'server-only'

// ---------------------------------------------------------------------------
//  Small request limiter, kept in the memory of the server process.
//
//  It protects calls that cost money or are rationed (the plate lookup: one
//  credit each, 300 a day for the whole account) from one visitor, or one
//  script, asking again and again.
//
//  ⚠️ The counts live in one server instance. On Vercel several instances can
//  run side by side, each with its own counts, and an instance that is
//  recycled forgets them. So this stops a browser tab or a simple script, not
//  a determined flood from many addresses: that needs a shared store (Upstash
//  Redis, Vercel KV) behind this same function, or a rate-limit rule in the
//  host's firewall in front of the route.
// ---------------------------------------------------------------------------

export interface RateRule {
  limit: number
  windowMs: number
}

export type RateResult = { ok: true } | { ok: false; retryAfterSec: number }

/** Times of the accepted requests, per key. */
const hitsByKey = new Map<string, number[]>()
const MAX_KEYS = 5_000

/**
 * Counts one request for `key` unless a rule is already full.
 * A refused request is not counted, so waiting really does free a slot.
 */
export function takeHit(key: string, rules: readonly RateRule[], now = Date.now()): RateResult {
  const longest = Math.max(...rules.map((r) => r.windowMs))
  const hits = (hitsByKey.get(key) ?? []).filter((t) => now - t < longest)

  let retryAfterSec = 0
  for (const rule of rules) {
    const inWindow = hits.filter((t) => now - t < rule.windowMs)
    if (inWindow.length >= rule.limit) {
      // The slot frees when the oldest request of that window leaves it.
      retryAfterSec = Math.max(retryAfterSec, Math.ceil((inWindow[0] + rule.windowMs - now) / 1000))
    }
  }
  if (retryAfterSec > 0) {
    hitsByKey.set(key, hits)
    return { ok: false, retryAfterSec }
  }

  hits.push(now)
  hitsByKey.set(key, hits)
  if (hitsByKey.size > MAX_KEYS) forgetIdleKeys(now, longest)
  return { ok: true }
}

/** Keeps the map from growing without end when many different addresses come by. */
function forgetIdleKeys(now: number, maxAgeMs: number) {
  for (const [key, hits] of hitsByKey) {
    if (!hits.length || now - hits[hits.length - 1] >= maxAgeMs) hitsByKey.delete(key)
  }
}

/**
 * The visitor's network address as the host reports it. Vercel sets
 * `x-forwarded-for` itself, so a visitor cannot choose it. Requests without
 * one (local tools) all share the key "unknown".
 */
export function clientAddress(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || req.headers.get('x-real-ip')?.trim() || 'unknown'
}
