import { useAuthStore } from '~/stores/auth'
import { homeRouteForProfile } from '~/utils/authRoutes'

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  const profile = await auth.ensureProfile()

  if (!profile || profile.role !== 'ADMIN') {
    return navigateTo(homeRouteForProfile(profile))
  }
})
