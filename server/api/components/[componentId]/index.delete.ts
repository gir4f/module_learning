import { defineEventHandler, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const componentId = getRouterParam(event, 'componentId')

  await prisma.componentItem.delete({ where: { id: componentId } })
  return { ok: true }
})
