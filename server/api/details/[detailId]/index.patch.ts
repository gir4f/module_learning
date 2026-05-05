import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { detailPayloadSchema, slugFromPayload } from '../../../../app/utils/validation'
import { requireAdmin } from '../../../utils/auth'
import { validationError } from '../../../utils/apiError'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const detailId = getRouterParam(event, 'detailId')
  const parsed = detailPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const payload = parsed.data

  return prisma.$transaction(async (tx) => {
    await tx.componentItem.deleteMany({ where: { detailId } })
    return tx.moduleDetail.update({
      where: { id: detailId },
      data: {
        slug: slugFromPayload(payload.title, payload.slug),
        title: payload.title,
        summary: payload.summary,
        keywords: payload.keywords,
        sortOrder: payload.sortOrder,
        components: { create: payload.components },
      },
      include: {
        components: { orderBy: { sortOrder: 'asc' } },
        attachments: { orderBy: { sortOrder: 'asc' } },
      },
    })
  })
})
