import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { z } from 'zod'
import { requireAdmin } from '../../../utils/auth'
import { validationError } from '../../../utils/apiError'
import { invalidateModuleCache } from '../../../utils/cache'
import { prisma } from '../../../utils/prisma'

const componentPayloadSchema = z.object({
  category: z.string().trim().optional().nullable(),
  name: z.string().trim().min(1, 'Required'),
  quantity: z.string().trim().min(1, 'Required'),
  unit: z.string().trim().min(1, 'Required'),
  note: z.string().trim().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const componentId = getRouterParam(event, 'componentId')
  const parsed = componentPayloadSchema.safeParse(await readBody(event))

  if (!parsed.success) throw validationError(parsed.error)

  const component = await prisma.componentItem.update({
    where: { id: componentId },
    data: parsed.data,
  })
  await invalidateModuleCache()
  return component
})
