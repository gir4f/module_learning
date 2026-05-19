/**
 * Pure TypeScript CSV utility module — no Vue/Nuxt/Pinia/PrimeVue imports.
 * All functions are safe to import in Vitest without a Nuxt test environment.
 *
 * Moved verbatim from `app/pages/admin/modules/[id].vue`.
 * New functions (`levenshteinDistance`, `resolveCsvColumnIndex`) are added here
 * as part of the csv-header-fuzzy-matching feature.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const CSV_EXPORT_HEADERS = ['Kategori', 'Nama Komponen', 'Jumlah', 'Satuan', 'Keterangan']

export const CSV_HEADER_ALIASES = {
  category: ['kategori', 'category', 'jenis'],
  name: ['nama', 'nama komponen', 'komponen', 'part', 'part name', 'item', 'barang'],
  quantity: ['jumlah', 'qty', 'quantity', 'banyak', 'kuantitas'],
  unit: ['satuan', 'unit', 'uom'],
  note: ['keterangan', 'note', 'catatan', 'remarks'],
} as const

// ---------------------------------------------------------------------------
// Moved functions (verbatim from [id].vue)
// ---------------------------------------------------------------------------

export function parseCsvTable(text: string) {
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const firstLine = normalized.split('\n').find(line => line.trim().length) || ''
  const delimiter = detectCsvDelimiter(firstLine)
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index]
    const nextChar = normalized[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === delimiter && !inQuotes) {
      row.push(field)
      field = ''
      continue
    }

    if (char === '\n' && !inQuotes) {
      row.push(field)
      if (row.some(cell => cell.trim().length)) rows.push(row.map(cell => cell.trim()))
      row = []
      field = ''
      continue
    }

    field += char
  }

  if (field.length || row.length) {
    row.push(field)
    if (row.some(cell => cell.trim().length)) rows.push(row.map(cell => cell.trim()))
  }

  return rows
}

export function detectCsvDelimiter(line: string) {
  const delimiters = [',', ';', '\t'] as const
  let winner = ','
  let bestCount = -1

  for (const delimiter of delimiters) {
    const count = line.split(delimiter).length
    if (count > bestCount) {
      bestCount = count
      winner = delimiter
    }
  }

  return winner
}

export function normalizeCsvHeader(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
}

export function getCsvCell(row: string[], index: number) {
  if (index < 0) return ''
  return row[index]?.trim() || ''
}

export function escapeCsvField(value: string) {
  return `"${String(value).replace(/"/g, '""')}"`
}

// ---------------------------------------------------------------------------
// Stubs — filled in by tasks 1.2 and 1.3
// ---------------------------------------------------------------------------

/**
 * Computes the Levenshtein edit distance between two strings using the
 * Wagner–Fischer two-row DP algorithm. O(n×m) time, O(min(n,m)) space.
 * No external dependencies.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  // Ensure `a` is the shorter string to minimize the inner array size
  if (a.length > b.length) {
    const tmp = a
    a = b
    b = tmp
  }

  // prev[j] = edit distance between a[0..i-1] and b[0..j-1]
  const prev: number[] = Array.from({ length: b.length + 1 }, (_, j) => j)
  const curr: number[] = new Array<number>(b.length + 1).fill(0)

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        curr[j] = prev[j - 1]! // no operation
      } else {
        curr[j] = 1 + Math.min(
          prev[j]!,    // deletion
          curr[j - 1]!, // insertion
          prev[j - 1]!, // substitution
        )
      }
    }
    // Swap rows: copy curr into prev for next iteration
    for (let j = 0; j <= b.length; j++) {
      prev[j] = curr[j]!
    }
  }

  return prev[b.length]!
}

/**
 * Resolves the best-matching column index from `headers` for the given `aliases`.
 *
 * Scoring tiers (highest wins):
 *   4 — exact match after normalization
 *   3 — one string contains the other
 *   2 — any whitespace-split word of the header is contained by / contains the alias
 *   1 — Levenshtein distance ≤ fuzzyThreshold (only when bestScore < 2)
 *   0 — no match → returns -1
 *
 * Tie-breaking for score-1: prefer lower edit distance; equal distance → lower column index.
 */
export function resolveCsvColumnIndex(headers: string[], aliases: readonly string[]): number {
  const normalizedHeaders = headers.map(normalizeCsvHeader)

  let bestScore = 0
  let bestIndex = -1
  let bestEditDist = Infinity // used only for tier-1 tie-breaking

  for (let colIndex = 0; colIndex < normalizedHeaders.length; colIndex++) {
    const header = normalizedHeaders[colIndex]!

    for (const alias of aliases) {
      const normalizedAlias = normalizeCsvHeader(alias)

      // Tiers 4 → 3 → 2
      let score = 0
      let dist = Infinity

      if (header === normalizedAlias) {
        score = 4
      } else if (header.includes(normalizedAlias) || normalizedAlias.includes(header)) {
        score = 3
      } else if (header.split(' ').some(part => normalizedAlias.includes(part) || part.includes(normalizedAlias))) {
        score = 2
      }

      // Tier 1 (fuzzy) — only when no score ≥ 2 found anywhere yet
      if (score === 0 && bestScore < 2) {
        const threshold = Math.max(2, Math.floor(normalizedAlias.length * 0.3))
        dist = levenshteinDistance(header, normalizedAlias)
        if (dist <= threshold) {
          score = 1
        }
      }

      // Update best
      if (score > bestScore) {
        bestScore = score
        bestIndex = colIndex
        bestEditDist = score === 1 ? dist : Infinity
      } else if (score === 1 && score === bestScore) {
        // Tie-break: prefer lower edit distance, then lower column index
        if (dist < bestEditDist) {
          bestIndex = colIndex
          bestEditDist = dist
        }
        // if dist === bestEditDist: keep existing bestIndex (lower colIndex wins
        // because we iterate headers left-to-right and only update on strict <)
      }
    }
  }

  return bestIndex // -1 when bestScore === 0
}
