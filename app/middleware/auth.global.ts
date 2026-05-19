import { useAuthStore } from '~/stores/auth'
import { resolvePostLoginRedirect, sanitizeRedirectPath } from '~/utils/authRoutes'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  const isLoginRoute = to.path === '/login'
  const isProtectedRoute = !isLoginRoute
  const safeLoginRedirect = sanitizeRedirectPath(to.query.redirect)

  if (isLoginRoute && hasUnsafeLoginQuery(to.query)) {
    return navigateTo({
      path: '/login',
      query: safeLoginRedirect ? { redirect: safeLoginRedirect } : {},
    }, { replace: true })
  }

  if (!auth.initialized) {
    await auth.ensureProfile()
  }

  if (isProtectedRoute && !auth.profile) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  if (isLoginRoute && auth.profile) {
    return navigateTo(resolvePostLoginRedirect(auth.profile, safeLoginRedirect))
  }
})

function hasUnsafeLoginQuery(query: Record<string, unknown>) {
  return Object.keys(query).some(key => key !== 'redirect')
}
