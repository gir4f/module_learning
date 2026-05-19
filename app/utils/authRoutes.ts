import type { Profile, UserRole } from '~/types/learning'

export function homeRouteForRole(role: UserRole) {
  return role === 'ADMIN' ? '/admin/modules' : '/'
}

export function homeRouteForProfile(profile: Pick<Profile, 'role'> | null | undefined) {
  return profile ? homeRouteForRole(profile.role) : '/login'
}

export function sanitizeRedirectPath(value: unknown) {
  const redirect = Array.isArray(value) ? value[0] : value
  if (typeof redirect !== 'string') return ''
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return ''
  return redirect
}

export function resolvePostLoginRedirect(profile: Pick<Profile, 'role'>, redirect: unknown) {
  const safeRedirect = sanitizeRedirectPath(redirect)
  if (!safeRedirect) return homeRouteForRole(profile.role)
  if (profile.role !== 'ADMIN' && safeRedirect.startsWith('/admin')) return homeRouteForRole(profile.role)
  return safeRedirect
}
