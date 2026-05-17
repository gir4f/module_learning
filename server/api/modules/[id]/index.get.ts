import { createError, defineEventHandler, getRouterParam } from 'h3'
import { defineCachedEventHandler } from 'nitropack/runtime'
import { getRequestRole } from '../../../utils/auth'
import { moduleInclude, prisma } from '../../../utils/prisma'

export default defineCachedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const role = await getRequestRole(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Module id is required.' })
  }

  const module = await prisma.module.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
      ...(role === 'ADMIN' ? {} : { status: 'PUBLISHED' as const }),
    },
    include: moduleInclude,
  })

  if (!module) throw createError({ statusCode: 404, statusMessage: 'Module not found.' })
  return module
}, {
  name: 'module-detail',
  group: 'module-api',
  maxAge: 600,
  swr: true,
  shouldBypassCache: async event => await getRequestRole(event) === 'ADMIN',
  getKey: event => `module:${getRouterParam(event, 'id') || ''}`,
})
