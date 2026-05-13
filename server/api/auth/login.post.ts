import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const profile = await prisma.profile.findUnique({
    where: { email: body.email }
  })

  if (!profile || !profile.passwordHash) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const isValid = await bcrypt.compare(body.password, profile.passwordHash)
  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const session = await getUserSession(event)
  await session.update({
    userId: profile.id,
    email: profile.email,
    role: profile.role
  })

  return { profile: { id: profile.id, email: profile.email, role: profile.role } }
})
