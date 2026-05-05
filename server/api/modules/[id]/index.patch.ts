import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { modulePayloadSchema, slugFromPayload } from '../../../../app/utils/validation'
import { requireAdmin } from '../../../utils/auth'
import { validationError } from '../../../utils/apiError'
import { moduleInclude, prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const parsed = modulePayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const payload = parsed.data
  return prisma.module.update({
    where: { id },
    data: {
      ...payload,
      slug: slugFromPayload(payload.title, payload.slug),
    },
    include: moduleInclude,
  })
})
