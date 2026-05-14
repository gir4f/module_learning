<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 text-slate-900 shadow-sm shadow-slate-900/5 backdrop-blur-xl transition-colors duration-150 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-100">
    <div class="mx-auto grid h-16 w-full max-w-[88rem] grid-cols-[1fr_auto] items-center gap-3 px-3 sm:gap-4 sm:px-6 lg:h-[72px] lg:grid-cols-[minmax(0,1fr)_minmax(24rem,36rem)_minmax(0,1fr)] lg:px-8">
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

      <!-- Desktop search -->
      <div class="relative hidden min-w-0 lg:block">
        <label class="sr-only" for="global-module-search">Cari modul</label>
        <div class="relative mx-auto w-full">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true" />
          <InputText
            id="global-module-search"
            ref="searchInput"
            v-model="query"
            type="search"
            class="w-full rounded-xl! border-slate-300! bg-slate-50! py-2.5! pl-9! pr-20! text-sm! text-slate-900! shadow-none! placeholder:text-slate-400! focus:border-brand-teal! focus:ring-4! focus:ring-cyan-100! dark:border-slate-700! dark:bg-slate-900! dark:text-slate-100! dark:placeholder:text-slate-500! dark:focus:ring-cyan-950!"
            placeholder="Cari modul, komponen, atau produk..."
            aria-label="Cari modul"
            @focus="searchOpen = true"
            @keydown.escape="searchOpen = false"
          />
          <kbd class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">Ctrl K</kbd>
        </div>

        <!-- Desktop search dropdown -->
        <div
          v-if="searchOpen && query"
          class="absolute left-1/2 top-full mt-2 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/12 dark:border-slate-800 dark:bg-slate-900"
        >
          <NuxtLink
            v-for="module in suggestions"
            :key="module.slug"
            :to="moduleTarget(module)"
            class="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800"
            @click="searchOpen = false"
          >
            <span class="min-w-0">
              <span class="block truncate font-black text-brand-navy dark:text-cyan-200">{{ module.title }}</span>
              <span class="block truncate text-xs font-medium text-slate-500 dark:text-slate-400">/{{ module.slug }}</span>
            </span>
            <span class="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">{{ module.details.length }}</span>
          </NuxtLink>
          <p v-if="pending" class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">Mencari modul...</p>
          <p v-else-if="!suggestions.length" class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">Tidak ada modul ditemukan.</p>
        </div>
      </div>

      <div class="flex shrink-0 items-center justify-end gap-2">
        <!-- Desktop nav -->
        <nav class="hidden items-center gap-2 text-sm lg:flex" aria-label="Navigasi utama">
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
          class="hidden h-11 items-center rounded-xl bg-brand-teal px-4 text-sm font-black text-white shadow-sm transition hover:bg-brand-teal-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 disabled:cursor-wait disabled:opacity-70 dark:focus-visible:ring-cyan-950 lg:inline-flex"
          :aria-busy="authPending"
          :disabled="authPending"
          @click="handleAuthAction"
        >
          {{ authLabel }}
        </button>

        <!-- Mobile hamburger -->
        <button
          type="button"
          class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition duration-150 hover:border-brand-teal hover:bg-slate-50 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-cyan-950 lg:hidden"
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
  </header>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'
import { useAuthStore } from '~/stores/auth'
import NavbarMobileDrawer from '~/components/layout/NavbarMobileDrawer.vue'

const { mode = 'learning' } = defineProps<{
  mode?: 'learning' | 'admin'
}>()

const route = useRoute()
const query = ref('')
const debouncedQuery = ref('')
const searchOpen = ref(false)
const drawerOpen = ref(false)
const searchInput = ref<any>(null)
const auth = useAuthStore()
const { isDark, init, toggle } = useDarkMode()
const logoSrc = '/module-assets/LogoGitronikPolos.png'

let searchTimer: ReturnType<typeof setTimeout> | null = null

const subtitle = computed(() => mode === 'admin' ? 'Kelola modul ajar' : 'Modul safety device')
const authPending = computed(() => !auth.initialized && auth.pending)
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
const api = useApiClient()
const { data: modules, pending } = await useAsyncData<LearningModule[]>('top-navbar-module-search', async () => {
  const { data } = await api.get<LearningModule[]>('/api/modules', {
    params: debouncedQuery.value ? { search: debouncedQuery.value } : undefined,
  })
  return data
}, {
  default: () => [],
  watch: [debouncedQuery],
})

const suggestions = computed(() => query.value ? (modules.value || []).slice(0, 6) : [])

watch(query, (value) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedQuery.value = value.trim()
  }, 180)
})

watch(() => route.fullPath, () => {
  searchOpen.value = false
  drawerOpen.value = false
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
  window.addEventListener('keydown', handleShortcut)
  window.addEventListener('keydown', closeOnEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut)
  window.removeEventListener('keydown', closeOnEscape)
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
    searchOpen.value = true
    searchInput.value?.$el?.querySelector?.('input')?.focus?.()
  }
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  drawerOpen.value = false
  searchOpen.value = false
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
</script>
