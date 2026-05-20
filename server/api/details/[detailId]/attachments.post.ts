import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { attachmentPayloadSchema } from '../../../../app/utils/validation'
import { requireAdmin } from '../../../utils/auth'
import { validationError } from '../../../utils/apiError'
import { recordAuditEntry } from '../../../utils/auditLog'
import { invalidateModuleCache } from '../../../utils/cache'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const actor = await requireAdmin(event)
  const detailId = getRouterParam(event, 'detailId')
  if (!detailId) {
    throw createError({ statusCode: 400, statusMessage: 'Detail id is required.' })
  }

  const parsed = attachmentPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  let attachment
  try {
    attachment = await prisma.$transaction(async (tx) => {
      const created = await tx.attachment.create({
        data: {
          ...parsed.data,
          detailId,
        },
      })

      await recordAuditEntry({
        tx,
        actor,
        action: 'CREATE',
        entityType: 'ATTACHMENT',
        entityId: created.id,
        entityLabel: created.title,
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
  return attachment
})
