import { describe, expect, it } from 'vitest'
import { ACTION_VERB_MAP, ENTITY_TYPE_MAP, resolveActorDisplay } from '../../app/utils/auditDisplay'

describe('ACTION_VERB_MAP', () => {
  it('maps CREATE to menambahkan', () => {
    expect(ACTION_VERB_MAP.CREATE).toBe('menambahkan')
  })

  it('maps UPDATE to mengubah', () => {
    expect(ACTION_VERB_MAP.UPDATE).toBe('mengubah')
  })

  it('maps DELETE to menghapus', () => {
    expect(ACTION_VERB_MAP.DELETE).toBe('menghapus')
  })
})

describe('ENTITY_TYPE_MAP', () => {
  it('maps MODULE to modul', () => {
    expect(ENTITY_TYPE_MAP.MODULE).toBe('modul')
  })

  it('maps MODULE_DETAIL to varian produk', () => {
    expect(ENTITY_TYPE_MAP.MODULE_DETAIL).toBe('varian produk')
  })

  it('maps COMPONENT_ITEM to komponen', () => {
    expect(ENTITY_TYPE_MAP.COMPONENT_ITEM).toBe('komponen')
  })

  it('maps ATTACHMENT to lampiran', () => {
    expect(ENTITY_TYPE_MAP.ATTACHMENT).toBe('lampiran')
  })
})

describe('resolveActorDisplay', () => {
  it('returns trimmed actorName when non-blank', () => {
    expect(resolveActorDisplay({ actorName: '  John Doe  ', actorEmail: 'john@example.com' }))
      .toBe('John Doe')
  })

  it('returns trimmed actorEmail when actorName is null', () => {
    expect(resolveActorDisplay({ actorName: null, actorEmail: '  john@example.com  ' }))
      .toBe('john@example.com')
  })

  it('returns trimmed actorEmail when actorName is empty', () => {
    expect(resolveActorDisplay({ actorName: '', actorEmail: 'john@example.com' }))
      .toBe('john@example.com')
  })

  it('returns trimmed actorEmail when actorName is whitespace-only', () => {
    expect(resolveActorDisplay({ actorName: '   ', actorEmail: 'john@example.com' }))
      .toBe('john@example.com')
  })

  it('returns "Pengguna dihapus" when both actorName and actorEmail are blank', () => {
    expect(resolveActorDisplay({ actorName: null, actorEmail: '' }))
      .toBe('Pengguna dihapus')
  })

  it('returns "Pengguna dihapus" when actorName is whitespace and actorEmail is whitespace', () => {
    expect(resolveActorDisplay({ actorName: '  ', actorEmail: '   ' }))
      .toBe('Pengguna dihapus')
  })
})

import fc from 'fast-check'

/**
 * Property 7: Actor Display Resolution
 * For any combination of actorName/actorEmail (null, empty, whitespace, non-empty),
 * resolveActorDisplay returns correct fallback:
 * - trimmed actorName if non-blank
 * - otherwise trimmed actorEmail if non-blank
 * - otherwise "Pengguna dihapus"
 *
 * **Validates: Requirements 10.2, 10.3, 10.4**
 */
describe('Property 7: Actor Display Resolution', () => {
  // Generator for nullable/whitespace/non-empty strings
  const nullableString = fc.oneof(
    fc.constant(null),
    fc.constant(''),
    fc.constant('   '),
    fc.string({ minLength: 1 }).filter(s => s.trim().length > 0)
  )

  it('always returns a non-empty string for any actorName/actorEmail combination', () => {
    fc.assert(
      fc.property(
        nullableString,
        fc.oneof(fc.constant(''), fc.constant('   '), fc.string({ minLength: 1 })),
        (actorName, actorEmail) => {
          const result = resolveActorDisplay({ actorName, actorEmail })
          return result.length > 0
        }
      ),
      { numRuns: 100 }
    )
  })

  it('returns trimmed actorName when actorName is non-blank, regardless of actorEmail', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        fc.string(),
        (actorName, actorEmail) => {
          const result = resolveActorDisplay({ actorName, actorEmail })
          return result === actorName.trim()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('returns trimmed actorEmail when actorName is blank and actorEmail is non-blank', () => {
    const blankName = fc.oneof(fc.constant(null), fc.constant(''), fc.constant('   '))
    const nonBlankEmail = fc.string({ minLength: 1 }).filter(s => s.trim().length > 0)

    fc.assert(
      fc.property(blankName, nonBlankEmail, (actorName, actorEmail) => {
        const result = resolveActorDisplay({ actorName, actorEmail })
        return result === actorEmail.trim()
      }),
      { numRuns: 100 }
    )
  })

  it('returns "Pengguna dihapus" when both actorName and actorEmail are blank', () => {
    const blankString = fc.oneof(fc.constant(''), fc.constant('   '), fc.constant('\t'), fc.constant('\n'))

    fc.assert(
      fc.property(
        fc.oneof(fc.constant(null), blankString),
        blankString,
        (actorName, actorEmail) => {
          const result = resolveActorDisplay({ actorName, actorEmail })
          return result === 'Pengguna dihapus'
        }
      ),
      { numRuns: 100 }
    )
  })
})
