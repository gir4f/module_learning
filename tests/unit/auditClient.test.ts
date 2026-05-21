import { describe, expect, it, vi } from 'vitest'
import type { AuditEntry, AuditListFilters } from '../../app/types/audit'
import {
  AUDIT_RECENT_STALE_MS,
  fetchAllAuditEntries,
  filterAuditEntries,
  paginateAuditEntries,
  shouldRefreshAuditRecent,
  shouldResetAuditPagination,
} from '../../app/utils/auditClient'

function makeEntry(id: string, overrides: Partial<AuditEntry> = {}): AuditEntry {
  return {
    id,
    action: 'CREATE',
    entityType: 'MODULE',
    entityId: `entity-${id}`,
    entityLabel: `Label ${id}`,
    actorId: 'admin-1',
    actorEmail: 'admin@example.com',
    actorName: 'Admin',
    createdAt: '2026-05-21T10:00:00.000Z',
    ...overrides,
  }
}

describe('fetchAllAuditEntries', () => {
  it('merges all cursor pages in order until nextCursor is null', async () => {
    const fetchPage = vi.fn()
      .mockResolvedValueOnce({
        items: [makeEntry('1'), makeEntry('2')],
        nextCursor: 'cursor-2',
      })
      .mockResolvedValueOnce({
        items: [makeEntry('3')],
        nextCursor: null,
      })

    const items = await fetchAllAuditEntries(fetchPage, 100)

    expect(items.map(item => item.id)).toEqual(['1', '2', '3'])
    expect(fetchPage).toHaveBeenNthCalledWith(1, { limit: 100 })
    expect(fetchPage).toHaveBeenNthCalledWith(2, { limit: 100, cursor: 'cursor-2' })
  })
})

describe('shouldRefreshAuditRecent', () => {
  it('returns true when data has never been fetched', () => {
    expect(shouldRefreshAuditRecent(null, 1000)).toBe(true)
  })

  it('returns false when data is still fresh', () => {
    expect(shouldRefreshAuditRecent(1_000, 1_000 + AUDIT_RECENT_STALE_MS - 1)).toBe(false)
  })

  it('returns true when data is stale', () => {
    expect(shouldRefreshAuditRecent(1_000, 1_000 + AUDIT_RECENT_STALE_MS)).toBe(true)
  })
})

describe('audit page client helpers', () => {
  it('filters entries on the client by entity type and actor', () => {
    const entries = [
      makeEntry('1', { entityType: 'MODULE', actorId: 'admin-1' }),
      makeEntry('2', { entityType: 'ATTACHMENT', actorId: 'admin-1' }),
      makeEntry('3', { entityType: 'ATTACHMENT', actorId: 'admin-2' }),
    ]
    const filters: AuditListFilters = { entityType: 'ATTACHMENT', actorId: 'admin-1' }

    expect(filterAuditEntries(entries, filters).map(entry => entry.id)).toEqual(['2'])
  })

  it('paginates filtered entries using first-row slicing', () => {
    const entries = [makeEntry('1'), makeEntry('2'), makeEntry('3'), makeEntry('4')]
    expect(paginateAuditEntries(entries, 2, 2).map(entry => entry.id)).toEqual(['3', '4'])
  })

  it('signals pagination reset when filters change', () => {
    expect(shouldResetAuditPagination(
      { entityType: 'ALL', actorId: 'ALL' },
      { entityType: 'MODULE', actorId: 'ALL' },
    )).toBe(true)
  })

  it('does not reset pagination when filters stay the same', () => {
    expect(shouldResetAuditPagination(
      { entityType: 'ATTACHMENT', actorId: 'admin-1' },
      { entityType: 'ATTACHMENT', actorId: 'admin-1' },
    )).toBe(false)
  })
})
