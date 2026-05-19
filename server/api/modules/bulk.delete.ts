import { defineEventHandler, readBody } from 'h3'
import { resolve } from 'node:path'
import { moduleBulkDeletePayloadSchema } from '../../../app/utils/validation'
import { validationError } from '../../utils/apiError'
import { requireAdmin } from '../../utils/auth'
import { invalidateModuleCache } from '../../utils/cache'
import { deleteModulesByIds } from '../../utils/moduleBulk'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const parsed = moduleBulkDeletePayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const config = useRuntimeConfig()
  const uploadRoot = resolve(config.uploadDir)
  const result = await deleteModulesByIds(parsed.data.ids, uploadRoot)

  await invalidateModuleCache()
  return result
})
