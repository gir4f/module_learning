import type { LearningModule, ModuleDetail } from '~/types/learning'

export function useModuleEditor(module: Ref<LearningModule | null | undefined>) {
  const selectedSection = ref<ModuleDetail | null>(null)
  const moduleFieldErrors = reactive<Record<string, string>>({})
  const formError = ref('')
  const sections = computed(() => module.value?.details || [])

  function selectSection(section: ModuleDetail | null) {
    formError.value = ''
    selectedSection.value = section
  }

  function syncSelectedSection() {
    if (!module.value || !selectedSection.value?.id) return
    selectedSection.value = module.value.details.find(section => section.id === selectedSection.value?.id) || selectedSection.value
  }

  return {
    selectedSection,
    moduleFieldErrors,
    formError,
    sections,
    selectSection,
    syncSelectedSection,
  }
}
