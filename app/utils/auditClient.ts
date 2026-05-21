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

export function filterAuditEntries(entries: AuditEntry[], filters: AuditListFilters): AuditEntry[] {
  return entries.filter((entry) => {
    const matchesEntityType = filters.entityType === 'ALL' || entry.entityType === filters.entityType
    const matchesActor = filters.actorId === 'ALL' || entry.actorId === filters.actorId
    return matchesEntityType && matchesActor
  })
}

export function paginateAuditEntries(entries: AuditEntry[], firstRow: number, rows: number): AuditEntry[] {
  return entries.slice(firstRow, firstRow + rows)
}

export function shouldResetAuditPagination(
  previous: AuditListFilters,
  next: AuditListFilters,
): boolean {
  return previous.entityType !== next.entityType || previous.actorId !== next.actorId
}
