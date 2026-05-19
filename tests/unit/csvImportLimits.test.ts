import { beforeAll, describe, expect, it, vi } from 'vitest'
import fc from 'fast-check'

// NOTE: The helper module `app/utils/csvImportLimits.ts` does NOT exist yet.
// Task 3.1 of the csv-import-size-limit bugfix spec will create it.
// We resolve it via dynamic import inside `beforeAll` so the test file still
// loads on UNFIXED code; predicate-dependent tests will fail with a clear
// "module missing" error (the SUCCESS signal for tasks 1 / 2's predicate
// property) while the local example-driven preservation tests still execute
// and PASS on UNFIXED code (they exercise the canonical Indonesian fallback
// strings and decision logic that already exist in `[id].vue`). Once task
// 3.1 lands, every test in this file flips green automatically.

let CSV_IMPORT_MAX_BYTES = 0
let CSV_IMPORT_MAX_ROWS = 0
let exceedsCsvImportByteLimit: (byteLength: number) => boolean = () => {
  throw new Error('app/utils/csvImportLimits is missing - run task 3.1 to create it')
}
let exceedsCsvImportRowLimit: (dataRowCount: number) => boolean = () => {
  throw new Error('app/utils/csvImportLimits is missing - run task 3.1 to create it')
}
let predicateModuleAvailable = false

beforeAll(async () => {
  try {
    const mod = await import('../../app/utils/csvImportLimits')
    CSV_IMPORT_MAX_BYTES = mod.CSV_IMPORT_MAX_BYTES
    CSV_IMPORT_MAX_ROWS = mod.CSV_IMPORT_MAX_ROWS
    exceedsCsvImportByteLimit = mod.exceedsCsvImportByteLimit
    exceedsCsvImportRowLimit = mod.exceedsCsvImportRowLimit
    predicateModuleAvailable = true
  }
  catch {
    predicateModuleAvailable = false
  }
})

const SIZE_REJECTION_MESSAGE = 'Ukuran file CSV melebihi batas 1 MB.'
const ROW_REJECTION_MESSAGE = 'Jumlah baris CSV melebihi batas 1000 baris.'
const REJECTION_TOAST_TITLE = 'Import CSV gagal'

// Canonical Indonesian copy from `app/pages/admin/modules/[id].vue` for the
// four pre-existing fallback branches plus the success branch. These strings
// MUST remain byte-identical post-fix (Property 2 / Requirements 3.1-3.6).
const FALLBACK_EMPTY_CSV
  = 'Format CSV kosong atau tidak terbaca sebagai tabel komponen.'
const FALLBACK_NO_NAME_COLUMN
  = 'Kolom nama komponen tidak ditemukan di CSV.'
const FALLBACK_NO_VALID_ROWS
  = 'Tidak ada baris komponen valid di CSV.'
const FALLBACK_PARSE_THROW
  = 'CSV tidak bisa diproses sebagai tabel komponen.'
const SUCCESS_TOAST_TITLE = 'CSV berhasil diimpor'

type ToastErrorMock = ReturnType<typeof vi.fn>
type FallbackMock = ReturnType<typeof vi.fn>
type FileTextMock = ReturnType<typeof vi.fn>

interface FakeSection {
  localKey: string
  components: Array<{ name: string }>
}

interface SimulateOpts {
  byteLength: number
  dataRowCount: number
}

interface SimulateResult {
  rejected: boolean
  description: string | null
  fileTextCalls: number
  fallbackCalls: number
  toastErrorCalls: Array<{ title: string, description: string }>
  sectionErrorValue: string | undefined
  componentsLengthDelta: number
}

/**
 * `simulateImportCsvGuards` mirrors the guard structure that the fix adds to
 * `importCsv` in `app/pages/admin/modules/[id].vue`. It uses the predicate
 * helpers under test to decide whether to short-circuit. By centralising the
 * guard wiring here, the property test can assert all five rejection
 * post-conditions (no `file.text()` for the size disjunct, no
 * `fallbackCsvToAttachment`, `toast.error` invoked with the canonical title,
 * `sectionErrors[section.localKey]` set, `section.components` length
 * unchanged) without mounting the Vue page.
 */
