import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { attachmentPayloadSchema } from '../../../../app/utils/validation'
import { requireAdmin } from '../../../utils/auth'
import { validationError } from '../../../utils/apiError'
import { recordAuditEntry } from '../../../utils/auditLog'
import { invalidateModuleCache } from '../../../utils/cache'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const actor = await requireAdmin(event)
  const attachmentId = getRouterParam(event, 'attachmentId')
  const parsed = attachmentPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  try {
    const attachment = await prisma.$transaction(async (tx) => {
      const before = await tx.attachment.findUniqueOrThrow({
        where: { id: attachmentId },
      })

      const updated = await tx.attachment.update({
        where: { id: attachmentId },
        data: parsed.data,
      })

      await recordAuditEntry({
        tx,
        actor,
        action: 'UPDATE',
        entityType: 'ATTACHMENT',
        entityId: updated.id,
        entityLabel: updated.title,
        payloadBefore: before,
        payloadAfter: updated,
      })

      return updated
    })

    await invalidateModuleCache()
    return attachment
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Gagal mencatat audit log.' })
  }
})
