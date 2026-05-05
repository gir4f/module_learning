import { defineStore } from 'pinia'
import type { Profile } from '~/types/learning'

export const useAuthStore = defineStore('auth', () => {
  const profile = ref<Profile | null>(null)
  const pending = ref(false)
  const error = ref('')

  const email = computed(() => profile.value?.email || '')
  const role = computed(() => profile.value?.role || 'VIEWER')
  const isAdmin = computed(() => role.value === 'ADMIN')

  async function fetchProfile() {
    pending.value = true
    error.value = ''
    try {
      const response = await $fetch<{ profile: Profile | null }>('/api/auth/me')
      profile.value = response.profile
      return response.profile
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load profile.'
      profile.value = null
      return null
    } finally {
      pending.value = false
    }
  }

  function setProfile(nextProfile: Profile | null) {
    profile.value = nextProfile
  }

  function logout() {
    profile.value = null
  }

  return {
    profile,
    pending,
    error,
    email,
    role,
    isAdmin,
    fetchProfile,
    setProfile,
    logout,
  }
})
