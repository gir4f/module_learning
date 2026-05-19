export type ThemeMode = 'light' | 'dark'
export type ThemeSource = 'system' | 'user'

export function resolveThemePreference(storedValue: string | null, prefersDark: boolean) {
  if (storedValue === 'true') {
    return { isDark: true, mode: 'dark' as ThemeMode, source: 'user' as ThemeSource }
  }

  if (storedValue === 'false') {
    return { isDark: false, mode: 'light' as ThemeMode, source: 'user' as ThemeSource }
  }

  return {
    isDark: prefersDark,
    mode: prefersDark ? 'dark' as ThemeMode : 'light' as ThemeMode,
    source: 'system' as ThemeSource,
  }
}
