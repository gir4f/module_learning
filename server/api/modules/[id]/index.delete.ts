import { defineEventHandler, getRouterParam } from 'h3'
import { resolve } from 'node:path'
import { requireAdmin } from '../../../utils/auth'
import { invalidateModuleCache } from '../../../utils/cache'
import { deleteModulesByIds } from '../../../utils/moduleBulk'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const config = useRuntimeConfig()
  const uploadRoot = resolve(config.uploadDir)
  const result = await deleteModulesByIds([id], uploadRoot)

  await invalidateModuleCache()
  return { ok: true, deleted: result.affectedCount > 0 }
})
