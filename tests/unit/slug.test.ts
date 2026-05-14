import { describe, expect, it } from 'vitest'
import { makeSlug, normalizeSearchText } from '../../app/utils/slug'

describe('slug utilities', () => {
  it('normalizes search text', () => {
    expect(normalizeSearchText('  Device   Speed  ')).toBe('device speed')
  })

  it('builds URL-safe slugs from product names', () => {
    expect(makeSlug('Idletimer / Turbotimer GT-IIS06A')).toBe('idletimer-turbotimer-gt-iis06a')
  })
})
