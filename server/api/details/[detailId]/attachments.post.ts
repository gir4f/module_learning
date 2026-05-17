import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { attachmentPayloadSchema } from '../../../../app/utils/validation'
import { requireAdmin } from '../../../utils/auth'
import { validationError } from '../../../utils/apiError'
import { invalidateModuleCache } from '../../../utils/cache'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const detailId = getRouterParam(event, 'detailId')
  if (!detailId) {
    throw createError({ statusCode: 400, statusMessage: 'Detail id is required.' })
  }

  const parsed = attachmentPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const attachment = await prisma.attachment.create({
    data: {
      ...parsed.data,
      detailId,
    },
  })
  await invalidateModuleCache()
  return attachment
})
