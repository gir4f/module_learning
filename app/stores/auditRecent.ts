import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuditEntry, AuditLogListResponse } from '~/types/audit'
import { shouldRefreshAuditRecent } from '~/utils/auditClient'
import { useApiClient } from '~/composables/useApiClient'

export const useAuditRecentStore = defineStore('audit-recent', () => {
  const items = ref<AuditEntry[]>([])
  const loading = ref(false)
  const error = ref(false)
  const lastFetchedAt = ref<number | null>(null)
  const refreshQueued = ref(false)

  async function runFetchRecent(limit = 20) {
    loading.value = true
    error.value = false
    try {
      const api = useApiClient()
      const { data } = await api.get<AuditLogListResponse>('/api/audit-logs', { params: { limit } })
      items.value = data.items
      lastFetchedAt.value = Date.now()
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }

  async function fetchRecent(limit = 20) {
    if (loading.value) {
      refreshQueued.value = true
      return
    }

    do {
      refreshQueued.value = false
      await runFetchRecent(limit)
    } while (refreshQueued.value)
  }

  async function refreshIfStale(limit = 20) {
    if (!items.value.length || shouldRefreshAuditRecent(lastFetchedAt.value)) {
      await fetchRecent(limit)
    }
  }

  function triggerBackgroundRefresh(limit = 20) {
    void fetchRecent(limit)
  }

  function resetState() {
    items.value = []
    loading.value = false
    error.value = false
    lastFetchedAt.value = null
    refreshQueued.value = false
  }

  return {
    items,
    loading,
    error,
    lastFetchedAt,
    fetchRecent,
    refreshIfStale,
    triggerBackgroundRefresh,
    resetState,
  }
})
