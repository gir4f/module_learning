import { defineEventHandler, getRouterParam } from 'h3'
import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'
import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const attachmentId = getRouterParam(event, 'attachmentId')
  const attachment = await prisma.attachment.findUnique({ where: { id: attachmentId } })

  await prisma.attachment.delete({ where: { id: attachmentId } })

  if (attachment?.filePath) {
    const config = useRuntimeConfig()
    const uploadRoot = resolve(config.uploadDir)
    const targetPath = resolve(uploadRoot, attachment.filePath)
    if (targetPath.startsWith(uploadRoot)) {
      await fs.unlink(targetPath).catch(() => undefined)
    }
  }

  return { ok: true }
})
