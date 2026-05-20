import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AuditEntry {
  id: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  entityType: 'MODULE' | 'MODULE_DETAIL' | 'COMPONENT_ITEM' | 'ATTACHMENT'
  entityId: string
  entityLabel: string
  actorId: string | null
  actorEmail: string
  actorName: string | null
  createdAt: string // ISO 8601
}

export interface AuditLogListResponse {
  items: AuditEntry[]
  nextCursor: string | null
}

export const useAuditLogStore = defineStore('audit-log', () => {
  const items = ref<AuditEntry[]>([])
  const nextCursor = ref<string | null>(null)
  const loading = ref(false)
  const error = ref(false)

  async function fetchRecent(limit = 20) {
    loading.value = true
    error.value = false
    try {
      const data = await $fetch<AuditLogListResponse>('/api/audit-logs', { params: { limit } })
      items.value = data.items
      nextCursor.value = data.nextCursor
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }

  async function fetchPage(limit = 50) {
    loading.value = true
    error.value = false
    try {
      const params: Record<string, unknown> = { limit }
      if (nextCursor.value) params.cursor = nextCursor.value
      const data = await $fetch<AuditLogListResponse>('/api/audit-logs', { params })
      items.value = [...items.value, ...data.items]
      nextCursor.value = data.nextCursor
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }

  async function applyFilters(filters: { entityType?: string; actorId?: string }) {
    items.value = []
    nextCursor.value = null
    loading.value = true
    error.value = false
    try {
      const params: Record<string, unknown> = { limit: 50, ...filters }
      const data = await $fetch<AuditLogListResponse>('/api/audit-logs', { params })
      items.value = data.items
      nextCursor.value = data.nextCursor
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }

  function resetState() {
    items.value = []
    nextCursor.value = null
    loading.value = false
    error.value = false
  }

  return { items, nextCursor, loading, error, fetchRecent, fetchPage, applyFilters, resetState }
})
