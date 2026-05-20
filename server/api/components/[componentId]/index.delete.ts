import { createError, defineEventHandler, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { recordAuditEntry } from '../../../utils/auditLog'
import { invalidateModuleCache } from '../../../utils/cache'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const actor = await requireAdmin(event)
  const componentId = getRouterParam(event, 'componentId')

  try {
    await prisma.$transaction(async (tx) => {
      const entity = await tx.componentItem.findUniqueOrThrow({
        where: { id: componentId },
      })

      await tx.componentItem.delete({ where: { id: componentId } })

      await recordAuditEntry({
        tx,
        actor,
        action: 'DELETE',
        entityType: 'COMPONENT_ITEM',
        entityId: entity.id,
        entityLabel: entity.name,
        payloadBefore: entity,
      })
    })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Component not found' })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mencatat audit log.',
    })
  }

  await invalidateModuleCache()
  return { ok: true }
})
