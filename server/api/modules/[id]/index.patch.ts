import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { modulePatchPayloadSchema } from '../../../../app/utils/validation'
import { requireAdmin } from '../../../utils/auth'
import { validationError } from '../../../utils/apiError'
import { recordAuditEntry } from '../../../utils/auditLog'
import { invalidateModuleCache } from '../../../utils/cache'
import { moduleInclude, prisma } from '../../../utils/prisma'
import { uniqueSlug } from '../../../utils/slug'

export default defineEventHandler(async (event) => {
  const actor = await requireAdmin(event)
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

  try {
    const module = await prisma.$transaction(async (tx) => {
      const before = await tx.module.findUniqueOrThrow({
        where: { id },
        include: moduleInclude,
      })

      const updated = await tx.module.update({
        where: { id },
        data: slug ? { ...moduleData, slug } : moduleData,
        include: moduleInclude,
      })

      await recordAuditEntry({
        tx,
        actor,
        action: 'UPDATE',
        entityType: 'MODULE',
        entityId: updated.id,
        entityLabel: updated.title,
        payloadBefore: before,
        payloadAfter: updated,
      })

      return updated
    })

    await invalidateModuleCache()
    return module
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Gagal mencatat audit log.' })
  }
})
