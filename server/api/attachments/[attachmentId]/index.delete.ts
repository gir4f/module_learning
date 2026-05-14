import { defineEventHandler, getRouterParam } from 'h3'
import { resolve } from 'node:path'
import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { deleteUploadedFileWithPreview } from '../../../utils/uploads'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const attachmentId = getRouterParam(event, 'attachmentId')
  const attachment = await prisma.attachment.findUnique({ where: { id: attachmentId } })

  await prisma.attachment.delete({ where: { id: attachmentId } })

  if (attachment?.filePath) {
    const config = useRuntimeConfig()
    const uploadRoot = resolve(config.uploadDir)
    await deleteUploadedFileWithPreview(uploadRoot, attachment.filePath)
  }

  return { ok: true }
})
