import { resolveThemePreference, type ThemeMode, type ThemeSource } from '~/utils/themePreference'

let initialized = false
let mediaQuery: MediaQueryList | null = null
let mediaQueryHandler: ((event: MediaQueryListEvent) => void) | null = null

export function useDarkMode() {
  const isDark = useState('dark-mode', () => import.meta.client
    ? document.documentElement.classList.contains('dark')
    : false)
  const mode = useState<ThemeMode>('dark-mode-mode', () => isDark.value ? 'dark' : 'light')
  const source = useState<ThemeSource>('dark-mode-source', () => 'system')
  const ready = useState('dark-mode-ready', () => false)

  function apply(value = isDark.value) {
    if (!import.meta.client) return
    document.documentElement.classList.toggle('dark', value)
    mode.value = value ? 'dark' : 'light'
  }

  function readStoredPreference() {
    if (!import.meta.client) return null
    return localStorage.getItem('dark-mode')
  }

  function systemPreference() {
    if (!import.meta.client) return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  function syncFromPreference() {
    const preference = resolveThemePreference(readStoredPreference(), systemPreference())
    source.value = preference.source
    isDark.value = preference.isDark
    apply(preference.isDark)
  }

  function init() {
    if (!import.meta.client) return

    if (initialized) {
      syncFromPreference()
      ready.value = true
      return
    }

    syncFromPreference()

    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQueryHandler = (event: MediaQueryListEvent) => {
      if (source.value !== 'system') return
      isDark.value = event.matches
      apply()
    }
    mediaQuery.addEventListener('change', mediaQueryHandler)

    initialized = true
    ready.value = true
  }

  function toggle() {
    isDark.value = !isDark.value
    if (!import.meta.client) return

    source.value = 'user'
    localStorage.setItem('dark-mode', String(isDark.value))
    apply()
  }

  function resetToSystem() {
    if (!import.meta.client) return
    localStorage.removeItem('dark-mode')
    source.value = 'system'
    isDark.value = systemPreference()
    apply()
  }

  return { isDark, mode, source, ready, init, toggle, resetToSystem }
}
