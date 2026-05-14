import { describe, it, expect } from 'vitest'
import { slugFromPayload, modulePayloadSchema } from '../app/utils/validation'
import { uniqueSlug } from '../server/utils/slug'

describe('Validation Utils', () => {
  describe('slugFromPayload', () => {
    it('uses provided slug if available', () => {
      const result = slugFromPayload('My Title', 'custom-slug')
      expect(result).toBe('custom-slug')
    })

    it('generates slug from title if no slug provided', () => {
      // makeSlug handles the actual conversion (mocked behavior here implies it lowercases and adds hyphens)
      const result = slugFromPayload('My Awesome Title')
      // Assuming makeSlug('My Awesome Title') -> 'my-awesome-title'
      expect(result).toBeTypeOf('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('modulePayloadSchema', () => {
    it('validates a correct payload', () => {
      const payload = {
        title: 'New Module',
        status: 'DRAFT',
      }
      const result = modulePayloadSchema.safeParse(payload)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('New Module')
        expect(result.data.status).toBe('DRAFT')
        expect(result.data.sortOrder).toBe(0) // Default value
      }
    })

    it('fails when title is empty', () => {
      const payload = {
        title: '   ', // Blank title
      }
      const result = modulePayloadSchema.safeParse(payload)
      expect(result.success).toBe(false)
    })
  })

  describe('uniqueSlug', () => {
    it('adds numeric suffixes until the slug is unique', async () => {
      const taken = new Set(['device-speed', 'device-speed-2'])
      const result = await uniqueSlug('Device Speed', async slug => taken.has(slug), 'module')

      expect(result).toBe('device-speed-3')
    })

    it('uses fallback when the source cannot produce a slug', async () => {
      const result = await uniqueSlug('!!!', async () => false, 'module')

      expect(result).toBe('module')
    })
  })
})
