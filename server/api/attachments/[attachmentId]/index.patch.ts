import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { attachmentPayloadSchema } from '../../../../app/utils/validation'
import { requireAdmin } from '../../../utils/auth'
import { validationError } from '../../../utils/apiError'
import { invalidateModuleCache } from '../../../utils/cache'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const attachmentId = getRouterParam(event, 'attachmentId')
  const parsed = attachmentPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const attachment = await prisma.attachment.update({
    where: { id: attachmentId },
    data: parsed.data,
  })
  await invalidateModuleCache()
  return attachment
})
