import { createError, type H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from './prisma'

export type ServerRole = 'ADMIN' | 'VIEWER'

export interface RequestProfile {
  id: string
  email: string
  fullName: string | null
  role: ServerRole
}

function authDisabled() {
  return process.env.NUXT_AUTH_DISABLED === 'true'
}

export async function getRequestProfile(event: H3Event): Promise<RequestProfile | null> {
  if (authDisabled()) {
    return {
      id: 'local-admin',
      email: 'local-admin@example.com',
      fullName: 'Local Admin',
      role: 'ADMIN',
    }
  }

  const user = await serverSupabaseUser(event).catch(() => null)
  if (!user?.email) return null

  if (!process.env.DATABASE_URL) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || user.user_metadata?.name || null,
      role: 'VIEWER',
    }
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { id: user.id },
  })
  const adminCount = await prisma.profile.count({
    where: { role: 'ADMIN' },
  })
  const bootstrapRole = adminCount === 0 ? 'ADMIN' : 'VIEWER'

  const profile = await prisma.profile.upsert({
    where: { id: user.id },
    update: {
      email: user.email,
      fullName: user.user_metadata?.full_name || user.user_metadata?.name || null,
      ...(existingProfile?.role === 'VIEWER' && adminCount === 0 ? { role: 'ADMIN' as const } : {}),
    },
    create: {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || user.user_metadata?.name || null,
      role: bootstrapRole,
    },
  })

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
  if (!profile) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Login is required.',
    })
  }
  return profile
}

export async function requireAdmin(event: H3Event) {
  const profile = await requireUser(event)
  if (profile.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin role is required.',
    })
  }
  return profile
}
