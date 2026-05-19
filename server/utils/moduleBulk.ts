import { prisma } from './prisma'
import { deleteUploadedFileWithPreview } from './uploads'

export type BulkMutationResult = {
  requestedCount: number
  affectedCount: number
  missingIds: string[]
}

function uniqueModuleIds(ids: string[]) {
  return Array.from(new Set(ids.filter(Boolean)))
}

export async function deleteModulesByIds(ids: string[], uploadRoot: string): Promise<BulkMutationResult> {
  const uniqueIds = uniqueModuleIds(ids)
  if (!uniqueIds.length) {
    return { requestedCount: 0, affectedCount: 0, missingIds: [] }
  }

  const existingModules = await prisma.module.findMany({
    where: { id: { in: uniqueIds } },
    select: {
      id: true,
      details: {
        select: {
          attachments: {
            select: { filePath: true },
          },
        },
      },
    },
  })

  const foundIds = existingModules.map(module => module.id)
  const missingIds = uniqueIds.filter(id => !foundIds.includes(id))
  const attachments = existingModules.flatMap(module =>
    module.details.flatMap(detail => detail.attachments),
  )

  const { count } = foundIds.length
    ? await prisma.module.deleteMany({ where: { id: { in: foundIds } } })
    : { count: 0 }

  for (const attachment of attachments) {
    await deleteUploadedFileWithPreview(uploadRoot, attachment.filePath)
  }

  return {
    requestedCount: uniqueIds.length,
    affectedCount: count,
    missingIds,
  }
}
