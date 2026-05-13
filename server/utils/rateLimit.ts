/**
 * Simple in-memory rate limiter for server routes.
 *
 * Not suitable for horizontally-scaled deployments — use Redis
 * or a dedicated rate-limit service if you add multiple instances.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

/** Remove expired entries periodically to avoid memory leaks. */
const CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}

export interface RateLimitOptions {
  /** Maximum number of requests allowed in the window. */
  max: number
  /** Window duration in milliseconds. */
  windowMs: number
}

/**
 * Check if a given key is rate-limited.
 * Returns `true` if the request is allowed, `false` if it should be blocked.
 */
export function checkRateLimit(key: string, options: RateLimitOptions): boolean {
  cleanup()
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + options.windowMs })
    return true
  }

  entry.count++
  return entry.count <= options.max
}
