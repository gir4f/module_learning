import { defineEventHandler, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  await prisma.module.delete({ where: { id } })
  return { ok: true }
})
