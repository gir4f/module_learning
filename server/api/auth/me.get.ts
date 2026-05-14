export default defineEventHandler(async (event) => {
  const profile = await getRequestProfile(event)
  if (!profile) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return { profile }
})
