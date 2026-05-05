import { defineStore } from 'pinia'
import type { LearningModule } from '~/types/learning'

export const useModulesStore = defineStore('modules', () => {
  const modules = ref<LearningModule[]>([])
  const pending = ref(false)
  const error = ref('')

  async function fetchModules(search = '') {
    pending.value = true
    error.value = ''
    try {
      modules.value = await $fetch<LearningModule[]>('/api/modules' as string, {
        query: search ? { search } : undefined,
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load modules.'
    } finally {
      pending.value = false
    }
  }

  async function createModule(payload: Partial<LearningModule>) {
    const module = await $fetch<LearningModule>('/api/modules', {
      method: 'POST',
      body: payload,
    })
    modules.value = [module, ...modules.value]
    return module
  }

  async function updateModule(id: string, payload: Partial<LearningModule>) {
    const module = await $fetch<LearningModule>(`/api/modules/${id}`, {
      method: 'PATCH',
      body: payload,
    })
    modules.value = modules.value.map((item) => item.id === id ? module : item)
    return module
  }

  async function deleteModule(id: string) {
    await $fetch(`/api/modules/${id}`, {
      method: 'DELETE',
    })
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
