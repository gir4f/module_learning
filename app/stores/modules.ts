import { defineStore } from 'pinia'
import type { Attachment, ComponentItem, LearningModule, ModuleDetail, PublishStatus } from '~/types/learning'
import { useLearningModulesStore } from '~/stores/learningModules'
import { apiErrorMessage } from '~/utils/apiErrors'
import { attachmentTypeFromMimeType, normalizedUploadMimeType, uploadFile } from '~/utils/upload'

export type ModuleSectionPayload = {
  title: string
  summary: string | null
  keywords: string | null
  sortOrder: number
  components: Array<{
    category: string | null
    name: string
    quantity: string
    unit: string
    note: string | null
    sortOrder: number
  }>
}

export type ModuleAttachmentPayload = Pick<Attachment, 'type' | 'title' | 'url' | 'sortOrder'> & {
  filePath?: string | null
  mimeType?: string | null
  sizeBytes?: number | null
}

export type BulkModuleMutationResult = {
  requestedCount: number
  affectedCount: number
  missingIds: string[]
}

export const useModulesStore = defineStore('modules', () => {
  const modules = ref<LearningModule[]>([])
  const currentModule = ref<LearningModule | null>(null)
  const currentModuleKey = ref('')
  const pendingList = ref(false)
  const pendingDetail = ref(false)
  const pendingMutation = ref(false)
  const listError = ref('')
  const detailError = ref('')

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

  function setCurrentModule(module: LearningModule | null) {
    currentModule.value = module
    currentModuleKey.value = module?.id || ''
  }

  function invalidateLearnerModules(module?: LearningModule | null) {
    const learningStore = useLearningModulesStore()
    learningStore.invalidateModules()
    learningStore.invalidateModule(
      module?.id,
      module?.slug,
      currentModule.value?.id,
      currentModule.value?.slug,
    )
  }

  function uniqueIds(ids: string[]) {
    return Array.from(new Set(ids.filter(Boolean)))
  }

  function invalidateLearnerModulesByKeys(keys: Array<string | null | undefined>) {
    const learningStore = useLearningModulesStore()
    learningStore.invalidateModules()
    learningStore.invalidateModule(
      ...keys,
    )
  }

  async function fetchModules(search = '') {
    pendingList.value = true
    listError.value = ''
    try {
      const api = useApiClient()
      const { data } = await api.get<LearningModule[]>('/api/modules', {
        params: search ? { search } : undefined,
      })
      modules.value = data
      return data
    } catch (err) {
      listError.value = apiErrorMessage(err, 'Failed to load modules.')
      return []
    } finally {
      pendingList.value = false
    }
  }

  async function fetchModuleById(id: string) {
    pendingDetail.value = true
    detailError.value = ''
    currentModuleKey.value = id
    try {
      const api = useApiClient()
      const { data } = await api.get<LearningModule>(`/api/modules/${id}`)
      currentModule.value = data
      if (data.id) replaceModule(data.id, data)
      return data
    } catch (err) {
      currentModule.value = null
      detailError.value = apiErrorMessage(err, 'Failed to load module.')
      return null
    } finally {
      pendingDetail.value = false
    }
  }

  async function refreshCurrentModule() {
    const targetId = currentModule.value?.id || currentModuleKey.value
    if (!targetId) return null
    return fetchModuleById(targetId)
  }

  async function createModule(payload: Partial<LearningModule>) {
    pendingMutation.value = true
    try {
      const api = useApiClient()
      const { data: module } = await api.post<LearningModule>('/api/modules', payload)
      setCurrentModule(module)
      upsertModule(module)
      invalidateLearnerModules(module)
      return module
    } finally {
      pendingMutation.value = false
    }
  }

  async function updateModule(id: string, payload: Partial<LearningModule>) {
    pendingMutation.value = true
    try {
      const api = useApiClient()
      const { data: module } = await api.patch<LearningModule>(`/api/modules/${id}`, payload)
      if (currentModule.value?.id === id || currentModuleKey.value === id) {
        setCurrentModule(module)
      }
      replaceModule(id, module)
      invalidateLearnerModules(module)
      return module
    } finally {
      pendingMutation.value = false
    }
  }

  async function deleteModule(id: string) {
    pendingMutation.value = true
    try {
      const deletedModule = currentModule.value?.id === id
        ? currentModule.value
        : modules.value.find(module => module.id === id) || null
      const api = useApiClient()
      await api.delete(`/api/modules/${id}`)
      if (currentModule.value?.id === id || currentModuleKey.value === id) {
        setCurrentModule(null)
      }
      removeModule(id)
      invalidateLearnerModules(deletedModule)
    } finally {
      pendingMutation.value = false
    }
  }

  async function bulkUpdateStatus(ids: string[], status: PublishStatus) {
    pendingMutation.value = true
    try {
      const resolvedIds = uniqueIds(ids)
      const targetModules = modules.value.filter(module => module.id && resolvedIds.includes(module.id))
      const targetKeys = targetModules.flatMap(module => [module.id, module.slug])
      const api = useApiClient()
      const { data } = await api.patch<BulkModuleMutationResult>('/api/modules/bulk', {
        ids: resolvedIds,
        status,
      })

      if (currentModule.value?.id && resolvedIds.includes(currentModule.value.id)) {
        await refreshCurrentModule()
      }

      await fetchModules()
      invalidateLearnerModulesByKeys([
        ...targetKeys,
        currentModule.value?.id,
        currentModule.value?.slug,
      ])
      return data
    } finally {
      pendingMutation.value = false
    }
  }

  async function bulkDeleteModules(ids: string[]) {
    pendingMutation.value = true
    try {
      const resolvedIds = uniqueIds(ids)
      const targetModules = modules.value.filter(module => module.id && resolvedIds.includes(module.id))
      const targetKeys = targetModules.flatMap(module => [module.id, module.slug])
      const currentKeys = [currentModule.value?.id, currentModule.value?.slug]
      const api = useApiClient()
      const { data } = await api.delete<BulkModuleMutationResult>('/api/modules/bulk', {
        data: { ids: resolvedIds },
      })

      if (currentModule.value?.id && resolvedIds.includes(currentModule.value.id)) {
        setCurrentModule(null)
      }

      await fetchModules()
      invalidateLearnerModulesByKeys([
        ...targetKeys,
        ...currentKeys,
      ])
      return data
    } finally {
      pendingMutation.value = false
    }
  }

  async function saveSection(moduleId: string, detailId: string | undefined, payload: ModuleSectionPayload) {
    pendingMutation.value = true
    try {
      const api = useApiClient()
      let detail: ModuleDetail
      if (detailId) {
        const { data } = await api.patch<ModuleDetail>(`/api/details/${detailId}`, payload)
        detail = data
      } else {
        const { data } = await api.post<ModuleDetail>(`/api/modules/${moduleId}/details`, payload)
        detail = data
      }

      await refreshCurrentModule()
      invalidateLearnerModules(currentModule.value)
      return currentModule.value?.details.find(item => item.id === detail.id) || detail
    } finally {
      pendingMutation.value = false
    }
  }

  async function deleteSection(detailId: string) {
    pendingMutation.value = true
    try {
      const api = useApiClient()
      await api.delete(`/api/details/${detailId}`)
      await refreshCurrentModule()
      invalidateLearnerModules(currentModule.value)
    } finally {
      pendingMutation.value = false
    }
  }

  async function addAttachment(detailId: string, payload: ModuleAttachmentPayload) {
    pendingMutation.value = true
    try {
      const api = useApiClient()
      const { data } = await api.post<Attachment>(`/api/details/${detailId}/attachments`, payload)
      await refreshCurrentModule()
      invalidateLearnerModules(currentModule.value)
      return data
    } finally {
      pendingMutation.value = false
    }
  }

  async function attachFiles(detailId: string, files: File[], sortStart = 0) {
    pendingMutation.value = true
    try {
      const api = useApiClient()
      for (const [index, file] of files.entries()) {
        const mimeType = normalizedUploadMimeType(file.name, file.type)
        const uploaded = await uploadFile(file, file.name)
        await api.post(`/api/details/${detailId}/attachments`, {
          type: attachmentTypeFromMimeType(mimeType),
          title: file.name,
          url: uploaded.url,
          filePath: uploaded.filePath,
          mimeType: uploaded.mimeType,
          sizeBytes: uploaded.sizeBytes,
          sortOrder: sortStart + index,
        } satisfies ModuleAttachmentPayload)
      }
      await refreshCurrentModule()
      invalidateLearnerModules(currentModule.value)
    } finally {
      pendingMutation.value = false
    }
  }

  async function deleteAttachment(attachmentId: string) {
    pendingMutation.value = true
    try {
      const api = useApiClient()
      await api.delete(`/api/attachments/${attachmentId}`)
      await refreshCurrentModule()
      invalidateLearnerModules(currentModule.value)
    } finally {
      pendingMutation.value = false
    }
  }

  return {
    modules,
    currentModule,
    pendingList,
    pendingDetail,
    pendingMutation,
    listError,
    detailError,
    replaceModule,
    upsertModule,
    removeModule,
    setCurrentModule,
    fetchModules,
    fetchModuleById,
    refreshCurrentModule,
    createModule,
    updateModule,
    deleteModule,
    bulkUpdateStatus,
    bulkDeleteModules,
    saveSection,
    deleteSection,
    addAttachment,
    attachFiles,
    deleteAttachment,
  }
})
