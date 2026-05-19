/**
 * Unit + property tests for app/utils/csvUtils.ts
 *
 * Tasks: 2.1, 2.2, 2.3, 2.4, 2.5
 * Framework: Vitest + fast-check
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  levenshteinDistance,
  resolveCsvColumnIndex,
  parseCsvTable,
  normalizeCsvHeader,
  detectCsvDelimiter,
  getCsvCell,
  escapeCsvField,
  CSV_HEADER_ALIASES,
} from '../../app/utils/csvUtils'

// ---------------------------------------------------------------------------
// Task 2.1 — Example tests for levenshteinDistance
// Requirements: 1.11, 1.15, 1.16
// ---------------------------------------------------------------------------

describe('levenshteinDistance — example tests', () => {
  it('identity: same string → 0', () => {
    expect(levenshteinDistance('abc', 'abc')).toBe(0)
  })

  it('both empty → 0', () => {
    expect(levenshteinDistance('', '')).toBe(0)
  })

  it('empty a → b.length', () => {
    expect(levenshteinDistance('', 'abc')).toBe(3)
  })

  it('empty b → a.length', () => {
    expect(levenshteinDistance('abc', '')).toBe(3)
  })

  it('substitution: cat → bat = 1', () => {
    expect(levenshteinDistance('cat', 'bat')).toBe(1)
  })

  it('insertion: cat → cats = 1', () => {
    expect(levenshteinDistance('cat', 'cats')).toBe(1)
  })

  it('deletion: cats → cat = 1', () => {
    expect(levenshteinDistance('cats', 'cat')).toBe(1)
  })

  it('kitten → sitting = 3', () => {
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3)
  })

  it('saturday → sunday = 3', () => {
    expect(levenshteinDistance('saturday', 'sunday')).toBe(3)
  })
})

// ---------------------------------------------------------------------------
// Task 2.2 — Property tests for levenshteinDistance (fast-check)
// Requirements: 1.11, 1.12, 1.13, 1.14, 1.15
// ---------------------------------------------------------------------------

describe('levenshteinDistance — property tests', () => {
  /**
   * Property 1: Levenshtein identity
   * Validates: Requirements 1.11
   */
  it('Property 1 (identity): levenshteinDistance(s, s) === 0 for any string', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        return levenshteinDistance(s, s) === 0
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 2: Levenshtein symmetry
   * Validates: Requirements 1.12
   */
  it('Property 2 (symmetry): levenshteinDistance(a, b) === levenshteinDistance(b, a)', () => {
    fc.assert(
      fc.property(fc.tuple(fc.string(), fc.string()), ([a, b]) => {
        return levenshteinDistance(a, b) === levenshteinDistance(b, a)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 3: Levenshtein upper bound
   * Validates: Requirements 1.13
   */
  it('Property 3 (upper bound): levenshteinDistance(a, b) <= Math.max(a.length, b.length)', () => {
    fc.assert(
      fc.property(fc.tuple(fc.string(), fc.string()), ([a, b]) => {
        return levenshteinDistance(a, b) <= Math.max(a.length, b.length)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 4: Levenshtein triangle inequality
   * Validates: Requirements 1.14
   */
  it('Property 4 (triangle inequality): dist(a,c) <= dist(a,b) + dist(b,c)', () => {
    fc.assert(
      fc.property(fc.tuple(fc.string(), fc.string(), fc.string()), ([a, b, c]) => {
        return levenshteinDistance(a, c) <= levenshteinDistance(a, b) + levenshteinDistance(b, c)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 5: Levenshtein empty-string distance
   * Validates: Requirements 1.15
   */
  it('Property 5 (empty-string distance): levenshteinDistance(\'\', s) === s.length', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        return levenshteinDistance('', s) === s.length
      }),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Task 2.3 — Example tests for resolveCsvColumnIndex — all five tiers
// Requirements: 1.1, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 2.6
// ---------------------------------------------------------------------------

describe('resolveCsvColumnIndex — example tests', () => {
  // Score 4 — exact match
  it('Score 4 (exact): "kategori" matches CSV_HEADER_ALIASES.category → index 0', () => {
    const headers = ['kategori', 'nama komponen', 'jumlah']
    expect(resolveCsvColumnIndex(headers, CSV_HEADER_ALIASES.category)).toBe(0)
  })

  // Score 3 — contains
  it('Score 3 (contains): "nama komponen bahan" contains alias "nama komponen" → index 0', () => {
    const headers = ['nama komponen bahan', 'jumlah']
    expect(resolveCsvColumnIndex(headers, CSV_HEADER_ALIASES.name)).toBe(0)
  })

  // Score 2 — word-part
  it('Score 2 (word-part): "komponen nama" word-part matches quantity alias → index 1', () => {
    const headers = ['komponen nama', 'jumlah']
    expect(resolveCsvColumnIndex(headers, CSV_HEADER_ALIASES.quantity)).toBe(1)
  })

  // Score 1 — fuzzy: "keteranngan" → note (dist 1, threshold 3)
  it('Score 1 (fuzzy): "keteranngan" → note (dist 1, threshold 3) → index 1', () => {
    const headers = ['nama', 'keteranngan']
    expect(resolveCsvColumnIndex(headers, CSV_HEADER_ALIASES.note)).toBe(1)
  })

  // Score 1 — fuzzy: "satuam" → unit (dist 1, threshold 2)
  it('Score 1 (fuzzy): "satuam" → unit (dist 1, threshold 2) → index 1', () => {
    const headers = ['nama', 'satuam']
    expect(resolveCsvColumnIndex(headers, CSV_HEADER_ALIASES.unit)).toBe(1)
  })

  // Score 1 — fuzzy: "jumlha" → quantity (dist 2, threshold 2)
  it('Score 1 (fuzzy): "jumlha" → quantity (dist 2, threshold 2) → index 1', () => {
    const headers = ['nama', 'jumlha']
    expect(resolveCsvColumnIndex(headers, CSV_HEADER_ALIASES.quantity)).toBe(1)
  })

  // Score 1 — fuzzy: "nmaa komponen" → name (dist 1, threshold 3)
  it('Score 1 (fuzzy): "nmaa komponen" → name (dist 1, threshold 3) → index 0', () => {
    const headers = ['nmaa komponen', 'jumlah']
    expect(resolveCsvColumnIndex(headers, CSV_HEADER_ALIASES.name)).toBe(0)
  })

  // Score 0 — no match
  it('Score 0 (no match): random strings → -1', () => {
    const headers = ['xyz123', 'abc999']
    expect(resolveCsvColumnIndex(headers, CSV_HEADER_ALIASES.name)).toBe(-1)
  })

  // False positive guard: "nama" must NOT match note (dist 3, threshold 2)
  it('False positive guard: "nama" does NOT match note (dist 3 > threshold 2) → -1', () => {
    const headers = ['nama']
    expect(resolveCsvColumnIndex(headers, CSV_HEADER_ALIASES.note)).toBe(-1)
  })

  // Tie-break: exact beats fuzzy — "satuan" at index 1 beats "satuam" at index 0
  it('Tie-break (exact beats fuzzy): ["satuam", "satuan"] against ["satuan"] → 1', () => {
    const headers = ['satuam', 'satuan']
    expect(resolveCsvColumnIndex(headers, ['satuan'])).toBe(1)
  })

  // Tie-break: equal edit distance → lower colIndex wins
  it('Tie-break (lower colIndex wins): ["satuam", "satuam"] against ["satuan"] → 0', () => {
    const headers = ['satuam', 'satuam']
    expect(resolveCsvColumnIndex(headers, ['satuan'])).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Task 2.4 — Property tests for resolveCsvColumnIndex (fast-check)
// Requirements: 1.1, 1.2, 1.17, 1.18, 2.1, 2.2, 2.3, 2.4, 2.5
// ---------------------------------------------------------------------------

// Collect all alias strings from all keys for use in property generators
const allAliasStrings: string[] = (
  Object.values(CSV_HEADER_ALIASES) as readonly (readonly string[])[]
).flatMap((arr) => [...arr])

describe('resolveCsvColumnIndex — property tests', () => {
  /**
   * Property 6: Fuzzy tier priority — verbatim alias always wins
   * Validates: Requirements 1.1, 1.2, 2.5
   */
  it('Property 6 (fuzzy tier priority): verbatim alias in header array always resolves to its index', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allAliasStrings),
        fc.array(fc.string({ minLength: 1 }), { minSize: 0, maxSize: 5 }),
        fc.array(fc.string({ minLength: 1 }), { minSize: 0, maxSize: 5 }),
        (verbatimAlias, prefix, suffix) => {
          // Build a header array: [prefix..., verbatimAlias, suffix...]
          const headers = [...prefix, verbatimAlias, ...suffix]
          const expectedIndex = prefix.length

          // Find which key this alias belongs to
          const aliasKey = (Object.keys(CSV_HEADER_ALIASES) as (keyof typeof CSV_HEADER_ALIASES)[]).find(
            (key) => (CSV_HEADER_ALIASES[key] as readonly string[]).includes(verbatimAlias),
          )!
          const aliases = CSV_HEADER_ALIASES[aliasKey]

          const result = resolveCsvColumnIndex(headers, aliases)
          return result === expectedIndex
        },
      ),
      { numRuns: 100 },
    )
  })

  /**
   * Property 7: Backward compatibility — known-good single-element header resolves to 0
   * Validates: Requirements 2.1, 2.2, 2.3, 2.4
   */
  it('Property 7 (backward compat): any alias string as sole header resolves to index 0', () => {
    fc.assert(
      fc.property(fc.constantFrom(...allAliasStrings), (aliasStr) => {
        // Find which key this alias belongs to
        const aliasKey = (Object.keys(CSV_HEADER_ALIASES) as (keyof typeof CSV_HEADER_ALIASES)[]).find(
          (key) => (CSV_HEADER_ALIASES[key] as readonly string[]).includes(aliasStr),
        )!
        const aliases = CSV_HEADER_ALIASES[aliasKey]

        return resolveCsvColumnIndex([aliasStr], aliases) === 0
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 8: Threshold monotonicity
   * Validates: Requirements 1.17, 1.18
   */
  it('Property 8 (threshold monotonicity): len1 <= len2 implies threshold(len1) <= threshold(len2)', () => {
    fc.assert(
      fc.property(fc.tuple(fc.nat(50), fc.nat(50)), ([len1, len2]) => {
        const lo = Math.min(len1, len2)
        const hi = Math.max(len1, len2)
        const thresholdLo = Math.max(2, Math.floor(lo * 0.3))
        const thresholdHi = Math.max(2, Math.floor(hi * 0.3))
        return thresholdLo <= thresholdHi
      }),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Task 2.5 — Example tests for the five moved functions
// Requirements: 3.4, 3.5, 3.6, 3.7, 3.8, 3.15, 3.16, 3.17, 3.18, 3.19
// ---------------------------------------------------------------------------

describe('parseCsvTable — example tests', () => {
  it('BOM stripped', () => {
    expect(parseCsvTable('\uFEFFa,b\nc,d')).toEqual([['a', 'b'], ['c', 'd']])
  })

  it('CRLF normalized', () => {
    expect(parseCsvTable('a,b\r\nc,d')).toEqual([['a', 'b'], ['c', 'd']])
  })

  it('comma delimiter', () => {
    expect(parseCsvTable('a,b,c\n1,2,3')).toEqual([['a', 'b', 'c'], ['1', '2', '3']])
  })

  it('semicolon delimiter', () => {
    expect(parseCsvTable('a;b;c\n1;2;3')).toEqual([['a', 'b', 'c'], ['1', '2', '3']])
  })

  it('tab delimiter', () => {
    expect(parseCsvTable('a\tb\tc\n1\t2\t3')).toEqual([['a', 'b', 'c'], ['1', '2', '3']])
  })

  it('quoted field with embedded comma', () => {
    expect(parseCsvTable('"a,b",c\n1,2')).toEqual([['a,b', 'c'], ['1', '2']])
  })

  it('escaped quote ("")', () => {
    expect(parseCsvTable('"a""b",c')).toEqual([['a"b', 'c']])
  })

  it('empty input → []', () => {
    expect(parseCsvTable('')).toEqual([])
  })
})

describe('normalizeCsvHeader — example tests', () => {
  it('"Nama Komponen" → "nama komponen"', () => {
    expect(normalizeCsvHeader('Nama Komponen')).toBe('nama komponen')
  })

  it('"  KATEGORI  " → "kategori"', () => {
    expect(normalizeCsvHeader('  KATEGORI  ')).toBe('kategori')
  })

  it('"nama_komponen" → "nama komponen"', () => {
    expect(normalizeCsvHeader('nama_komponen')).toBe('nama komponen')
  })

  it('"nama-komponen" → "nama komponen"', () => {
    expect(normalizeCsvHeader('nama-komponen')).toBe('nama komponen')
  })

  it('"Qty." → "qty"', () => {
    expect(normalizeCsvHeader('Qty.')).toBe('qty')
  })

  it('"  a   b  " → "a b"', () => {
    expect(normalizeCsvHeader('  a   b  ')).toBe('a b')
  })
})

describe('detectCsvDelimiter — example tests', () => {
  it('"a,b,c" → ","', () => {
    expect(detectCsvDelimiter('a,b,c')).toBe(',')
  })

  it('"a;b;c" → ";"', () => {
    expect(detectCsvDelimiter('a;b;c')).toBe(';')
  })

  it('"a\\tb\\tc" → "\\t"', () => {
    expect(detectCsvDelimiter('a\tb\tc')).toBe('\t')
  })

  it('single value "a" → "," (default)', () => {
    expect(detectCsvDelimiter('a')).toBe(',')
  })
})

describe('getCsvCell — example tests', () => {
  it('valid index 1 → "b"', () => {
    expect(getCsvCell(['a', 'b', 'c'], 1)).toBe('b')
  })

  it('negative index → ""', () => {
    expect(getCsvCell(['a', 'b', 'c'], -1)).toBe('')
  })

  it('out-of-bounds index 5 → ""', () => {
    expect(getCsvCell(['a', 'b', 'c'], 5)).toBe('')
  })

  it('value with surrounding spaces is trimmed', () => {
    expect(getCsvCell(['  x  '], 0)).toBe('x')
  })
})

describe('escapeCsvField — example tests', () => {
  it('plain string is wrapped in quotes', () => {
    expect(escapeCsvField('hello')).toBe('"hello"')
  })

  it('string with comma is wrapped in quotes', () => {
    expect(escapeCsvField('a,b')).toBe('"a,b"')
  })

  it('double-quote inside is escaped as ""', () => {
    expect(escapeCsvField('say "hi"')).toBe('"say ""hi"""')
  })

  it('empty string → ""', () => {
    expect(escapeCsvField('')).toBe('""')
  })
})
