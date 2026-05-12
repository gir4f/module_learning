import { createError, getRequestProtocol, type H3Event, useSession } from 'h3'
import { prisma } from './prisma'

export type ServerRole = 'ADMIN' | 'VIEWER'

export interface RequestProfile {
  id: string
  email: string
  fullName: string | null
  role: ServerRole
}

async function getSession(event: H3Event) {
  const config = useRuntimeConfig()
  const secure = getRequestProtocol(event, { xForwardedProto: true }) === 'https'

  return useSession(event, {
    password: config.sessionSecret,
    cookie: {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure,
    },
  })
}

export async function getRequestProfile(event: H3Event): Promise<RequestProfile | null> {
  const session = await getSession(event)
  const userId = session.data?.userId as string | undefined
  if (!userId) return null

  const profile = await prisma.profile.findUnique({ where: { id: userId } })
  if (!profile) return null

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName,
    role: profile.role,
  }
}

export async function getRequestRole(event: H3Event): Promise<ServerRole> {
  const profile = await getRequestProfile(event)
  return profile?.role || 'VIEWER'
}

export async function requireUser(event: H3Event) {
  const profile = await getRequestProfile(event)
  if (!profile) throw createError({ statusCode: 401, statusMessage: 'Login is required.' })
  return profile
}

export async function requireAdmin(event: H3Event) {
  const profile = await requireUser(event)
  if (profile.role !== 'ADMIN') throw createError({ statusCode: 403, statusMessage: 'Admin role is required.' })
  return profile
}

export async function setSessionUser(event: H3Event, userId: string) {
  const session = await getSession(event)
  await session.update({ userId })
}

export async function clearAuthSession(event: H3Event) {
  const session = await getSession(event)
  await session.clear()
}
