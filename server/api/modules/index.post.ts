import { createError, defineEventHandler, readBody } from 'h3'
import { modulePayloadSchema } from '../../../app/utils/validation'
import { requireAdmin } from '../../utils/auth'
import { validationError } from '../../utils/apiError'
import { recordAuditEntry } from '../../utils/auditLog'
import { invalidateModuleCache } from '../../utils/cache'
import { moduleInclude, prisma } from '../../utils/prisma'
import { uniqueSlug } from '../../utils/slug'

export default defineEventHandler(async (event) => {
  const actor = await requireAdmin(event)
  const parsed = modulePayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const payload = parsed.data
  const slug = await uniqueSlug(payload.slug || payload.title, async (slug) => {
    const existing = await prisma.module.findUnique({ where: { slug }, select: { id: true } })
    return Boolean(existing)
  }, 'module')

  let module
  try {
    module = await prisma.$transaction(async (tx) => {
      const created = await tx.module.create({
        data: {
          ...payload,
          slug,
        },
        include: moduleInclude,
      })

      await recordAuditEntry({
        tx,
        actor,
        action: 'CREATE',
        entityType: 'MODULE',
        entityId: created.id,
        entityLabel: created.title,
        payloadAfter: created,
      })

      return created
    })
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mencatat audit log.',
    })
  }

  await invalidateModuleCache()
  return module
})
