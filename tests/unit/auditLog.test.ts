import fc from 'fast-check'
import { describe, it, expect } from 'vitest'
import { truncateLabel, serializePayload } from '../../server/utils/auditLog'

describe('truncateLabel', () => {
  /**
   * Property 1: Entity Label Truncation Invariant
   * For any string input, truncateLabel output ≤ 200 chars;
   * inputs ≤ 200 chars are unchanged.
   *
   * **Validates: Requirements 1.6, 15.5**
   */
  describe('Property 1: Entity Label Truncation Invariant', () => {
    it('output is always ≤ 200 characters for any string input', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const result = truncateLabel(input)
          return result.length <= 200
        }),
        { numRuns: 100 }
      )
    })

    it('preserves inputs that are ≤ 200 characters unchanged', () => {
      fc.assert(
        fc.property(fc.string({ maxLength: 200 }), (input) => {
          return truncateLabel(input) === input
        }),
        { numRuns: 100 }
      )
    })

    it('truncates inputs longer than 200 characters to exactly 200', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 201, maxLength: 1000 }),
          (input) => {
            const result = truncateLabel(input)
            return result.length === 200 && input.startsWith(result)
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})

describe('serializePayload', () => {
  /**
   * Property 6: JSON Serialization Safety
   * For any JS value (Date, Decimal, Buffer, circular, undefined, function, symbol),
   * serializePayload returns JSON.stringify-safe value; if serialized > 64KB,
   * returns truncation placeholder.
   *
   * **Validates: Requirements 15.6, 15.7**
   */
  describe('Property 6: JSON Serialization Safety', () => {
    it('output is always JSON.stringify-safe for arbitrary values', () => {
      fc.assert(
        fc.property(fc.anything(), (input) => {
          const result = serializePayload(input)
          expect(() => JSON.stringify(result)).not.toThrow()
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('converts Date instances to ISO strings safely', () => {
      fc.assert(
        fc.property(fc.date(), (input) => {
          const result = serializePayload(input)
          expect(() => JSON.stringify(result)).not.toThrow()
          if (!isNaN(input.getTime())) {
            expect(result).toBe(input.toISOString())
          }
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('handles nested objects with mixed types safely', () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string(),
            count: fc.integer(),
            active: fc.boolean(),
            tags: fc.array(fc.string()),
            nested: fc.anything(),
          }),
          (input) => {
            const result = serializePayload(input)
            expect(() => JSON.stringify(result)).not.toThrow()
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('returns truncation placeholder when serialized size exceeds 64KB', () => {
      // Generate a large string that will exceed 64KB when serialized
      const largeValue = { data: 'x'.repeat(70_000) }
      const result = serializePayload(largeValue) as any
      expect(result._truncated).toBe(true)
      expect(result.originalBytes).toBeGreaterThan(65_536)
    })

    it('handles circular references without throwing', () => {
      const obj: any = { a: 1 }
      obj.self = obj
      const result = serializePayload(obj)
      expect(() => JSON.stringify(result)).not.toThrow()
      expect((result as any).self).toBe('[Circular]')
    })

    it('converts undefined to null', () => {
      const result = serializePayload(undefined)
      expect(result).toBeNull()
    })

    it('converts functions to null inside objects', () => {
      const obj = { fn: () => {}, name: 'test' }
      const result = serializePayload(obj) as any
      expect(result.fn).toBeNull()
      expect(result.name).toBe('test')
    })

    it('converts symbols to null inside objects', () => {
      const obj = { sym: Symbol('test'), name: 'test' }
      const result = serializePayload(obj) as any
      expect(result.sym).toBeNull()
      expect(result.name).toBe('test')
    })

    it('converts Buffer to null', () => {
      const buf = Buffer.from('hello')
      const result = serializePayload(buf)
      expect(result).toBeNull()
    })
  })
})
