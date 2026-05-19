import { describe, expect, it } from 'vitest'
import { shouldRefreshAuthState } from '../../app/utils/authRefresh'

describe('auth refresh policy', () => {
  it('refreshes when auth has not been initialized yet', () => {
    expect(shouldRefreshAuthState({
      initialized: false,
      lastFetchedAt: 0,
      maxAgeMs: 45_000,
      now: 100_000,
    })).toBe(true)
  })

  it('does not refresh while auth state is still fresh', () => {
    expect(shouldRefreshAuthState({
      initialized: true,
      lastFetchedAt: 100_000,
      maxAgeMs: 45_000,
      now: 120_000,
    })).toBe(false)
  })

  it('refreshes once auth state is stale', () => {
    expect(shouldRefreshAuthState({
      initialized: true,
      lastFetchedAt: 100_000,
      maxAgeMs: 45_000,
      now: 160_001,
    })).toBe(true)
  })
})
