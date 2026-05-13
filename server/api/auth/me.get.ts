export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return { profile: session.data }
})
