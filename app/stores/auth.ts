import { defineStore } from 'pinia'
import type { Profile } from '~/types/learning'

export const useAuthStore = defineStore('auth', () => {
  const profile = ref<Profile | null>(null)
  const pending = ref(false)
  const error = ref('')

  const isAdmin = computed(() => profile.value?.role === 'ADMIN')

  async function fetchProfile() {
    pending.value = true
    error.value = ''
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
      const response = await $fetch<{ profile: Profile | null }>('/api/auth/me', { headers })
      profile.value = response.profile
      return response.profile
    } catch {
      profile.value = null
      return null
    } finally {
      pending.value = false
    }
  }

  async function login(email: string, password: string) {
    pending.value = true
    error.value = ''
    try {
      const response = await $fetch<{ profile: Profile }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      profile.value = response.profile
      return response.profile
    } catch (err: any) {
      error.value = err?.data?.statusMessage || err?.message || 'Login failed.'
      throw err
    } finally {
      pending.value = false
    }
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    profile.value = null
  }

  return { profile, pending, error, isAdmin, fetchProfile, login, logout }
})
