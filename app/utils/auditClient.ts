import type { AuditEntry, AuditListFilters, AuditLogListResponse } from '~/types/audit'

export type AuditPageFetcher = (params: Record<string, unknown>) => Promise<AuditLogListResponse>

export const AUDIT_RECENT_STALE_MS = 15_000

export async function fetchAllAuditEntries(
  fetchPage: AuditPageFetcher,
  limit = 100,
): Promise<AuditEntry[]> {
  const items: AuditEntry[] = []
  let cursor: string | null = null

  do {
    const params: Record<string, unknown> = { limit }
    if (cursor) params.cursor = cursor

    const page = await fetchPage(params)
    items.push(...page.items)
    cursor = page.nextCursor
  } while (cursor)

  return items
}

export function shouldRefreshAuditRecent(
  lastFetchedAt: number | null,
  now = Date.now(),
  staleMs = AUDIT_RECENT_STALE_MS,
): boolean {
  if (!lastFetchedAt) return true
  return now - lastFetchedAt >= staleMs
}

export function getAuditDayKey(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ''

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const year = parts.find(part => part.type === 'year')?.value || '0000'
  const month = parts.find(part => part.type === 'month')?.value || '00'
  const day = parts.find(part => part.type === 'day')?.value || '00'

  return `${year}-${month}-${day}`
}

export function filterAuditEntries(entries: AuditEntry[], filters: AuditListFilters): AuditEntry[] {
  return entries.filter((entry) => {
    const matchesEntityType = filters.entityType === 'ALL' || entry.entityType === filters.entityType
    const matchesActor = filters.actorId === 'ALL' || entry.actorId === filters.actorId
    const hasDateFilter = Boolean(filters.dateFrom || filters.dateTo)
    const entryDayKey = hasDateFilter ? getAuditDayKey(entry.createdAt) : ''
    const matchesDateFrom = !filters.dateFrom || (!!entryDayKey && entryDayKey >= filters.dateFrom)
    const matchesDateTo = !filters.dateTo || (!!entryDayKey && entryDayKey <= filters.dateTo)

    return matchesEntityType && matchesActor && matchesDateFrom && matchesDateTo
  })
}

export function paginateAuditEntries(entries: AuditEntry[], firstRow: number, rows: number): AuditEntry[] {
  return entries.slice(firstRow, firstRow + rows)
}

export function shouldResetAuditPagination(
  previous: AuditListFilters,
  next: AuditListFilters,
): boolean {
  return previous.entityType !== next.entityType
    || previous.actorId !== next.actorId
    || previous.dateFrom !== next.dateFrom
    || previous.dateTo !== next.dateTo
}
