export function shouldRefreshAuthState(options: {
  initialized: boolean
  lastFetchedAt: number
  maxAgeMs: number
  now?: number
}) {
  const { initialized, lastFetchedAt, maxAgeMs, now = Date.now() } = options

  if (!initialized) return true
  return now - lastFetchedAt > maxAgeMs
}
