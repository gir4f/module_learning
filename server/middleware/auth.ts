export default defineEventHandler(async (event) => {
  const path = event.path
  
  // Protect all API mutations (POST, PUT, PATCH, DELETE)
  if (path.startsWith('/api/') && !path.startsWith('/api/auth/')) {
    if (event.method !== 'GET') {
      const session = await getUserSession(event)
      if (!session.data?.userId) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized API Access' })
      }
    }
  }
})
