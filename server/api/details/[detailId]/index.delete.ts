import { createError, defineEventHandler, getRouterParam } from 'h3'
import { resolve } from 'node:path'
import { requireAdmin } from '../../../utils/auth'
import { recordAuditEntry } from '../../../utils/auditLog'
import { invalidateModuleCache } from '../../../utils/cache'
import { prisma } from '../../../utils/prisma'
import { deleteUploadedFileWithPreview } from '../../../utils/uploads'

export default defineEventHandler(async (event) => {
  const actor = await requireAdmin(event)
  const detailId = getRouterParam(event, 'detailId')
  if (!detailId) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const config = useRuntimeConfig()
  const uploadRoot = resolve(config.uploadDir)

  let before: any
  try {
    before = await prisma.$transaction(async (tx) => {
      // Read entity state before deletion
      const entity = await tx.moduleDetail.findUniqueOrThrow({
        where: { id: detailId },
        include: {
          components: { orderBy: { sortOrder: 'asc' } },
          attachments: { orderBy: { sortOrder: 'asc' } },
        },
      })

      // Perform the delete
      await tx.moduleDetail.delete({ where: { id: detailId } })

      // Record audit entry
      await recordAuditEntry({
        tx,
        actor,
        action: 'DELETE',
        entityType: 'MODULE_DETAIL',
        entityId: entity.id,
        entityLabel: entity.title,
        payloadBefore: entity,
      })

      return entity
    })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'ModuleDetail not found' })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mencatat audit log.',
    })
  }

  // Clean up uploaded files AFTER successful transaction commit
  if (before.attachments && before.attachments.length > 0) {
    for (const attachment of before.attachments) {
      await deleteUploadedFileWithPreview(uploadRoot, attachment.filePath)
    }
  }

  await invalidateModuleCache()
  return { ok: true }
})
