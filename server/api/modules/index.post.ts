import { defineEventHandler, readBody } from 'h3'
import { modulePayloadSchema } from '../../../app/utils/validation'
import { requireAdmin } from '../../utils/auth'
import { validationError } from '../../utils/apiError'
import { invalidateModuleCache } from '../../utils/cache'
import { moduleInclude, prisma } from '../../utils/prisma'
import { uniqueSlug } from '../../utils/slug'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const parsed = modulePayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const payload = parsed.data
  const slug = await uniqueSlug(payload.slug || payload.title, async (slug) => {
    const existing = await prisma.module.findUnique({ where: { slug }, select: { id: true } })
    return Boolean(existing)
  }, 'module')

  const module = await prisma.module.create({
    data: {
      ...payload,
      slug,
    },
    include: moduleInclude,
  })
  await invalidateModuleCache()
  return module
})
