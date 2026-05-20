import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { z } from 'zod'
import { requireAdmin } from '../../../utils/auth'
import { validationError } from '../../../utils/apiError'
import { recordAuditEntry } from '../../../utils/auditLog'
import { invalidateModuleCache } from '../../../utils/cache'
import { prisma } from '../../../utils/prisma'

const componentPayloadSchema = z.object({
  category: z.string().trim().optional().nullable(),
  name: z.string().trim().min(1, 'Required'),
  quantity: z.string().trim().min(1, 'Required'),
  unit: z.string().trim().min(1, 'Required'),
  note: z.string().trim().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
})

export default defineEventHandler(async (event) => {
  const actor = await requireAdmin(event)
  const componentId = getRouterParam(event, 'componentId')
  const parsed = componentPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  try {
    const component = await prisma.$transaction(async (tx) => {
      const before = await tx.componentItem.findUniqueOrThrow({
        where: { id: componentId },
      })

      const updated = await tx.componentItem.update({
        where: { id: componentId },
        data: parsed.data,
      })

      await recordAuditEntry({
        tx,
        actor,
        action: 'UPDATE',
        entityType: 'COMPONENT_ITEM',
        entityId: updated.id,
        entityLabel: updated.name,
        payloadBefore: before,
        payloadAfter: updated,
      })

      return updated
    })

    await invalidateModuleCache()
    return component
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Gagal mencatat audit log.' })
  }
})
