import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { detailPayloadSchema } from '../../../../app/utils/validation'
import { requireAdmin } from '../../../utils/auth'
import { validationError } from '../../../utils/apiError'
import { invalidateModuleCache } from '../../../utils/cache'
import { prisma } from '../../../utils/prisma'
import { uniqueSlug } from '../../../utils/slug'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const detailId = getRouterParam(event, 'detailId')
  const parsed = detailPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const payload = parsed.data
  const { slug: requestedSlug, ...detailData } = payload

  const detail = await prisma.$transaction(async (tx) => {
    const currentDetail = requestedSlug
      ? await tx.moduleDetail.findUnique({ where: { id: detailId }, select: { moduleId: true } })
      : null
    const slug = requestedSlug && currentDetail
      ? await uniqueSlug(requestedSlug, async (slug) => {
          const conflict = await tx.moduleDetail.findFirst({
            where: {
              moduleId: currentDetail.moduleId,
              slug,
              NOT: { id: detailId },
            },
            select: { id: true },
          })
          return Boolean(conflict)
        }, 'section')
      : undefined

    await tx.componentItem.deleteMany({ where: { detailId } })
    return tx.moduleDetail.update({
      where: { id: detailId },
      data: {
        ...(slug ? { slug } : {}),
        title: detailData.title,
        summary: detailData.summary,
        keywords: detailData.keywords,
        sortOrder: detailData.sortOrder,
        components: { create: detailData.components },
      },
      include: {
        components: { orderBy: { sortOrder: 'asc' } },
        attachments: { orderBy: { sortOrder: 'asc' } },
      },
    })
  })
  await invalidateModuleCache()
  return detail
})
