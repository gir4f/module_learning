export default defineEventHandler(() => {
  throw createError({ statusCode: 405, statusMessage: 'Metode tidak diizinkan.' })
})
