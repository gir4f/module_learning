import { defineStore } from 'pinia'
import type { LearningModule } from '~/types/learning'
import { apiErrorMessage } from '~/utils/apiErrors'

export const useModulesStore = defineStore('modules', () => {
  const modules = ref<LearningModule[]>([])
  const pending = ref(false)
  const error = ref('')

  async function fetchModules(search = '') {
    pending.value = true
    error.value = ''
    try {
      const api = useApiClient()
      const { data } = await api.get<LearningModule[]>('/api/modules', {
        params: search ? { search } : undefined,
      })
      modules.value = data
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to load modules.')
    } finally {
      pending.value = false
    }
  }

  async function createModule(payload: Partial<LearningModule>) {
    const api = useApiClient()
    const { data: module } = await api.post<LearningModule>('/api/modules', payload)
    modules.value = [module, ...modules.value]
    return module
  }

  async function updateModule(id: string, payload: Partial<LearningModule>) {
    const api = useApiClient()
    const { data: module } = await api.patch<LearningModule>(`/api/modules/${id}`, payload)
    modules.value = modules.value.map((item) => item.id === id ? module : item)
    return module
  }

  async function deleteModule(id: string) {
    const api = useApiClient()
    await api.delete(`/api/modules/${id}`)
    modules.value = modules.value.filter((module) => module.id !== id)
  }

  return {
    modules,
    pending,
    error,
    fetchModules,
    createModule,
    updateModule,
    deleteModule,
  }
})
