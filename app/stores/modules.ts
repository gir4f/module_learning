import { defineStore } from 'pinia'
import type { LearningModule } from '~/types/learning'
import { apiErrorMessage } from '~/utils/apiErrors'

export const useModulesStore = defineStore('modules', () => {
  const modules = ref<LearningModule[]>([])
  const pending = ref(false)
  const error = ref('')

  function replaceModule(id: string, module: LearningModule) {
    const index = modules.value.findIndex(item => item.id === id)
    if (index === -1) modules.value = [module, ...modules.value]
    else modules.value.splice(index, 1, module)
  }

  function upsertModule(module: LearningModule) {
    if (module.id) replaceModule(module.id, module)
    else modules.value = [module, ...modules.value]
  }

  function removeModule(id: string) {
    modules.value = modules.value.filter(module => module.id !== id)
  }

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
    upsertModule(module)
    return module
  }

  async function updateModule(id: string, payload: Partial<LearningModule>) {
    const api = useApiClient()
    const { data: module } = await api.patch<LearningModule>(`/api/modules/${id}`, payload)
    replaceModule(id, module)
    return module
  }

  async function deleteModule(id: string) {
    const api = useApiClient()
    await api.delete(`/api/modules/${id}`)
    removeModule(id)
  }

  return {
    modules,
    pending,
    error,
    replaceModule,
    upsertModule,
    removeModule,
    fetchModules,
    createModule,
    updateModule,
    deleteModule,
  }
})
