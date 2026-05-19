const AUTH_RESUME_STALE_MS = 45_000

export default defineNuxtPlugin(() => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    void auth.ensureProfile()
  }

  const refreshAuthState = () => {
    if (document.visibilityState && document.visibilityState !== 'visible') return
    void auth.refreshProfileIfStale(AUTH_RESUME_STALE_MS)
  }

  window.addEventListener('focus', refreshAuthState)
  document.addEventListener('visibilitychange', refreshAuthState)
})
