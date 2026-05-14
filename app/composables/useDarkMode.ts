export function useDarkMode() {
  const isDark = useState('dark-mode', () => false)

  function apply(value = isDark.value) {
    if (!import.meta.client) return
    document.documentElement.classList.toggle('dark', value)
  }

  function init() {
    if (!import.meta.client) return
    const stored = localStorage.getItem('dark-mode')
    if (stored !== null) {
      // User pernah pilih manual → pakai pilihannya
      isDark.value = stored === 'true'
    } else {
      // Belum pernah pilih → ikut OS
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    apply()

    // Listen perubahan OS preference (kalau user belum pernah pilih manual)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem('dark-mode') === null) {
        isDark.value = e.matches
        apply()
      }
    })
  }

  function toggle() {
    isDark.value = !isDark.value
    if (import.meta.client) {
      localStorage.setItem('dark-mode', String(isDark.value))
      apply()
    }
  }

  function resetToSystem() {
    if (!import.meta.client) return
    localStorage.removeItem('dark-mode')
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    apply()
  }

  return { isDark, init, toggle, resetToSystem }
}
