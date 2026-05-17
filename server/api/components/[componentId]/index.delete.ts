import { defineEventHandler, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { invalidateModuleCache } from '../../../utils/cache'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const componentId = getRouterParam(event, 'componentId')

  await prisma.componentItem.delete({ where: { id: componentId } })
  await invalidateModuleCache()
  return { ok: true }
})
