import {
  THEME_STORAGE_KEY,
  normalizeStoredThemePreference,
  resolveThemePreference,
  type ThemeMode,
  type ThemePreference,
} from '~/utils/themePreference'

let mediaQuery: MediaQueryList | null = null
let mediaQueryHandler: ((event: MediaQueryListEvent) => void) | null = null
let listenerAttached = false

export function useDarkMode() {
  const preference = useState<ThemePreference>('theme-preference', () => 'system')
  const resolvedMode = useState<ThemeMode>('theme-resolved', () => 'light')
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
    if (nextPreference === 'system') {
      // Remove both override classes — CSS @media handles it natively, no flash
      root.classList.remove('dark', 'light')
    } else if (nextPreference === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    root.dataset.themePreference = resolution.preference
    root.dataset.themeResolved = resolution.mode
  }

  function readStoredPreference() {
    if (!import.meta.client) return 'system' as ThemePreference
    return normalizeStoredThemePreference(localStorage.getItem(THEME_STORAGE_KEY))
  }

  function writeStoredPreference(nextPreference: ThemePreference) {
    if (!import.meta.client) return
    localStorage.setItem(THEME_STORAGE_KEY, nextPreference)
  }

  function syncFromStorage() {
    applyResolvedState(readStoredPreference())
  }

  function init() {
    if (!import.meta.client) return

    syncFromStorage()

    if (!listenerAttached) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQueryHandler = () => {
        // Only update Vue state — CSS already reacts natively.
        // We still need to keep resolvedMode in sync so the button icon is correct.
        if (preference.value !== 'system') return
        resolvedMode.value = systemPrefersDark() ? 'dark' : 'light'
      }
      mediaQuery.addEventListener('change', mediaQueryHandler)
      listenerAttached = true
    }
  }

  function toggle() {
    if (!import.meta.client) return
    // Cycle: if currently dark (either via class or OS) → force light
    //        if currently light → force dark
    const nextPreference: ThemePreference = resolvedMode.value === 'dark' ? 'light' : 'dark'
    writeStoredPreference(nextPreference)

    if (document.startViewTransition) {
      document.startViewTransition(() => applyResolvedState(nextPreference))
    } else {
      applyResolvedState(nextPreference)
    }
  }

  function resetToSystem() {
    if (!import.meta.client) return
    writeStoredPreference('system')
    applyResolvedState('system')
  }

  return { preference, resolvedMode, isDark, init, toggle, resetToSystem }
}
