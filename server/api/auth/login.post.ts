import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import bcrypt from 'bcryptjs'
import { prisma } from '../../utils/prisma'
import { setSessionUser } from '../../utils/auth'
import { checkRateLimit } from '../../utils/rateLimit'

const LOGIN_RATE_LIMIT = {
  max: 8,
  windowMs: 15 * 60 * 1000,
}

function clientIp(event: Parameters<Parameters<typeof defineEventHandler>[0]>[0]) {
  const forwardedFor = getHeader(event, 'x-forwarded-for') || ''
  const realIp = getHeader(event, 'x-real-ip') || ''
  return forwardedFor.split(',')[0]?.trim() || realIp || event.node.req.socket.remoteAddress || 'unknown'
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid credentials' })
  }

  const limitKey = `login:${clientIp(event)}:${email}`
  if (!checkRateLimit(limitKey, LOGIN_RATE_LIMIT)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many login attempts. Please try again later.' })
  }

  const profile = await prisma.profile.findUnique({
    where: { email }
  })

  if (!profile || !profile.passwordHash) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const isValid = await bcrypt.compare(password, profile.passwordHash)
  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  await setSessionUser(event, profile.id)

  return { profile: { id: profile.id, email: profile.email, role: profile.role } }
})
