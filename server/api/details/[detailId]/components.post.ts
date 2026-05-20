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
  const detailId = getRouterParam(event, 'detailId')
  if (!detailId) {
    throw createError({ statusCode: 400, statusMessage: 'Detail id is required.' })
  }

  const parsed = componentPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  let component
  try {
    component = await prisma.$transaction(async (tx) => {
      const created = await tx.componentItem.create({
        data: {
          ...parsed.data,
          detailId,
        },
      })

      await recordAuditEntry({
        tx,
        actor,
        action: 'CREATE',
        entityType: 'COMPONENT_ITEM',
        entityId: created.id,
        entityLabel: created.name,
        payloadAfter: created,
      })

      return created
    })
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mencatat audit log.',
    })
  }

  await invalidateModuleCache()
  return component
})