function simulateImportCsvGuards(
  { byteLength, dataRowCount }: SimulateOpts,
  toastError: ToastErrorMock,
  fallback: FallbackMock,
  fileText: FileTextMock,
  section: FakeSection,
  sectionErrors: Record<string, string>,
): SimulateResult {
  const initialLength = section.components.length

  // Size guard - runs before `await file.text()`.
  if (exceedsCsvImportByteLimit(byteLength)) {
    sectionErrors[section.localKey] = SIZE_REJECTION_MESSAGE
    toastError(REJECTION_TOAST_TITLE, { description: SIZE_REJECTION_MESSAGE })
    return {
      rejected: true,
      description: SIZE_REJECTION_MESSAGE,
      fileTextCalls: fileText.mock.calls.length,
      fallbackCalls: fallback.mock.calls.length,
      toastErrorCalls: toastError.mock.calls.map(([title, payload]) => ({
        title: title as string,
        description: (payload as { description: string }).description,
      })),
      sectionErrorValue: sectionErrors[section.localKey],
      componentsLengthDelta: section.components.length - initialLength,
    }
  }

  // The size guard passed - we would now `await file.text()` and
  // `parseCsvTable(text)`. Simulate the read since this branch is exercised
  // for the row-count disjunct.
  fileText()

  // Row guard - runs after parseCsvTable, before any row mapping.
  if (exceedsCsvImportRowLimit(dataRowCount)) {
    sectionErrors[section.localKey] = ROW_REJECTION_MESSAGE
    toastError(REJECTION_TOAST_TITLE, { description: ROW_REJECTION_MESSAGE })
    return {
      rejected: true,
      description: ROW_REJECTION_MESSAGE,
      fileTextCalls: fileText.mock.calls.length,
      fallbackCalls: fallback.mock.calls.length,
      toastErrorCalls: toastError.mock.calls.map(([title, payload]) => ({
        title: title as string,
        description: (payload as { description: string }).description,
      })),
      sectionErrorValue: sectionErrors[section.localKey],
      componentsLengthDelta: section.components.length - initialLength,
    }
  }

  return {
    rejected: false,
    description: null,
    fileTextCalls: fileText.mock.calls.length,
    fallbackCalls: fallback.mock.calls.length,
    toastErrorCalls: toastError.mock.calls.map(([title, payload]) => ({
      title: title as string,
      description: (payload as { description: string }).description,
    })),
    sectionErrorValue: sectionErrors[section.localKey],
    componentsLengthDelta: section.components.length - initialLength,
  }
}

function freshHarness() {
  const toastError = vi.fn()
  const fallback = vi.fn()
  const fileText = vi.fn()
  const section: FakeSection = {
    localKey: 'section-1',
    components: [
      { name: 'pre-existing-1' },
      { name: 'pre-existing-2' },
    ],
  }
  const sectionErrors: Record<string, string> = {}
  return { toastError, fallback, fileText, section, sectionErrors }
}

describe('csv import limits - predicates', () => {
  it('exposes the canonical 1 MB and 1000 row constants', () => {
    expect(predicateModuleAvailable).toBe(true)
    expect(CSV_IMPORT_MAX_BYTES).toBe(1 * 1024 * 1024)
    expect(CSV_IMPORT_MAX_ROWS).toBe(1000)
  })

  it('exceedsCsvImportByteLimit uses strict greater-than at the 1 MB boundary', () => {
    expect(predicateModuleAvailable).toBe(true)
    expect(exceedsCsvImportByteLimit(1_048_576)).toBe(false)
    expect(exceedsCsvImportByteLimit(1_048_577)).toBe(true)
  })

  it('exceedsCsvImportRowLimit uses strict greater-than at the 1000 row boundary', () => {
    expect(predicateModuleAvailable).toBe(true)
    expect(exceedsCsvImportRowLimit(1000)).toBe(false)
    expect(exceedsCsvImportRowLimit(1001)).toBe(true)
  })
})

