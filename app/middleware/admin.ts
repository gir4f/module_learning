import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  const profile = await auth.fetchProfile()
  if (!profile || profile.role !== 'ADMIN') {
    return navigateTo('/login')
  }
})
