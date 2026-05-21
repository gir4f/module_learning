export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE'

export type AuditEntityType = 'MODULE' | 'MODULE_DETAIL' | 'COMPONENT_ITEM' | 'ATTACHMENT'

export interface AuditEntry {
  id: string
  action: AuditAction
  entityType: AuditEntityType
  entityId: string
  entityLabel: string
  actorId: string | null
  actorEmail: string
  actorName: string | null
  createdAt: string
}

export interface AuditLogListResponse {
  items: AuditEntry[]
  nextCursor: string | null
}

export interface AuditListFilters {
  entityType: AuditEntityType | 'ALL'
  actorId: string | 'ALL'
  dateFrom: string | null
  dateTo: string | null
}
