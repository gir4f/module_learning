import { defineEventHandler, readBody } from 'h3'
import { moduleBulkStatusPayloadSchema } from '../../../app/utils/validation'
import { validationError } from '../../utils/apiError'
import { requireAdmin } from '../../utils/auth'
import { invalidateModuleCache } from '../../utils/cache'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const parsed = moduleBulkStatusPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const { ids, status } = parsed.data
  const existingModules = await prisma.module.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  })

  const foundIds = existingModules.map(module => module.id)
  const missingIds = ids.filter(id => !foundIds.includes(id))
  const { count } = foundIds.length
    ? await prisma.module.updateMany({
        where: { id: { in: foundIds } },
        data: { status },
      })
    : { count: 0 }

  await invalidateModuleCache()

  return {
    requestedCount: ids.length,
    affectedCount: count,
    missingIds,
  }
})
