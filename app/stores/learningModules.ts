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
  const dirty = ref(false)
  const detailDirtyKeys = ref<string[]>([])

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
    currentModuleKey.value = module?.slug || module?.id || ''
  }

  function clearCurrentModule() {
    setCurrentModule(null)
  }

  function uniqueKeys(keys: Array<string | null | undefined>) {
    return Array.from(new Set(keys.filter((key): key is string => Boolean(key))))
  }

  function invalidateModules() {
    dirty.value = true
  }

  function invalidateModule(...keys: Array<string | null | undefined>) {
    for (const key of uniqueKeys(keys)) {
      if (!detailDirtyKeys.value.includes(key)) detailDirtyKeys.value.push(key)
    }
    dirty.value = true
  }

  function clearDirtyKeys(...keys: Array<string | null | undefined>) {
    const resolved = uniqueKeys(keys)
    if (!resolved.length) return
    detailDirtyKeys.value = detailDirtyKeys.value.filter(key => !resolved.includes(key))
  }

  function isModuleDirty(...keys: Array<string | null | undefined>) {
    return uniqueKeys(keys).some(key => detailDirtyKeys.value.includes(key))
  }

  async function fetchModules() {
    pending.value = true
    error.value = ''
    try {
      const api = useApiClient()
      const { data } = await api.get<LearningModule[]>('/api/modules')
      modules.value = data
      loaded.value = true
      dirty.value = false
      return data
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to load modules.')
      return []
    } finally {
      pending.value = false
    }
  }

  async function ensureModules(options: { force?: boolean } = {}) {
    if (!options.force && loaded.value && !dirty.value) return modules.value
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
      clearDirtyKeys(slug, data.id, data.slug)
      return data
    } catch (err) {
      clearCurrentModule()
      detailError.value = apiErrorMessage(err, 'Failed to load module.')
      return null
    } finally {
      pendingDetail.value = false
    }
  }

  async function ensureModuleBySlug(slug: string, options: { force?: boolean } = {}) {
    const activeModule = currentModule.value
    const currentKeys = [slug, activeModule?.id, activeModule?.slug, currentModuleKey.value]
    if (
      !options.force
      && activeModule
      && activeModule.slug === slug
      && !isModuleDirty(...currentKeys)
    ) {
      return activeModule
    }

    return fetchModuleBySlug(slug)
  }

  function resetState() {
    modules.value = []
    currentModule.value = null
    currentModuleKey.value = ''
    pending.value = false
    pendingDetail.value = false
    error.value = ''
    detailError.value = ''
    loaded.value = false
    dirty.value = false
    detailDirtyKeys.value = []
  }

  return {
    modules,
    currentModule,
    pending,
    pendingDetail,
    error,
    detailError,
    loaded,
    dirty,
    detailDirtyKeys,
    replaceModule,
    upsertModule,
    setCurrentModule,
    clearCurrentModule,
    invalidateModules,
    invalidateModule,
    fetchModules,
    ensureModules,
    fetchModuleBySlug,
    ensureModuleBySlug,
    resetState,
  }
})
