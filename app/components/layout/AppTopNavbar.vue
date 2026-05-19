<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white text-slate-900 shadow-sm shadow-slate-900/5 transition-colors duration-150 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:bg-white/90 sm:backdrop-blur-xl sm:dark:bg-slate-950/90">
    <div class="mx-auto grid h-16 w-full max-w-[88rem] grid-cols-[1fr_auto] items-center gap-3 px-3 sm:gap-4 sm:px-6 xl:h-[72px] xl:grid-cols-[minmax(0,1fr)_minmax(24rem,36rem)_minmax(0,1fr)] xl:px-8">
      <!-- Brand -->
      <NuxtLink :to="mode === 'admin' ? '/admin/modules' : '/'" class="group flex min-w-0 items-center gap-3" aria-label="Beranda Gitronik Modul Ajar">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-900/10 transition duration-150 group-hover:scale-105 dark:ring-white/10">
          <img :src="logoSrc" alt="" class="h-full w-full object-contain" aria-hidden="true">
        </span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-black text-brand-navy dark:text-cyan-200">Gitronik Modul Ajar</span>
          <span class="block truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{{ subtitle }}</span>
        </span>
      </NuxtLink>

      <div class="hidden min-w-0 xl:block">
        <div v-if="usesLocalLearningSearch" ref="localSearchRoot" class="relative">
          <label class="relative block">
            <span class="sr-only">Cari modul</span>
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              ref="localSearchInput"
              v-model="localLearningSearch"
              type="text"
              role="searchbox"
              class="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-brand-teal hover:bg-white focus:border-brand-teal focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-cyan-400 dark:hover:bg-slate-900/80 dark:focus:border-cyan-400 dark:focus:ring-cyan-950"
              :class="localLearningSearch ? 'pr-12' : 'pr-24'"
              placeholder="Cari modul, produk, atau komponen..."
              aria-label="Cari modul"
              autocomplete="off"
              @focus="localSearchOpen = true"
              @input="localSearchOpen = true"
              @keydown.escape.prevent="handleLocalSearchEscape"
            >
            <button
              v-if="localLearningSearch"
              type="button"
              class="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:focus-visible:ring-cyan-950"
              aria-label="Bersihkan pencarian"
              @click="clearLocalLearningSearch"
            >
              <i class="pi pi-times text-xs" aria-hidden="true" />
            </button>
            <kbd v-else class="absolute right-4 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">Ctrl K</kbd>
          </label>

          <div
            v-if="showLocalSearchPanel"
            class="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15 dark:border-slate-800 dark:bg-slate-950"
          >
            <div class="max-h-[26rem] overflow-y-auto p-2">
              <NuxtLink
                v-for="module in localSuggestions"
                :key="module.slug"
                :to="`/modules/${module.slug}`"
                class="flex items-start justify-between gap-4 rounded-xl px-3 py-3 text-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:hover:bg-slate-900/80 dark:focus-visible:ring-cyan-950"
                @click="closeLocalSearchPanel"
              >
                <span class="min-w-0">
                  <span class="block truncate font-black text-brand-navy dark:text-cyan-200">
                    <template v-for="(part, partIndex) in highlightLocalParts(module.title)" :key="`${module.slug}-local-title-${partIndex}`">
                      <mark v-if="part.hit" class="rounded bg-cyan-100 px-0.5 text-brand-navy dark:bg-cyan-900/70 dark:text-cyan-100">{{ part.text }}</mark>
                      <span v-else>{{ part.text }}</span>
                    </template>
                  </span>
                  <span class="mt-1 block truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <template v-for="(part, partIndex) in highlightLocalParts(module.slug)" :key="`${module.slug}-local-slug-${partIndex}`">
                      <mark v-if="part.hit" class="rounded bg-cyan-100 px-0.5 text-brand-navy dark:bg-cyan-900/70 dark:text-cyan-100">{{ part.text }}</mark>
                      <span v-else>{{ part.text }}</span>
                    </template>
                  </span>
                  <span v-if="module.description || module.keywords" class="mt-2 block truncate text-xs leading-5 text-slate-500 dark:text-slate-400">
                    <template v-for="(part, partIndex) in highlightLocalParts(module.description || module.keywords || '')" :key="`${module.slug}-local-meta-${partIndex}`">
                      <mark v-if="part.hit" class="rounded bg-cyan-100 px-0.5 text-brand-navy dark:bg-cyan-900/70 dark:text-cyan-100">{{ part.text }}</mark>
                      <span v-else>{{ part.text }}</span>
                    </template>
                  </span>
                </span>
                <span class="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">{{ module.details.length }} varian produk</span>
              </NuxtLink>
              <p v-if="isLocalSearchBusy" class="px-3 py-5 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">Mencari modul...</p>
              <p v-else-if="localSearchError" class="px-3 py-5 text-center text-sm font-semibold text-red-600 dark:text-red-300">{{ localSearchError }}</p>
              <p v-else-if="!localSuggestions.length" class="px-3 py-5 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">Tidak ada modul ditemukan.</p>
            </div>
          </div>
        </div>

        <button
          v-else
          ref="searchTrigger"
          type="button"
          class="group flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-300 bg-slate-50 px-4 text-left text-sm font-semibold text-slate-500 transition hover:border-brand-teal hover:bg-white hover:text-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-cyan-400 dark:hover:bg-slate-900/80 dark:hover:text-slate-200 dark:focus-visible:ring-cyan-950"
          aria-label="Buka command palette pencarian modul"
          @click="openCommandPalette"
        >
          <span class="flex min-w-0 items-center gap-3">
            <i class="pi pi-search shrink-0 text-slate-400 transition group-hover:text-brand-teal dark:group-hover:text-cyan-300" aria-hidden="true" />
            <span class="truncate">Cari modul, komponen, atau produk...</span>
          </span>
          <kbd class="shrink-0 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">Ctrl K</kbd>
        </button>
      </div>

      <div class="flex shrink-0 items-center justify-end gap-2">
        <!-- Desktop nav -->
        <nav class="hidden items-center gap-2 text-sm xl:flex" aria-label="Navigasi utama">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-xl px-3 py-2 font-bold text-slate-600 transition hover:bg-slate-100 hover:text-brand-navy dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-200"
            :class="isActive(item.to) ? 'bg-slate-100 text-brand-navy dark:bg-slate-800 dark:text-cyan-200' : ''"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Dark mode toggle -->
        <button
          ref="mobileSearchTrigger"
          type="button"
          class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition duration-150 hover:border-brand-teal hover:bg-slate-50 hover:text-brand-teal focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:border-slate-700 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:bg-slate-800 dark:hover:text-cyan-400 dark:focus-visible:ring-cyan-950 xl:hidden"
          aria-label="Buka pencarian modul"
          @click="openCommandPalette"
        >
          <i class="pi pi-search" aria-hidden="true" />
        </button>

        <!-- Dark mode toggle -->
        <button
          type="button"
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition duration-150 hover:border-brand-teal hover:bg-slate-50 hover:text-brand-teal focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:border-slate-700 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:bg-slate-800 dark:hover:text-cyan-400 dark:focus-visible:ring-cyan-950"
          :aria-label="isDark ? 'Gunakan mode terang' : 'Gunakan mode gelap'"
          @click="toggle"
        >
          <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" aria-hidden="true" />
        </button>

        <!-- Desktop Auth button -->
        <button
          type="button"
          class="hidden h-11 items-center rounded-xl bg-brand-teal px-4 text-sm font-black text-white shadow-sm transition hover:bg-brand-teal-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 disabled:cursor-wait disabled:opacity-70 dark:focus-visible:ring-cyan-950 xl:inline-flex"
          :aria-busy="authPending"
          :disabled="authPending"
          @click="handleAuthAction"
        >
          {{ authLabel }}
        </button>

        <!-- Mobile hamburger -->
        <button
          type="button"
          class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition duration-150 hover:border-brand-teal hover:bg-slate-50 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-cyan-950 xl:hidden"
          :aria-expanded="drawerOpen"
          :aria-label="drawerOpen ? 'Tutup menu' : 'Buka menu'"
          @click="drawerOpen = !drawerOpen"
        >
          <i :class="drawerOpen ? 'pi pi-times' : 'pi pi-bars'" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Mobile drawer (extracted component) -->
    <NavbarMobileDrawer
      v-model="drawerOpen"
      :subtitle="subtitle"
      :nav-items="navItems"
      :is-dark="isDark"
      :auth-label="authLabel"
      :auth-pending="authPending"
      :mode="mode"
      @toggle-dark="toggle"
      @auth-action="handleAuthAction"
    />

    <Teleport to="body">
      <div
        v-if="commandOpen"
        class="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/25 px-4 pt-20 backdrop-blur-[2px] sm:pt-24"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette pencarian modul"
        @click.self="closeCommandPalette"
      >
        <section class="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-slate-950">
          <label class="sr-only" for="command-module-search">Cari modul</label>
          <div class="border-b border-slate-200 p-3 dark:border-slate-800">
            <div class="flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-3 focus-within:border-brand-teal focus-within:ring-4 focus-within:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-cyan-400 dark:focus-within:ring-cyan-950">
              <i class="pi pi-search text-slate-400" aria-hidden="true" />
              <input
                id="command-module-search"
                ref="commandInput"
                v-model="query"
                type="text"
                role="searchbox"
                class="min-w-0 flex-1 bg-transparent py-3 text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="Cari modul, komponen, atau produk..."
                autocomplete="off"
                @keydown.down.prevent="moveCommandSelection(1)"
                @keydown.up.prevent="moveCommandSelection(-1)"
                @keydown.enter.prevent="openSelectedSuggestion"
                @keydown.escape.prevent="closeCommandPalette"
              >
              <button type="button" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:focus-visible:ring-cyan-950" aria-label="Tutup pencarian" @click="closeCommandPalette">
                <i class="pi pi-times" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div class="max-h-[55vh] overflow-y-auto p-2">
            <NuxtLink
              v-for="(module, index) in suggestions"
              :key="module.slug"
              :to="moduleTarget(module)"
              class="flex items-center justify-between gap-4 rounded-xl px-3 py-3 text-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:hover:bg-slate-800 dark:focus-visible:ring-cyan-950"
              :class="activeSuggestionIndex === index ? 'bg-cyan-50 dark:bg-cyan-950/30' : ''"
              @mouseenter="activeSuggestionIndex = index"
              @click="closeCommandPalette"
            >
              <span class="min-w-0">
                <span class="block truncate font-black text-brand-navy dark:text-cyan-200">
                  <template v-for="(part, partIndex) in highlightParts(module.title)" :key="`${module.slug}-command-title-${partIndex}`">
                    <mark v-if="part.hit" class="rounded bg-cyan-100 px-0.5 text-brand-navy dark:bg-cyan-900/70 dark:text-cyan-100">{{ part.text }}</mark>
                    <span v-else>{{ part.text }}</span>
                  </template>
                </span>
                <span class="mt-1 block truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <template v-for="(part, partIndex) in highlightParts(module.slug)" :key="`${module.slug}-command-slug-${partIndex}`">
                    <mark v-if="part.hit" class="rounded bg-cyan-100 px-0.5 text-brand-navy dark:bg-cyan-900/70 dark:text-cyan-100">{{ part.text }}</mark>
                    <span v-else>{{ part.text }}</span>
                  </template>
                </span>
                <span v-if="module.description || module.keywords" class="mt-2 block truncate text-xs leading-5 text-slate-500 dark:text-slate-400">
                  <template v-for="(part, partIndex) in highlightParts(module.description || module.keywords || '')" :key="`${module.slug}-command-meta-${partIndex}`">
                    <mark v-if="part.hit" class="rounded bg-cyan-100 px-0.5 text-brand-navy dark:bg-cyan-900/70 dark:text-cyan-100">{{ part.text }}</mark>
                    <span v-else>{{ part.text }}</span>
                  </template>
                </span>
              </span>
              <span class="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">{{ module.details.length }} varian produk</span>
            </NuxtLink>
            <p v-if="isSearchBusy" class="px-3 py-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">Mencari modul...</p>
            <p v-else-if="searchError" class="px-3 py-6 text-center text-sm font-semibold text-red-600 dark:text-red-300">{{ searchError }}</p>
            <p v-else-if="query && !suggestions.length" class="px-3 py-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">Tidak ada modul ditemukan.</p>
            <div v-else class="px-3 py-6 text-center">
              <p class="text-sm font-black text-slate-700 dark:text-slate-200">Cari modul global</p>
              <p class="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Ketik judul, slug, komponen, atau kata kunci modul.</p>
            </div>
          </div>
        </section>
      </div>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'
