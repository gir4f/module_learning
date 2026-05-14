import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  const isAdminRoute = to.path.startsWith('/admin')
  const isLoginRoute = to.path === '/login'

  if (!auth.initialized) {
    await auth.ensureProfile()
  }

  if (isAdminRoute && !auth.profile) {
    return navigateTo('/login')
  }

  if (isLoginRoute && auth.profile) {
    return navigateTo('/admin')
  }
})
