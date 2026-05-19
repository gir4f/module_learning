import { defineStore } from 'pinia'
import type { LearningModule } from '~/types/learning'
import { apiErrorMessage } from '~/utils/apiErrors'

export const useLearningModulesStore = defineStore('learning-modules', () => {
  const modules = ref<LearningModule[]>([])
  const currentModule = ref<LearningModule | null>(null)
  const currentModuleKey = ref('')
  const pending = ref(false)
  const pendingDetail = ref(false)
  const error = ref('')
  const detailError = ref('')
  const loaded = ref(false)

  function replaceModule(id: string, module: LearningModule) {
    const index = modules.value.findIndex(item => item.id === id)
    if (index === -1) modules.value = [module, ...modules.value]
    else modules.value.splice(index, 1, module)
  }

  function upsertModule(module: LearningModule) {
    if (module.id) replaceModule(module.id, module)
    else modules.value = [module, ...modules.value]
  }

  function setCurrentModule(module: LearningModule | null) {
    currentModule.value = module
    currentModuleKey.value = module?.id || module?.slug || ''
  }

  async function fetchModules() {
    pending.value = true
    error.value = ''
    try {
      const api = useApiClient()
      const { data } = await api.get<LearningModule[]>('/api/modules')
      modules.value = data
      loaded.value = true
      return data
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to load modules.')
      return []
    } finally {
      pending.value = false
    }
  }

  async function ensureModules() {
    if (loaded.value) return modules.value
    return fetchModules()
  }

  async function fetchModuleBySlug(slug: string) {
    pendingDetail.value = true
    detailError.value = ''
    currentModuleKey.value = slug
    try {
      const api = useApiClient()
      const { data } = await api.get<LearningModule>(`/api/modules/${slug}`)
      setCurrentModule(data)
      upsertModule(data)
      return data
    } catch (err) {
      setCurrentModule(null)
      detailError.value = apiErrorMessage(err, 'Failed to load module.')
      return null
    } finally {
      pendingDetail.value = false
    }
  }

  return {
    modules,
    currentModule,
    pending,
    pendingDetail,
    error,
    detailError,
    loaded,
    replaceModule,
    upsertModule,
    setCurrentModule,
    fetchModules,
    ensureModules,
    fetchModuleBySlug,
  }
})
