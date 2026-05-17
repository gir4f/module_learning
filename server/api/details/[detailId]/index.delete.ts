import { defineEventHandler, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { invalidateModuleCache } from '../../../utils/cache'
import { prisma } from '../../../utils/prisma'
import { deleteUploadedFileWithPreview } from '../../../utils/uploads'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const detailId = getRouterParam(event, 'detailId')
  if (!detailId) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const attachments = await prisma.attachment.findMany({ where: { detailId } })

  await prisma.moduleDetail.delete({ where: { id: detailId } })

  // Clean up orphaned files
  if (attachments.length > 0) {
    const { resolve } = await import('node:path')
    const config = useRuntimeConfig()
    const uploadRoot = resolve(config.uploadDir)

    for (const attachment of attachments) {
      await deleteUploadedFileWithPreview(uploadRoot, attachment.filePath)
    }
  }

  await invalidateModuleCache()
  return { ok: true }
})