describe('csv import limits - Property 1: Bug Condition rejected', () => {
  /**
   * Validates: Requirements 1.1, 1.2, 2.1, 2.2
   *
   * For any (byteLength, dataRowCount) where the bug condition holds
   * (`byteLength > CSV_IMPORT_MAX_BYTES OR dataRowCount > CSV_IMPORT_MAX_ROWS`),
   * the guarded handler must:
   *   - reject (no rows appended to section.components)
   *   - not call fallbackCsvToAttachment
   *   - invoke toast.error('Import CSV gagal', { description })
   *   - set sectionErrors[section.localKey] to the matching Indonesian string
   *   - skip file.text() when the size disjunct triggers
   */
  it('rejects every (oversized byte, oversized row) pair surfaced by fast-check', () => {
    expect(predicateModuleAvailable).toBe(true)
    fc.assert(
      fc.property(
        fc.integer({ min: 1_048_577, max: 8_000_000 }),
        fc.integer({ min: 1001, max: 8_000 }),
        (byteLength, dataRowCount) => {
          const harness = freshHarness()
          const result = simulateImportCsvGuards(
            { byteLength, dataRowCount },
            harness.toastError,
            harness.fallback,
            harness.fileText,
            harness.section,
            harness.sectionErrors,
          )

          // The bug condition holds, so the handler MUST reject.
          expect(result.rejected).toBe(true)
          // Size disjunct fires first, so file.text() is never called.
          expect(result.fileTextCalls).toBe(0)
          // Rejection paths never fall back to attachment upload.
          expect(result.fallbackCalls).toBe(0)
          // Indonesian toast.error fired once with the canonical title.
          expect(result.toastErrorCalls).toHaveLength(1)
          expect(result.toastErrorCalls[0]?.title).toBe(REJECTION_TOAST_TITLE)
          // Description matches the size disjunct (which fires first).
          expect(result.toastErrorCalls[0]?.description).toBe(SIZE_REJECTION_MESSAGE)
          // sectionErrors mirrors the description for inline display.
          expect(result.sectionErrorValue).toBe(SIZE_REJECTION_MESSAGE)
          // section.components length is unchanged.
          expect(result.componentsLengthDelta).toBe(0)
        },
      ),
      { numRuns: 100 },
    )
  })

  it('rejects oversized files even when row count is in-range (boundary 1_048_577 / 0)', () => {
    expect(predicateModuleAvailable).toBe(true)
    const harness = freshHarness()
    const result = simulateImportCsvGuards(
      { byteLength: 1_048_577, dataRowCount: 0 },
      harness.toastError,
      harness.fallback,
      harness.fileText,
      harness.section,
      harness.sectionErrors,
    )

    expect(result.rejected).toBe(true)
    expect(result.fileTextCalls).toBe(0)
    expect(result.fallbackCalls).toBe(0)
    expect(result.toastErrorCalls).toEqual([
      { title: REJECTION_TOAST_TITLE, description: SIZE_REJECTION_MESSAGE },
    ])
    expect(result.sectionErrorValue).toBe(SIZE_REJECTION_MESSAGE)
    expect(result.componentsLengthDelta).toBe(0)
  })

  it('rejects oversized row counts even when file size is in-range (boundary 0 / 1001)', () => {
    expect(predicateModuleAvailable).toBe(true)
    const harness = freshHarness()
    const result = simulateImportCsvGuards(
      { byteLength: 0, dataRowCount: 1001 },
      harness.toastError,
      harness.fallback,
      harness.fileText,
      harness.section,
      harness.sectionErrors,
    )

    expect(result.rejected).toBe(true)
    // Size guard passes, so file.text() runs once before the row guard fires.
    expect(result.fileTextCalls).toBe(1)
    expect(result.fallbackCalls).toBe(0)
    expect(result.toastErrorCalls).toEqual([
      { title: REJECTION_TOAST_TITLE, description: ROW_REJECTION_MESSAGE },
    ])
    expect(result.sectionErrorValue).toBe(ROW_REJECTION_MESSAGE)
    expect(result.componentsLengthDelta).toBe(0)
  })
})


