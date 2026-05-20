import { createError, defineEventHandler, getRouterParam } from 'h3'
import { resolve } from 'node:path'
import { requireAdmin } from '../../../utils/auth'
import { recordAuditEntry } from '../../../utils/auditLog'
import { invalidateModuleCache } from '../../../utils/cache'
import { moduleInclude, prisma } from '../../../utils/prisma'
import { deleteUploadedFileWithPreview } from '../../../utils/uploads'

export default defineEventHandler(async (event) => {
  const actor = await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const config = useRuntimeConfig()
  const uploadRoot = resolve(config.uploadDir)

  let before: any
  try {
    before = await prisma.$transaction(async (tx) => {
      const entity = await tx.module.findUniqueOrThrow({
        where: { id },
        include: moduleInclude,
      })

      await tx.module.delete({ where: { id } })

      await recordAuditEntry({
        tx,
        actor,
        action: 'DELETE',
        entityType: 'MODULE',
        entityId: entity.id,
        entityLabel: entity.title,
        payloadBefore: entity,
      })

      return entity
    })
  } catch (error: any) {
    // If the entity was not found, return 404
    if (error?.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Module not found' })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mencatat audit log.',
    })
  }

  // Clean up uploaded files AFTER successful transaction commit
  const attachments = before.details?.flatMap((detail: any) =>
    detail.attachments?.map((a: any) => a.filePath) ?? [],
  ) ?? []
  for (const filePath of attachments) {
    await deleteUploadedFileWithPreview(uploadRoot, filePath)
  }

  await invalidateModuleCache()
  return { ok: true, deleted: true }
})
