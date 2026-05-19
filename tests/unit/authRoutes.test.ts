import { describe, expect, it } from 'vitest'
import { homeRouteForProfile, homeRouteForRole, resolvePostLoginRedirect, sanitizeRedirectPath } from '../../app/utils/authRoutes'

describe('auth route helpers', () => {
  it('maps roles to their home routes', () => {
    expect(homeRouteForRole('ADMIN')).toBe('/admin/modules')
    expect(homeRouteForRole('VIEWER')).toBe('/')
  })

  it('maps profiles to their home routes', () => {
    expect(homeRouteForProfile({ role: 'ADMIN' })).toBe('/admin/modules')
    expect(homeRouteForProfile({ role: 'VIEWER' })).toBe('/')
    expect(homeRouteForProfile(null)).toBe('/login')
  })

  it('sanitizes unsafe redirect values', () => {
    expect(sanitizeRedirectPath('/modules/imu')).toBe('/modules/imu')
    expect(sanitizeRedirectPath('//evil.test')).toBe('')
    expect(sanitizeRedirectPath('https://evil.test')).toBe('')
    expect(sanitizeRedirectPath(undefined)).toBe('')
  })

  it('keeps safe redirects for admins', () => {
    expect(resolvePostLoginRedirect({ role: 'ADMIN' }, '/admin/modules')).toBe('/admin/modules')
  })

  it('falls back to learner home when viewer is redirected to admin', () => {
    expect(resolvePostLoginRedirect({ role: 'VIEWER' }, '/admin/modules')).toBe('/')
  })
})
