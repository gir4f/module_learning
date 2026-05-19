import { defineStore } from 'pinia'
import axios from 'axios'
import type { Profile } from '~/types/learning'
import { apiErrorMessage } from '~/utils/apiErrors'
import { shouldRefreshAuthState } from '~/utils/authRefresh'

export const useAuthStore = defineStore('auth', () => {
  const profile = ref<Profile | null>(null)
  const pending = ref(false)
  const error = ref('')
  const initialized = ref(false)
  const lastFetchedAt = ref(0)
  const lastResolvedAuthState = ref<'unknown' | 'authenticated' | 'anonymous'>('unknown')
  let fetchInFlight: Promise<Profile | null> | null = null

  const isAdmin = computed(() => profile.value?.role === 'ADMIN')
  const isAuthenticated = computed(() => Boolean(profile.value))

  async function fetchProfile(options: { force?: boolean } = {}) {
    if (fetchInFlight && !options.force) return fetchInFlight

    pending.value = true
    error.value = ''

    fetchInFlight = (async () => {
      try {
        const api = useApiClient()
        const { data } = await api.get<{ profile: Profile | null }>('/api/auth/me')
        profile.value = data.profile
        lastResolvedAuthState.value = data.profile ? 'authenticated' : 'anonymous'
        return data.profile
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          profile.value = null
          lastResolvedAuthState.value = 'anonymous'
        } else if (!profile.value) {
          profile.value = null
        }
        return profile.value
      } finally {
        initialized.value = true
        pending.value = false
        lastFetchedAt.value = Date.now()
        fetchInFlight = null
      }
    })()

    return fetchInFlight
  }

  async function ensureProfile(options: { force?: boolean } = {}) {
    if (profile.value && !options.force) {
      initialized.value = true
      return profile.value
    }

    if (initialized.value && !options.force) return profile.value

    return fetchProfile(options)
  }

  async function login(email: string, password: string) {
    pending.value = true
    error.value = ''
    try {
      const api = useApiClient()
      const { data } = await api.post<{ profile: Profile }>('/api/auth/login', { email, password })
      profile.value = data.profile
      initialized.value = true
      lastFetchedAt.value = Date.now()
      lastResolvedAuthState.value = 'authenticated'
      return data.profile
    } catch (err: any) {
      error.value = apiErrorMessage(err, 'Login failed.')
      throw err
    } finally {
      pending.value = false
    }
  }

  async function logout() {
    pending.value = true
    const api = useApiClient()
    try {
      await api.post('/api/auth/logout')
    } finally {
      profile.value = null
      initialized.value = true
      pending.value = false
      lastFetchedAt.value = Date.now()
      lastResolvedAuthState.value = 'anonymous'
    }
  }

  async function refreshProfileIfStale(maxAgeMs = 45_000) {
    if (fetchInFlight) return fetchInFlight
    if (!shouldRefreshAuthState({
      initialized: initialized.value,
      lastFetchedAt: lastFetchedAt.value,
      maxAgeMs,
    })) {
      return profile.value
    }
    return fetchProfile()
  }

  return {
    profile,
    pending,
    error,
    initialized,
    lastFetchedAt,
    lastResolvedAuthState,
    isAdmin,
    isAuthenticated,
    fetchProfile,
    ensureProfile,
    refreshProfileIfStale,
    login,
    logout,
  }
})
