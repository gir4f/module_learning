import { describe, it, expect, beforeEach } from 'vitest'
import { checkRateLimit } from '../../server/utils/rateLimit'

describe('checkRateLimit', () => {
  // Note: the rate limiter uses an in-memory Map, so tests share state.
  // We use unique keys per test to avoid interference.

  it('allows requests within the limit', () => {
    const key = `test-allow-${Date.now()}`
    expect(checkRateLimit(key, { max: 3, windowMs: 10_000 })).toBe(true)
    expect(checkRateLimit(key, { max: 3, windowMs: 10_000 })).toBe(true)
    expect(checkRateLimit(key, { max: 3, windowMs: 10_000 })).toBe(true)
  })

  it('blocks requests exceeding the limit', () => {
    const key = `test-block-${Date.now()}`
    const opts = { max: 2, windowMs: 10_000 }
    expect(checkRateLimit(key, opts)).toBe(true)
    expect(checkRateLimit(key, opts)).toBe(true)
    expect(checkRateLimit(key, opts)).toBe(false)
    expect(checkRateLimit(key, opts)).toBe(false)
  })

  it('resets after the window expires', async () => {
    const key = `test-reset-${Date.now()}`
    const opts = { max: 1, windowMs: 50 }
    expect(checkRateLimit(key, opts)).toBe(true)
    expect(checkRateLimit(key, opts)).toBe(false)

    // Wait for the window to expire
    await new Promise((resolve) => setTimeout(resolve, 80))
    expect(checkRateLimit(key, opts)).toBe(true)
  })
})
