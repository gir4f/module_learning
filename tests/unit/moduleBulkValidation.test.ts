import { describe, expect, it } from 'vitest'
import { moduleBulkDeletePayloadSchema, moduleBulkStatusPayloadSchema } from '../../app/utils/validation'

describe('module bulk payload validation', () => {
  it('deduplicates ids for bulk status payloads', () => {
    const parsed = moduleBulkStatusPayloadSchema.parse({
      ids: ['mod-1', 'mod-1', 'mod-2'],
      status: 'PUBLISHED',
    })

    expect(parsed.ids).toEqual(['mod-1', 'mod-2'])
    expect(parsed.status).toBe('PUBLISHED')
  })

  it('rejects empty bulk delete payloads', () => {
    const parsed = moduleBulkDeletePayloadSchema.safeParse({ ids: [] })
    expect(parsed.success).toBe(false)
  })
})
