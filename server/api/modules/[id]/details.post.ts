import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { detailPayloadSchema } from '../../../../app/utils/validation'
import { requireAdmin } from '../../../utils/auth'
import { validationError } from '../../../utils/apiError'
import { prisma } from '../../../utils/prisma'
import { uniqueSlug } from '../../../utils/slug'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const moduleId = getRouterParam(event, 'id')
  if (!moduleId) {
    throw createError({ statusCode: 400, statusMessage: 'Module id is required.' })
  }

  const parsed = detailPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const payload = parsed.data
  const slug = await uniqueSlug(payload.slug || payload.title, async (slug) => {
    const existing = await prisma.moduleDetail.findFirst({
      where: { moduleId, slug },
      select: { id: true },
    })
    return Boolean(existing)
  }, 'section')

  return prisma.moduleDetail.create({
    data: {
      moduleId,
      slug,
      title: payload.title,
      summary: payload.summary,
      keywords: payload.keywords,
      sortOrder: payload.sortOrder,
      components: {
        create: payload.components,
      },
    },
    include: {
      components: { orderBy: { sortOrder: 'asc' } },
      attachments: { orderBy: { sortOrder: 'asc' } },
    },
  })
})
