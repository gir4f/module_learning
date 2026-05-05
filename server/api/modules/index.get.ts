import { createError, defineEventHandler, getQuery } from 'h3'
import { seedModules } from '../../../app/data/seedModules'
import { moduleMatchesQuery } from '../../../app/utils/search'
import { getRequestRole } from '../../utils/auth'
import { moduleInclude, prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = String(query.search || '')
  const role = await getRequestRole(event)

  if (!process.env.DATABASE_URL) {
    return seedModules
      .filter((module) => role === 'ADMIN' || module.status === 'PUBLISHED')
      .filter((module) => moduleMatchesQuery(module, search))
  }

  const modules = await prisma.module.findMany({
    where: role === 'ADMIN' ? undefined : { status: 'PUBLISHED' },
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    include: moduleInclude,
  }).catch((error) => {
    console.error('Failed to load modules from database.', error)
    throw createError({
      statusCode: 503,
      statusMessage: 'Database is unavailable.',
      data: { message: 'Database is unavailable.' },
    })
  })

  if (!search) return modules

  return modules.filter((module) => moduleMatchesQuery(module, search))
})
