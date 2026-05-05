import { defineEventHandler, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const detailId = getRouterParam(event, 'detailId')

  await prisma.moduleDetail.delete({ where: { id: detailId } })
  return { ok: true }
})
