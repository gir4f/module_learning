import { createError, defineEventHandler, getRouterParam } from 'h3'
import { resolve } from 'node:path'
import { requireAdmin } from '../../../utils/auth'
import { recordAuditEntry } from '../../../utils/auditLog'
import { invalidateModuleCache } from '../../../utils/cache'
import { prisma } from '../../../utils/prisma'
import { deleteUploadedFileWithPreview } from '../../../utils/uploads'

export default defineEventHandler(async (event) => {
  const actor = await requireAdmin(event)
  const attachmentId = getRouterParam(event, 'attachmentId')
  if (!attachmentId) throw createError({ statusCode: 400, statusMessage: 'Missing attachmentId' })

  let before: any
  try {
    before = await prisma.$transaction(async (tx) => {
      const attachment = await tx.attachment.findUniqueOrThrow({
        where: { id: attachmentId },
      })

      await tx.attachment.delete({ where: { id: attachmentId } })

      await recordAuditEntry({
        tx,
        actor,
        action: 'DELETE',
        entityType: 'ATTACHMENT',
        entityId: attachment.id,
        entityLabel: attachment.title,
        payloadBefore: attachment,
      })

      return attachment
    })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Attachment not found' })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mencatat audit log.',
    })
  }

  // Clean up uploaded file AFTER successful transaction commit
  if (before?.filePath) {
    const config = useRuntimeConfig()
    const uploadRoot = resolve(config.uploadDir)
    await deleteUploadedFileWithPreview(uploadRoot, before.filePath)
  }

  await invalidateModuleCache()
  return { ok: true }
})
