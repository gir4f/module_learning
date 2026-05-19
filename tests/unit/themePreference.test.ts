import { describe, expect, it } from 'vitest'
import { resolveThemePreference } from '../../app/utils/themePreference'

describe('theme preference resolution', () => {
  it('prefers the stored dark override', () => {
    expect(resolveThemePreference('true', false)).toEqual({
      isDark: true,
      mode: 'dark',
      source: 'user',
    })
  })

  it('prefers the stored light override', () => {
    expect(resolveThemePreference('false', true)).toEqual({
      isDark: false,
      mode: 'light',
      source: 'user',
    })
  })

  it('falls back to system preference when there is no stored override', () => {
    expect(resolveThemePreference(null, true)).toEqual({
      isDark: true,
      mode: 'dark',
      source: 'system',
    })
  })
})
