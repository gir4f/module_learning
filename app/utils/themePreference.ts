export type ThemeMode = 'light' | 'dark'
export type ThemePreference = 'system' | 'light' | 'dark'

export const THEME_STORAGE_KEY = 'dark-mode'

export function normalizeStoredThemePreference(storedValue: string | null): ThemePreference {
  if (storedValue === 'dark' || storedValue === 'true') return 'dark'
  if (storedValue === 'light' || storedValue === 'false') return 'light'
  return 'system'
}

export function resolveThemePreference(preference: ThemePreference, prefersDark: boolean) {
  if (preference === 'dark') {
    return {
      preference: 'dark' as ThemePreference,
      mode: 'dark' as ThemeMode,
      isDark: true,
    }
  }

  if (preference === 'light') {
    return {
      preference: 'light' as ThemePreference,
      mode: 'light' as ThemeMode,
      isDark: false,
    }
  }

  return {
    preference: 'system' as ThemePreference,
    mode: prefersDark ? 'dark' as ThemeMode : 'light' as ThemeMode,
    isDark: prefersDark,
  }
}
