import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/login')
  }

  const profile = await auth.fetchProfile()
  if (profile?.role !== 'ADMIN') {
    return navigateTo('/login')
  }
})
