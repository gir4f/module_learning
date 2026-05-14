import { createError, defineEventHandler, getHeader, getRequestURL } from 'h3'
import { getRequestProfile } from '../utils/auth'

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function requestOrigin(event: Parameters<Parameters<typeof defineEventHandler>[0]>[0]) {
  const forwardedProto = getHeader(event, 'x-forwarded-proto')?.split(',')[0]?.trim()
  const forwardedHost = getHeader(event, 'x-forwarded-host')?.split(',')[0]?.trim()
  if (forwardedProto && forwardedHost) return `${forwardedProto}://${forwardedHost}`
  return getRequestURL(event).origin
}

function headerOrigin(value: string | undefined) {
  if (!value) return ''
  try {
    return new URL(value).origin
  } catch {
    return ''
  }
}

export default defineEventHandler(async (event) => {
  if (event.path === '/api/files' || event.path.startsWith('/api/files/')) {
    throw createError({ statusCode: 404, statusMessage: 'API route not found.' })
  }

  if (!event.path.startsWith('/api/') || !MUTATING_METHODS.has(event.method)) return

  const expectedOrigin = requestOrigin(event)
  const actualOrigin = headerOrigin(getHeader(event, 'origin')) || headerOrigin(getHeader(event, 'referer'))
  if (!actualOrigin) {
    if (process.env.NODE_ENV === 'production') {
      throw createError({ statusCode: 403, statusMessage: 'Same-origin request is required.' })
    }
  } else if (actualOrigin !== expectedOrigin) {
    throw createError({ statusCode: 403, statusMessage: 'Cross-site API request blocked.' })
  }

  if (!event.path.startsWith('/api/auth/')) {
    const profile = await getRequestProfile(event)
    if (!profile) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized API access.' })
    }
  }
})