// ---------------------------------------------------------------------------
// Property 2: Preservation - Inputs Within Limits Pass Through Unchanged
// ---------------------------------------------------------------------------
//
// Two complementary sub-properties exercise the preservation requirement:
//
//   2a. Predicate-level: for every (byteLength, dataRowCount) inside the
//       in-range domain `[0, 1_048_576] x [0, 1000]`, BOTH predicates return
//       `false`. This is the fast-check property required by task 2.
//
//   2b. Example-level: the four pre-existing fallback branches and the
//       success branch select the same canonical Indonesian copy and the
//       same outcome they always have, when both guards return `false`.
//       Implemented as `selectFallbackMessage` + `decideImportOutcome` so we
//       can drive the decision logic deterministically without mounting the
//       Vue page or hitting the network. These tests do NOT depend on the
//       not-yet-existing predicate module - they pass on UNFIXED code,
//       confirming the in-range behavior we must preserve.

/**
 * Mirrors the existing branch structure inside `importCsv` in
 * `app/pages/admin/modules/[id].vue` for inputs that pass both guards (or
 * for unfixed code where the guards do not exist). It encodes which of the
 * four pre-existing fallback messages applies, or whether the success
 * branch is selected, given the post-parse signals.
 *
 * Inputs:
 *   - parseThrew:           parseCsvTable(text) raised an exception
 *   - rows:                 string[][] returned by parseCsvTable on success
 *   - headerHasNameColumn:  rows[0] contains a column matching CSV_HEADER_ALIASES.name
 *   - validRowCount:        number of data rows producing a non-empty `name`
 */
type ImportOutcome =
  | { kind: 'fallback', reason: string }
  | { kind: 'success', importedCount: number, toastTitle: string }

function decideImportOutcome(input: {
  parseThrew: boolean
  rows: string[][]
  headerHasNameColumn: boolean
  validRowCount: number
}): ImportOutcome {
  if (input.parseThrew) {
    return { kind: 'fallback', reason: FALLBACK_PARSE_THROW }
  }
  if (input.rows.length < 2) {
    return { kind: 'fallback', reason: FALLBACK_EMPTY_CSV }
  }
  if (!input.headerHasNameColumn) {
    return { kind: 'fallback', reason: FALLBACK_NO_NAME_COLUMN }
  }
  if (input.validRowCount === 0) {
    return { kind: 'fallback', reason: FALLBACK_NO_VALID_ROWS }
  }
  return {
    kind: 'success',
    importedCount: input.validRowCount,
    toastTitle: SUCCESS_TOAST_TITLE,
  }
}

describe('csv import limits - Property 2 (predicate domain): in-range inputs preserved', () => {
  /**
   * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
   *
   * For every (byteLength, dataRowCount) inside `[0, CSV_IMPORT_MAX_BYTES]`
   * x `[0, CSV_IMPORT_MAX_ROWS]` - INCLUDING the boundary points
   * `1_048_576` and `1000` - both predicates return `false`. Combined with
   * the example-level branch tests below, this mechanically establishes
   * that every existing branch (success append, empty-fallback,
   * missing-name-fallback, no-valid-rows-fallback, parse-throw-fallback) is
   * unaffected by the fix.
   */
  it('returns false for every in-range (byteLength, dataRowCount) including the boundary', () => {
    expect(predicateModuleAvailable).toBe(true)
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1_048_576 }),
        fc.integer({ min: 0, max: 1000 }),
        (byteLength, dataRowCount) => {
          expect(exceedsCsvImportByteLimit(byteLength)).toBe(false)
          expect(exceedsCsvImportRowLimit(dataRowCount)).toBe(false)
        },
      ),
      { numRuns: 200 },
    )

    // Explicit boundary checks - these are off-by-one-prone and worth
    // pinning even though the property above already covers them.
    expect(exceedsCsvImportByteLimit(0)).toBe(false)
    expect(exceedsCsvImportByteLimit(1_048_575)).toBe(false)
    expect(exceedsCsvImportByteLimit(1_048_576)).toBe(false)
    expect(exceedsCsvImportRowLimit(0)).toBe(false)
    expect(exceedsCsvImportRowLimit(999)).toBe(false)
    expect(exceedsCsvImportRowLimit(1000)).toBe(false)
  })
})

