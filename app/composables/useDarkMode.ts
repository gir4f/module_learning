import {
  THEME_STORAGE_KEY,
  normalizeStoredThemePreference,
  resolveThemePreference,
  type ThemeMode,
  type ThemePreference,
} from '~/utils/themePreference'

let initialized = false
let mediaQuery: MediaQueryList | null = null
let mediaQueryHandler: ((event: MediaQueryListEvent) => void) | null = null

export function useDarkMode() {
  const preference = useState<ThemePreference>('theme-preference', () => 'system')
  const resolvedMode = useState<ThemeMode>('theme-resolved', () => 'light')
  const ready = useState('theme-ready', () => false)
  const isDark = computed(() => resolvedMode.value === 'dark')

  function systemPrefersDark() {
    if (!import.meta.client) return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  function applyResolvedState(nextPreference: ThemePreference) {
    const resolution = resolveThemePreference(nextPreference, systemPrefersDark())
    preference.value = resolution.preference
    resolvedMode.value = resolution.mode

    if (!import.meta.client) return

    const root = document.documentElement
    root.classList.toggle('dark', resolution.mode === 'dark')
    root.dataset.themePreference = resolution.preference
    root.dataset.themeResolved = resolution.mode
    ready.value = true
  }

  function readStoredPreference() {
    if (!import.meta.client) return 'system' as ThemePreference
    return normalizeStoredThemePreference(localStorage.getItem(THEME_STORAGE_KEY))
  }

  function writeStoredPreference(nextPreference: ThemePreference) {
    if (!import.meta.client) return
    localStorage.setItem(THEME_STORAGE_KEY, nextPreference)
  }

  function syncFromPreference(nextPreference = readStoredPreference()) {
    applyResolvedState(nextPreference)
  }

  function init() {
    if (!import.meta.client) return

    syncFromPreference()

    if (!initialized) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQueryHandler = () => {
        if (preference.value !== 'system') return
        applyResolvedState('system')
      }
      mediaQuery.addEventListener('change', mediaQueryHandler)
      initialized = true
    }

    ready.value = true
  }

  function toggle() {
    if (!import.meta.client) return

    const nextPreference: ThemePreference = resolvedMode.value === 'dark' ? 'light' : 'dark'
    writeStoredPreference(nextPreference)
    applyResolvedState(nextPreference)
  }

  function resetToSystem() {
    if (!import.meta.client) return
    writeStoredPreference('system')
    applyResolvedState('system')
  }

  return { preference, resolvedMode, isDark, ready, init, toggle, resetToSystem }
}
