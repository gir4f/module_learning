import { describe, expect, it } from 'vitest'
import { normalizeStoredThemePreference, resolveThemePreference } from '../../app/utils/themePreference'

describe('theme preference resolution', () => {
  it('normalizes legacy dark values', () => {
    expect(normalizeStoredThemePreference('true')).toBe('dark')
    expect(normalizeStoredThemePreference('dark')).toBe('dark')
  })

  it('normalizes legacy light values', () => {
    expect(normalizeStoredThemePreference('false')).toBe('light')
    expect(normalizeStoredThemePreference('light')).toBe('light')
  })

  it('defaults to system preference for null or unknown values', () => {
    expect(normalizeStoredThemePreference(null)).toBe('system')
    expect(normalizeStoredThemePreference('weird')).toBe('system')
  })

  it('resolves explicit dark override', () => {
    expect(resolveThemePreference('dark', false)).toEqual({
      preference: 'dark',
      isDark: true,
      mode: 'dark',
    })
  })

  it('resolves explicit light override', () => {
    expect(resolveThemePreference('light', true)).toEqual({
      preference: 'light',
      isDark: false,
      mode: 'light',
    })
  })

  it('falls back to system preference when override is system', () => {
    expect(resolveThemePreference('system', true)).toEqual({
      preference: 'system',
      isDark: true,
      mode: 'dark',
    })
  })
})