import { useAuthStore } from '~/stores/auth'
import { useLearningModulesStore } from '~/stores/learningModules'
import { useModulesStore } from '~/stores/modules'
import NavbarMobileDrawer from '~/components/layout/NavbarMobileDrawer.vue'

const { mode = 'learning' } = defineProps<{
  mode?: 'learning' | 'admin'
}>()

const route = useRoute()
const commandOpen = ref(false)
const drawerOpen = ref(false)
const localSearchOpen = ref(false)
const searchTrigger = useTemplateRef<HTMLButtonElement>('searchTrigger')
const mobileSearchTrigger = useTemplateRef<HTMLButtonElement>('mobileSearchTrigger')
const localSearchRoot = useTemplateRef<HTMLElement>('localSearchRoot')
const localSearchInput = useTemplateRef<HTMLInputElement>('localSearchInput')
const commandInput = useTemplateRef<HTMLInputElement>('commandInput')
const lastSearchTrigger = ref<HTMLButtonElement | null>(null)
const localLearningSearch = useState('learning-module-local-search', () => '')
const auth = useAuthStore()
const learningStore = useLearningModulesStore()
const adminModulesStore = useModulesStore()
const { isDark, init, toggle } = useDarkMode()
const logoSrc = '/module-assets/LogoGitronikPolos.png'
const searchSourceModules = computed(() => mode === 'admin' ? adminModulesStore.modules : learningStore.modules)
const {
  query,
  suggestions,
  error: searchError,
  selectedIndex: activeSuggestionIndex,
  isBusy: isSearchBusy,
  moveSelection,
  highlightParts,
} = useModuleSearch({
  source: searchSourceModules,
})
const {
  query: localSearchQuery,
  suggestions: localSuggestions,
  error: localSearchError,
  isBusy: isLocalSearchBusy,
  highlightParts: highlightLocalParts,
} = useModuleSearch({
  source: computed(() => learningStore.modules),
})

