import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '../../utils/prisma'
import { setSessionUser } from '../../utils/auth'

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const parsed = loginSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 422, statusMessage: 'Invalid email or password.' })

  const { email, password } = parsed.data
  const profile = await prisma.profile.findUnique({ where: { email } })

  if (!profile?.passwordHash) throw createError({ statusCode: 401, statusMessage: 'Invalid email or password.' })

  const valid = await bcrypt.compare(password, profile.passwordHash)
  if (!valid) throw createError({ statusCode: 401, statusMessage: 'Invalid email or password.' })

  await setSessionUser(event, profile.id)

  return {
    profile: {
      id: profile.id,
      email: profile.email,
      fullName: profile.fullName,
      role: profile.role,
    },
  }
})
