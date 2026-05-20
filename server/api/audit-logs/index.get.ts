import { defineEventHandler, getQuery, createError } from 'h3'
import { z } from 'zod'
import { requireAdmin } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
  entityType: z.enum(['MODULE', 'MODULE_DETAIL', 'COMPONENT_ITEM', 'ATTACHMENT']).optional(),
  actorId: z.string().min(1).optional(),
})

export default defineEventHandler(async (event) => {
  // 1. Parse and validate query params
  const rawQuery = getQuery(event)
  const parsed = querySchema.safeParse(rawQuery)

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    const paramName = firstIssue?.path?.[0] || 'unknown'
    throw createError({
      statusCode: 400,
      statusMessage: `Parameter '${paramName}' tidak valid.`,
    })
  }

  const { limit, cursor, entityType, actorId } = parsed.data

  // 2. Authenticate and authorize — returns 401/403 on failure
  await requireAdmin(event)

  // 3. Cursor lookup
  let cursorCreatedAt: Date | undefined
  let cursorId: string | undefined

  if (cursor) {
    const cursorEntry = await prisma.auditLog.findUnique({
      where: { id: cursor },
      select: { createdAt: true, id: true },
    })

    if (!cursorEntry) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cursor tidak ditemukan.',
      })
    }

    cursorCreatedAt = cursorEntry.createdAt
    cursorId = cursorEntry.id
  }

  // 4. Build where clause with AND semantics
  const where: any = {}
  const andConditions: any[] = []

  if (entityType) {
    andConditions.push({ entityType })
  }

  if (actorId) {
    andConditions.push({ actorId })
  }

  if (cursorCreatedAt && cursorId) {
    andConditions.push({
      OR: [
        { createdAt: { lt: cursorCreatedAt } },
        {
          AND: [
            { createdAt: { equals: cursorCreatedAt } },
            { id: { lt: cursorId } },
          ],
        },
      ],
    })
  }

  if (andConditions.length > 0) {
    where.AND = andConditions
  }

  // 5. Query with take: limit + 1
  const rows = await prisma.auditLog.findMany({
    where,
    take: limit + 1,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: {
      id: true,
      action: true,
      entityType: true,
      entityId: true,
      entityLabel: true,
      actorId: true,
      actorEmail: true,
      actorName: true,
      createdAt: true,
    },
  })

  // 6. Determine nextCursor from extra row
  let nextCursor: string | null = null

  if (rows.length > limit) {
    rows.pop()
    nextCursor = rows[rows.length - 1].id
  }

  // 7. Return response
  return {
    items: rows,
    nextCursor,
  }
})
