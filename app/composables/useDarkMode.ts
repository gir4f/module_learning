export function useDarkMode() {
  const isDark = useState('dark-mode', () => false)

  function apply(value = isDark.value) {
    if (!import.meta.client) return
    document.documentElement.classList.toggle('dark', value)
  }

  function init() {
    if (!import.meta.client) return
    const stored = localStorage.getItem('dark-mode')
    isDark.value = stored ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches
    apply()
  }

  function toggle() {
    isDark.value = !isDark.value
    if (import.meta.client) {
      localStorage.setItem('dark-mode', String(isDark.value))
      apply()
    }
  }

  return { isDark, init, toggle }
}