const subtitle = computed(() => mode === 'admin' ? 'Kelola modul ajar' : 'Modul safety device')
const usesLocalLearningSearch = computed(() => mode === 'learning' && route.path === '/')
const showLocalSearchPanel = computed(() => usesLocalLearningSearch.value && localSearchOpen.value && Boolean(localLearningSearch.value.trim()))
const authPending = computed(() => auth.pending)
const authLabel = computed(() => {
  if (authPending.value) return '...'
  return auth.profile ? 'Logout' : 'Login'
})
const navItems = computed(() => mode === 'admin'
  ? [
      { label: 'Modul Ajar', to: '/admin/modules' },
      { label: 'Halaman Modul', to: '/' },
    ]
  : [
      { label: 'Modul', to: '/' },
      { label: 'Admin', to: '/admin/modules' },
    ])

watch(() => route.fullPath, () => {
  commandOpen.value = false
  localSearchOpen.value = false
  drawerOpen.value = false
})

watch(localLearningSearch, (value) => {
  if (localSearchQuery.value !== value) localSearchQuery.value = value
})

watch(localSearchQuery, (value) => {
  if (localLearningSearch.value !== value) localLearningSearch.value = value
})

watch(drawerOpen, (isOpen) => {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('overflow-hidden', isOpen)
})

