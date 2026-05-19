import type { ComputedRef, Ref } from 'vue'
import type { LearningModule } from '~/types/learning'
import { moduleMatchesQuery } from '~/utils/search'

type ModuleSearchOptions = {
  source?: Ref<LearningModule[]> | ComputedRef<LearningModule[]>
}

export function useModuleSearch(options: ModuleSearchOptions = {}) {
  const api = options.source ? null : useApiClient()
  const query = ref('')
  const debouncedQuery = ref('')
  const remoteResults = ref<LearningModule[]>([])
  const pending = ref(false)
  const error = ref('')
  const selectedIndex = ref(0)
  let timer: ReturnType<typeof setTimeout> | null = null
  let requestId = 0

  const usesLocalSource = computed(() => Boolean(options.source))
  const localResults = computed(() => {
    if (!usesLocalSource.value || !debouncedQuery.value.trim()) return []
    return (unref(options.source) || []).filter(module => moduleMatchesQuery(module, debouncedQuery.value))
  })
  const results = computed(() => usesLocalSource.value ? localResults.value : remoteResults.value)
  const isSettling = computed(() => Boolean(query.value.trim()) && query.value.trim() !== debouncedQuery.value)
  const isBusy = computed(() => pending.value || isSettling.value)
  const suggestions = computed(() => query.value.trim() ? results.value.slice(0, 8) : [])

  watch(query, (value) => {
    if (timer) clearTimeout(timer)
    error.value = ''
    selectedIndex.value = 0

    const nextQuery = value.trim()
    if (!nextQuery) {
      debouncedQuery.value = ''
      remoteResults.value = []
      pending.value = false
      return
    }

    timer = setTimeout(() => {
      debouncedQuery.value = nextQuery
    }, 180)
  })

  watch(debouncedQuery, (value) => {
    if (usesLocalSource.value) {
      pending.value = false
      error.value = ''
      return
    }
    void fetchResults(value)
  })

  watch(suggestions, () => {
    selectedIndex.value = 0
  })

  async function fetchResults(value: string) {
    const search = value.trim()
    const currentRequestId = ++requestId

    if (!search) {
      remoteResults.value = []
      pending.value = false
      return
    }

    pending.value = true
    error.value = ''

    try {
      const { data } = await api!.get<LearningModule[]>('/api/modules', {
        params: { search },
      })
      if (currentRequestId !== requestId) return
      remoteResults.value = data
    } catch {
      if (currentRequestId !== requestId) return
      remoteResults.value = []
      error.value = 'Pencarian gagal dimuat.'
    } finally {
      if (currentRequestId === requestId) pending.value = false
    }
  }

  function moveSelection(direction: 1 | -1) {
    if (!suggestions.value.length) return
    selectedIndex.value = (selectedIndex.value + direction + suggestions.value.length) % suggestions.value.length
  }

  function reset() {
    query.value = ''
    debouncedQuery.value = ''
    remoteResults.value = []
    pending.value = false
    error.value = ''
    selectedIndex.value = 0
  }

  function highlightParts(value?: string | null) {
    const text = value || ''
    const needle = query.value.trim()
    if (!needle) return [{ text, hit: false }]

    const lowerText = text.toLowerCase()
    const lowerNeedle = needle.toLowerCase()
    const index = lowerText.indexOf(lowerNeedle)
    if (index === -1) return [{ text, hit: false }]

    return [
      { text: text.slice(0, index), hit: false },
      { text: text.slice(index, index + needle.length), hit: true },
      { text: text.slice(index + needle.length), hit: false },
    ].filter(part => part.text)
  }

  return {
    query,
    results,
    suggestions,
    pending,
    error,
    selectedIndex,
    isBusy,
    moveSelection,
    reset,
    highlightParts,
  }
}
