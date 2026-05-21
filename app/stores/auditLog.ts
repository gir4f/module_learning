import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuditEntry, AuditLogListResponse } from '~/types/audit'
import { fetchAllAuditEntries } from '~/utils/auditClient'
import { useApiClient } from '~/composables/useApiClient'

export const useAuditLogStore = defineStore('audit-log', () => {
  const items = ref<AuditEntry[]>([])
  const loading = ref(false)
  const error = ref(false)

  async function fetchAll(limit = 100) {
    loading.value = true
    error.value = false
    try {
      const api = useApiClient()
      items.value = await fetchAllAuditEntries(
        async (params) => {
          const { data } = await api.get<AuditLogListResponse>('/api/audit-logs', { params })
          return data
        },
        limit,
      )
    } catch {
      items.value = []
      error.value = true
    } finally {
      loading.value = false
    }
  }

  function resetState() {
    items.value = []
    loading.value = false
    error.value = false
  }

  return { items, loading, error, fetchAll, resetState }
})
