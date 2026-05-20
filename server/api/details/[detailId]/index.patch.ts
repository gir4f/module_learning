import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { detailPayloadSchema } from '../../../../app/utils/validation'
import { requireAdmin } from '../../../utils/auth'
import { validationError } from '../../../utils/apiError'
import { recordAuditEntry } from '../../../utils/auditLog'
import { invalidateModuleCache } from '../../../utils/cache'
import { prisma } from '../../../utils/prisma'
import { uniqueSlug } from '../../../utils/slug'

export default defineEventHandler(async (event) => {
  const actor = await requireAdmin(event)
  const detailId = getRouterParam(event, 'detailId')
  const parsed = detailPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const payload = parsed.data
  const { slug: requestedSlug, ...detailData } = payload

  try {
    const detail = await prisma.$transaction(async (tx) => {
      const before = await tx.moduleDetail.findUniqueOrThrow({
        where: { id: detailId },
        include: {
          components: { orderBy: { sortOrder: 'asc' } },
          attachments: { orderBy: { sortOrder: 'asc' } },
        },
      })

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
      const updated = await tx.moduleDetail.update({
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

      await recordAuditEntry({
        tx,
        actor,
        action: 'UPDATE',
        entityType: 'MODULE_DETAIL',
        entityId: updated.id,
        entityLabel: updated.title,
        payloadBefore: before,
        payloadAfter: updated,
      })

      return updated
    })

    await invalidateModuleCache()
    return detail
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Gagal mencatat audit log.' })
  }
})
