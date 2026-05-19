/**
 * Client-side limits for the admin CSV import handler in
 * `app/pages/admin/modules/[id].vue`. Mirrors the server-side guard pattern
 * from `server/api/uploads.post.ts` for the narrower CSV-table data shape.
 *
 * The limits are intentionally tight because the CSV is fully buffered and
 * parsed in the browser tab before any validation runs.
 */
export const CSV_IMPORT_MAX_BYTES = 1 * 1024 * 1024
export const CSV_IMPORT_MAX_ROWS = 1000

/**
 * Returns `true` when the selected file exceeds the 1 MB CSV import budget.
 * Uses strict greater-than so the boundary value (1,048,576 bytes) is allowed.
 */
export function exceedsCsvImportByteLimit(byteLength: number): boolean {
  return byteLength > CSV_IMPORT_MAX_BYTES
}

/**
 * Returns `true` when the parsed CSV has more than 1000 data rows
 * (`rows.length - 1`, i.e. excluding the header). Strict greater-than so a
 * CSV with exactly 1000 data rows is allowed.
 */
export function exceedsCsvImportRowLimit(dataRowCount: number): boolean {
  return dataRowCount > CSV_IMPORT_MAX_ROWS
}
