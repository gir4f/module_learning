import { createError, defineEventHandler, readBody } from 'h3'
import { resolve } from 'node:path'
import { moduleBulkDeletePayloadSchema } from '../../../app/utils/validation'
import { validationError } from '../../utils/apiError'
import { recordAuditEntry } from '../../utils/auditLog'
import { requireAdmin } from '../../utils/auth'
import { invalidateModuleCache } from '../../utils/cache'
import { moduleInclude, prisma } from '../../utils/prisma'
import { deleteUploadedFileWithPreview } from '../../utils/uploads'

export default defineEventHandler(async (event) => {
  const actor = await requireAdmin(event)
  const parsed = moduleBulkDeletePayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const config = useRuntimeConfig()
  const uploadRoot = resolve(config.uploadDir)

  const uniqueIds = Array.from(new Set(parsed.data.ids.filter(Boolean)))
  if (!uniqueIds.length) {
    return { requestedCount: 0, affectedCount: 0, missingIds: [] }
  }

  let existing: any[]
  let result: { requestedCount: number; affectedCount: number; missingIds: string[] }

  try {
    const txResult = await prisma.$transaction(async (tx) => {
      const found = await tx.module.findMany({
        where: { id: { in: uniqueIds } },
        include: moduleInclude,
      })

      const foundIds = found.map(m => m.id)
      const missingIds = uniqueIds.filter(id => !foundIds.includes(id))

      const { count } = foundIds.length
        ? await tx.module.deleteMany({ where: { id: { in: foundIds } } })
        : { count: 0 }

      // One audit entry per top-level deleted module only (no cascade children entries)
      for (const mod of found) {
        await recordAuditEntry({
          tx,
          actor,
          action: 'DELETE',
          entityType: 'MODULE',
          entityId: mod.id,
          entityLabel: mod.title,
          payloadBefore: mod,
        })
      }

      return { found, requestedCount: uniqueIds.length, affectedCount: count, missingIds }
    })

    existing = txResult.found
    result = {
      requestedCount: txResult.requestedCount,
      affectedCount: txResult.affectedCount,
      missingIds: txResult.missingIds,
    }
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mencatat audit log.',
    })
  }

  // Clean up uploaded files AFTER successful transaction commit
  const attachments = existing.flatMap((mod: any) =>
    mod.details?.flatMap((detail: any) =>
      detail.attachments?.map((a: any) => a.filePath) ?? [],
    ) ?? [],
  )
  for (const filePath of attachments) {
    await deleteUploadedFileWithPreview(uploadRoot, filePath)
  }

  await invalidateModuleCache()
  return result
})