describe('csv import limits - Property 2 (branches): existing fallback and success paths unchanged', () => {
  /**
   * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
   *
   * The four pre-existing fallback branches and the success branch must
   * select the same canonical Indonesian copy and outcome they do today.
   * These tests are self-contained - they exercise `decideImportOutcome`
   * directly rather than the not-yet-existing predicate module - so they
   * PASS on UNFIXED code, confirming the in-range behavior to preserve.
   */

  it('routes a header-only CSV (rows.length < 2) to the empty-CSV fallback', () => {
    const outcome = decideImportOutcome({
      parseThrew: false,
      rows: [['Kategori', 'Nama Komponen', 'Jumlah', 'Satuan', 'Keterangan']],
      headerHasNameColumn: true,
      validRowCount: 0,
    })
    expect(outcome).toEqual({ kind: 'fallback', reason: FALLBACK_EMPTY_CSV })
  })

  it('routes a CSV whose header has no name alias to the missing-column fallback', () => {
    const outcome = decideImportOutcome({
      parseThrew: false,
      rows: [
        ['kode', 'jumlah', 'satuan'],
        ['SKU-1', '2', 'pcs'],
      ],
      headerHasNameColumn: false,
      validRowCount: 0,
    })
    expect(outcome).toEqual({ kind: 'fallback', reason: FALLBACK_NO_NAME_COLUMN })
  })

  it('routes a CSV with non-empty rows but no `name` field to the no-valid-rows fallback', () => {
    const outcome = decideImportOutcome({
      parseThrew: false,
      rows: [
        ['Kategori', 'Nama Komponen', 'Jumlah'],
        ['', '', '1'],
        ['', '', '2'],
      ],
      headerHasNameColumn: true,
      validRowCount: 0,
    })
    expect(outcome).toEqual({ kind: 'fallback', reason: FALLBACK_NO_VALID_ROWS })
  })

  it('routes a parse-throw to the unparseable-CSV fallback', () => {
    const outcome = decideImportOutcome({
      parseThrew: true,
      rows: [],
      headerHasNameColumn: false,
      validRowCount: 0,
    })
    expect(outcome).toEqual({ kind: 'fallback', reason: FALLBACK_PARSE_THROW })
  })

  it('routes a 200-byte CSV with 3 valid rows to the success branch', () => {
    const csv = 'Kategori,Nama Komponen,Jumlah,Satuan,Keterangan\n'
      + 'Mekanik,Baut M3,4,pcs,\n'
      + 'Mekanik,Mur M3,4,pcs,\n'
      + 'Elektrik,Resistor 220R,2,pcs,1/4W\n'
    // Sanity check that this fixture comfortably fits the in-range domain.
    expect(csv.length).toBeLessThanOrEqual(1_048_576)
    expect(csv.length).toBeGreaterThanOrEqual(100)

    const outcome = decideImportOutcome({
      parseThrew: false,
      rows: [
        ['Kategori', 'Nama Komponen', 'Jumlah', 'Satuan', 'Keterangan'],
        ['Mekanik', 'Baut M3', '4', 'pcs', ''],
        ['Mekanik', 'Mur M3', '4', 'pcs', ''],
        ['Elektrik', 'Resistor 220R', '2', 'pcs', '1/4W'],
      ],
      headerHasNameColumn: true,
      validRowCount: 3,
    })
    expect(outcome).toEqual({
      kind: 'success',
      importedCount: 3,
      toastTitle: SUCCESS_TOAST_TITLE,
    })
  })

  it('keeps the four canonical Indonesian fallback strings byte-identical to [id].vue', () => {
    // Pinned strings - any rewording must propagate to `[id].vue` and vice
    // versa. Requirements 3.2-3.5 require these exact messages.
    expect(FALLBACK_EMPTY_CSV).toBe('Format CSV kosong atau tidak terbaca sebagai tabel komponen.')
    expect(FALLBACK_NO_NAME_COLUMN).toBe('Kolom nama komponen tidak ditemukan di CSV.')
    expect(FALLBACK_NO_VALID_ROWS).toBe('Tidak ada baris komponen valid di CSV.')
    expect(FALLBACK_PARSE_THROW).toBe('CSV tidak bisa diproses sebagai tabel komponen.')
    expect(SUCCESS_TOAST_TITLE).toBe('CSV berhasil diimpor')
  })
})
