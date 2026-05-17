import { defineEventHandler, getQuery } from 'h3'
import { defineCachedEventHandler } from 'nitropack/runtime'
import { getRequestRole } from '../../utils/auth'
import { moduleInclude, prisma } from '../../utils/prisma'

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const search = String(query.search || '').trim()
  const role = await getRequestRole(event)

  const statusFilter = role === 'ADMIN' ? undefined : { status: 'PUBLISHED' as const }

  // Build search conditions that push filtering to PostgreSQL
  const searchWhere = search
    ? buildSearchWhere(search)
    : undefined

  const modules = await prisma.module.findMany({
    where: {
      ...statusFilter,
      ...searchWhere,
    },
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      keywords: true,
      status: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
      details: {
        select: {
          id: true,
          components: { select: { id: true } },
          attachments: { select: { id: true } }
        }
      }
    }
  })

  return modules
}, {
  name: 'modules-list',
  group: 'module-api',
  maxAge: 300,
  swr: true,
  shouldBypassCache: async event => await getRequestRole(event) === 'ADMIN',
  getKey: (event) => {
    const query = getQuery(event)
    return ['modules', query.search || ''].join(':')
  },
})

/**
 * Build a Prisma WHERE clause that searches across module title,
 * description, keywords, detail titles/keywords, component names,
 * and attachment titles using ILIKE (case-insensitive).
 *
 * Every search word must match somewhere in the module's data.
 */
function buildSearchWhere(search: string) {
  const words = search.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return undefined

  return {
    AND: words.map((word) => {
      const pattern = `%${word}%`
      return {
        OR: [
          { title: { contains: word, mode: 'insensitive' as const } },
          { description: { contains: word, mode: 'insensitive' as const } },
          { keywords: { contains: word, mode: 'insensitive' as const } },
          {
            details: {
              some: {
                OR: [
                  { title: { contains: word, mode: 'insensitive' as const } },
                  { keywords: { contains: word, mode: 'insensitive' as const } },
                  { summary: { contains: word, mode: 'insensitive' as const } },
                  {
                    components: {
                      some: {
                        name: { contains: word, mode: 'insensitive' as const },
                      },
                    },
                  },
                  {
                    attachments: {
                      some: {
                        title: { contains: word, mode: 'insensitive' as const },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      }
    }),
  }
}
