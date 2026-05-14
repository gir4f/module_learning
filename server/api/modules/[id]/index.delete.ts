import { defineEventHandler, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const details = await prisma.moduleDetail.findMany({
    where: { moduleId: id },
    select: { attachments: true }
  })
  const attachments = details.flatMap(d => d.attachments)

  await prisma.module.delete({ where: { id } })

  // Clean up orphaned files
  if (attachments.length > 0) {
    const { promises: fs } = await import('node:fs')
    const { resolve } = await import('node:path')
    const config = useRuntimeConfig()
    const uploadRoot = resolve(config.uploadDir)

    for (const attachment of attachments) {
      if (attachment.filePath) {
        const targetPath = resolve(uploadRoot, attachment.filePath)
        if (targetPath.startsWith(uploadRoot)) {
          await fs.unlink(targetPath).catch(() => undefined)
        }
      }
    }
  }

  return { ok: true }
})