onMounted(() => {
  init()
  if (!auth.initialized) {
    void auth.ensureProfile()
  }
  if (mode === 'learning') {
    void learningStore.ensureModules()
  } else if (!adminModulesStore.modules.length) {
    void adminModulesStore.fetchModules()
  }
  window.addEventListener('keydown', handleShortcut)
  window.addEventListener('keydown', closeOnEscape)
  window.addEventListener('focus', refreshAuthState)
  document.addEventListener('pointerdown', handlePointerDown)
  document.addEventListener('visibilitychange', refreshAuthState)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut)
  window.removeEventListener('keydown', closeOnEscape)
  window.removeEventListener('focus', refreshAuthState)
  document.removeEventListener('pointerdown', handlePointerDown)
  document.removeEventListener('visibilitychange', refreshAuthState)
  document.documentElement.classList.remove('overflow-hidden')
})

function moduleTarget(module: LearningModule) {
  if (mode === 'admin') return `/admin/modules/${module.id || module.slug}`
  return `/modules/${module.slug}`
}

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function handleShortcut(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    lastSearchTrigger.value = searchTrigger.value || mobileSearchTrigger.value
    openCommandPalette()
  }
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  if (commandOpen.value) closeCommandPalette()
  localSearchOpen.value = false
  drawerOpen.value = false
}

function openCommandPalette(event?: MouseEvent) {
  const target = event?.currentTarget
  if (target instanceof HTMLButtonElement) lastSearchTrigger.value = target
  commandOpen.value = true
  nextTick(() => commandInput.value?.focus())
}

function closeCommandPalette() {
  commandOpen.value = false
  nextTick(() => lastSearchTrigger.value?.focus())
}

function clearLocalLearningSearch() {
  localLearningSearch.value = ''
  localSearchOpen.value = true
  nextTick(() => localSearchInput.value?.focus())
}

function closeLocalSearchPanel() {
  localSearchOpen.value = false
}

function handleLocalSearchEscape() {
  if (localLearningSearch.value) {
    clearLocalLearningSearch()
    return
  }
  localSearchOpen.value = false
  localSearchInput.value?.blur()
}

function handlePointerDown(event: PointerEvent) {
  if (!localSearchOpen.value) return
  const target = event.target
  if (!(target instanceof Node)) return
  if (localSearchRoot.value?.contains(target)) return
  localSearchOpen.value = false
}

function moveCommandSelection(direction: 1 | -1) {
  moveSelection(direction)
}

async function openSelectedSuggestion() {
  const module = suggestions.value[activeSuggestionIndex.value]
  if (!module) return
  closeCommandPalette()
  await navigateTo(moduleTarget(module))
}

async function handleAuthAction() {
  if (authPending.value) return
  drawerOpen.value = false
  if (auth.profile) {
    await auth.logout()
    if (route.path.startsWith('/admin')) await navigateTo('/login')
    return
  }
  await navigateTo('/login')
}

function refreshAuthState() {
  if (document.visibilityState && document.visibilityState !== 'visible') return
  void auth.fetchProfile()
}
</script>
