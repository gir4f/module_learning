import { createError, defineEventHandler, readBody } from 'h3'
import { moduleBulkStatusPayloadSchema } from '../../../app/utils/validation'
import { validationError } from '../../utils/apiError'
import { recordAuditEntry } from '../../utils/auditLog'
import { requireAdmin } from '../../utils/auth'
import { invalidateModuleCache } from '../../utils/cache'
import { moduleInclude, prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const actor = await requireAdmin(event)
  const parsed = moduleBulkStatusPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const { ids, status } = parsed.data

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingModules = await tx.module.findMany({
        where: { id: { in: ids } },
        include: moduleInclude,
      })

      const foundIds = existingModules.map(module => module.id)
      const missingIds = ids.filter(id => !foundIds.includes(id))

      const { count } = foundIds.length
        ? await tx.module.updateMany({
            where: { id: { in: foundIds } },
            data: { status },
          })
        : { count: 0 }

      // Read updated state for each module
      const updatedModules = foundIds.length
        ? await tx.module.findMany({
            where: { id: { in: foundIds } },
            include: moduleInclude,
          })
        : []

      // Write one audit entry per affected module, skip missingIds
      for (const updatedModule of updatedModules) {
        const beforeModule = existingModules.find(m => m.id === updatedModule.id)

        await recordAuditEntry({
          tx,
          actor,
          action: 'UPDATE',
          entityType: 'MODULE',
          entityId: updatedModule.id,
          entityLabel: updatedModule.title,
          payloadBefore: beforeModule,
          payloadAfter: updatedModule,
        })
      }

      return { requestedCount: ids.length, affectedCount: count, missingIds }
    })

    await invalidateModuleCache()
    return result
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Gagal mencatat audit log.' })
  }
})
