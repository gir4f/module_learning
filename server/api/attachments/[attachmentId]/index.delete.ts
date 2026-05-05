import { defineEventHandler, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const attachmentId = getRouterParam(event, 'attachmentId')

  await prisma.attachment.delete({ where: { id: attachmentId } })
  return { ok: true }
})
