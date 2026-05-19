import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { modulePatchPayloadSchema } from '../../../../app/utils/validation'
import { requireAdmin } from '../../../utils/auth'
import { validationError } from '../../../utils/apiError'
import { invalidateModuleCache } from '../../../utils/cache'
import { moduleInclude, prisma } from '../../../utils/prisma'
import { uniqueSlug } from '../../../utils/slug'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const parsed = modulePatchPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const payload = parsed.data
  const { slug: requestedSlug, ...moduleData } = payload
  const slug = requestedSlug
    ? await uniqueSlug(requestedSlug, async (slug) => {
        const existing = await prisma.module.findUnique({ where: { slug }, select: { id: true } })
        return Boolean(existing && existing.id !== id)
      }, 'module')
    : undefined

  const module = await prisma.module.update({
    where: { id },
    data: slug ? { ...moduleData, slug } : moduleData,
    include: moduleInclude,
  })
  await invalidateModuleCache()
  return module
})
