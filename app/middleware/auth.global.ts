import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  
  if (import.meta.server) {
    // Fetch initial user state on SSR
    await auth.fetchProfile()
  }

  const isAdminRoute = to.path.startsWith('/admin')
  
  if (isAdminRoute && !auth.profile) {
    return navigateTo('/login')
  }

  if (to.path === '/login' && auth.profile) {
    return navigateTo('/admin')
  }
})
