import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  const isAdminRoute = to.path.startsWith('/admin')
  const isLoginRoute = to.path === '/login'
  const safeLoginRedirect = sanitizeRedirect(to.query.redirect)

  if (isLoginRoute && hasUnsafeLoginQuery(to.query)) {
    return navigateTo({
      path: '/login',
      query: safeLoginRedirect ? { redirect: safeLoginRedirect } : {},
    }, { replace: true })
  }

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

function hasUnsafeLoginQuery(query: Record<string, unknown>) {
  return Object.keys(query).some(key => key !== 'redirect')
}

function sanitizeRedirect(value: unknown) {
  const redirect = Array.isArray(value) ? value[0] : value
  if (typeof redirect !== 'string') return ''
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return ''
  return redirect
}
