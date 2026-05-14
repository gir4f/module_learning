import { createError, defineEventHandler, getRouterParam } from 'h3'
import { getRequestRole } from '../../../utils/auth'
import { moduleInclude, prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
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
})
