import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  // Only fetch profile from the server if we haven't loaded it yet.
  // This avoids a network request on every admin page navigation.
  if (!auth.profile) {
    const profile = await auth.fetchProfile()
    if (!profile || profile.role !== 'ADMIN') {
      return navigateTo('/login')
    }
    return
  }

  if (auth.profile.role !== 'ADMIN') {
    return navigateTo('/login')
  }
})
