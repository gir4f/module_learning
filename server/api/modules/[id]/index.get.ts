import { createError, defineEventHandler, getRouterParam } from 'h3'
import { seedModules } from '../../../../app/data/seedModules'
import { getRequestRole } from '../../../utils/auth'
import { moduleInclude, prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const role = await getRequestRole(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Module id is required.' })
  }

  if (!process.env.DATABASE_URL) {
    const module = seedModules.find((item) => item.slug === id || item.id === id)
    if (!module || (role !== 'ADMIN' && module.status !== 'PUBLISHED')) {
      throw createError({ statusCode: 404, statusMessage: 'Module not found.' })
    }
    return module
  }

  const module = await prisma.module.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
      ...(role === 'ADMIN' ? {} : { status: 'PUBLISHED' as const }),
    },
    include: moduleInclude,
  }).catch((error) => {
    console.error('Failed to load module from database.', error)
    throw createError({
      statusCode: 503,
      statusMessage: 'Database is unavailable.',
      data: { message: 'Database is unavailable.' },
    })
  })

  if (!module) throw createError({ statusCode: 404, statusMessage: 'Module not found.' })
  return module
})
