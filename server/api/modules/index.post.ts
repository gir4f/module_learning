import { defineEventHandler, readBody } from 'h3'
import { modulePayloadSchema, slugFromPayload } from '../../../app/utils/validation'
import { requireAdmin } from '../../utils/auth'
import { validationError } from '../../utils/apiError'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const parsed = modulePayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const payload = parsed.data
  return prisma.module.create({
    data: {
      ...payload,
      slug: slugFromPayload(payload.title, payload.slug),
    },
  })
})
