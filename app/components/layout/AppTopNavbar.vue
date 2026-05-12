<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 text-slate-900 shadow-sm shadow-slate-900/5 backdrop-blur-xl transition-colors duration-150 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-100">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:gap-4 sm:px-6 lg:h-[72px] lg:px-8">
      <NuxtLink :to="mode === 'admin' ? '/admin/modules' : '/'" class="group flex min-w-0 items-center gap-3" aria-label="Beranda Gitronik Learning">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-navy text-white shadow-sm ring-1 ring-slate-900/5 transition duration-150 group-hover:scale-105 dark:bg-brand-teal-dark">
          <span class="text-sm font-black">G</span>
        </span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-black text-brand-navy dark:text-cyan-200">Gitronik Learning</span>
          <span class="block truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{{ subtitle }}</span>
        </span>
      </NuxtLink>

      <div class="relative hidden min-w-0 flex-1 lg:block">
        <label class="sr-only" for="global-module-search">Cari modul</label>
        <div class="relative mx-auto max-w-xl">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true" />
          <InputText
            id="global-module-search"
            ref="searchInput"
            v-model="query"
            type="search"
            class="w-full !rounded-xl !border-slate-300 !bg-slate-50 !py-2.5 !pl-9 !pr-20 !text-sm !text-slate-900 !shadow-none placeholder:!text-slate-400 focus:!border-brand-teal focus:!ring-4 focus:!ring-cyan-100 dark:!border-slate-700 dark:!bg-slate-900 dark:!text-slate-100 dark:placeholder:!text-slate-500 dark:focus:!ring-cyan-950"
            placeholder="Cari modul, komponen, atau produk..."
            aria-label="Cari modul"
            @focus="searchOpen = true"
            @keydown.escape="searchOpen = false"
          />
          <kbd class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">Ctrl K</kbd>
        </div>

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

      <nav class="hidden shrink-0 items-center gap-2 text-sm lg:flex" aria-label="Navigasi utama">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-xl px-3 py-2 font-bold text-slate-600 transition hover:bg-slate-100 hover:text-brand-navy dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-200"
          :class="isActive(item.to) ? 'bg-slate-100 text-brand-navy dark:bg-slate-800 dark:text-cyan-200' : ''"
        >
          {{ item.label }}
        </NuxtLink>
        <Button
          :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
          severity="secondary"
          outlined
          rounded
          :aria-label="isDark ? 'Gunakan mode terang' : 'Gunakan mode gelap'"
          class="!h-10 !w-10 !border-slate-300 !text-slate-600 hover:!border-brand-teal dark:!border-slate-700 dark:!text-slate-200"
          @click="toggle"
        />
        <button
          type="button"
          class="inline-flex h-10 items-center rounded-xl bg-brand-teal px-4 text-sm font-black text-white shadow-sm transition hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:focus:ring-cyan-950"
          @click="handleAuthAction"
        >
          {{ auth.profile ? 'Logout' : 'Login' }}
        </button>
      </nav>

      <button
        type="button"
        class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition duration-150 hover:border-brand-teal hover:bg-slate-50 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-cyan-950 lg:hidden"
        :aria-expanded="drawerOpen"
        :aria-label="drawerOpen ? 'Tutup menu' : 'Buka menu'"
        @click="drawerOpen = !drawerOpen"
      >
        <i :class="drawerOpen ? 'pi pi-times' : 'pi pi-bars'" aria-hidden="true" />
      </button>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-150 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="drawerOpen" class="fixed inset-0 z-[70] bg-slate-950/55 backdrop-blur-[2px] lg:hidden" @click.self="drawerOpen = false" />
      </Transition>

      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="translate-x-full opacity-80"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-80"
      >
        <aside
          v-if="drawerOpen"
          class="fixed inset-y-0 right-0 z-[80] flex h-dvh w-full max-w-sm flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:w-[24rem] lg:hidden"
          aria-label="Menu mobile"
        >
          <div class="flex items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
            <div class="flex min-w-0 items-center gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-sm font-black text-white dark:bg-brand-teal-dark">G</span>
              <div class="min-w-0">
                <p class="truncate font-black text-brand-navy dark:text-cyan-200">Gitronik Learning</p>
                <p class="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
              </div>
            </div>
            <button type="button" class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-600 transition duration-150 hover:bg-slate-100 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-cyan-950" aria-label="Tutup menu" @click="drawerOpen = false">
              <i class="pi pi-times" aria-hidden="true" />
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto p-4">
            <label class="grid gap-2">
              <span class="text-sm font-bold text-slate-700 dark:text-slate-200">Cari modul</span>
              <span class="relative">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true" />
                <InputText
                  v-model="query"
                  type="search"
                  class="w-full !rounded-xl !border-slate-300 !bg-white !py-3 !pl-10 !pr-10 !text-sm !text-slate-900 dark:!border-slate-700 dark:!bg-slate-900 dark:!text-slate-100"
                  placeholder="Cari modul..."
                  @focus="searchOpen = true"
                />
                <button
                  v-if="query"
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label="Hapus pencarian"
                  @click="query = ''"
                >
                  <i class="pi pi-times text-xs" aria-hidden="true" />
                </button>
              </span>
            </label>

            <div v-if="query" class="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
              <p v-if="pending" class="px-3 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Mencari modul...</p>
              <template v-else-if="suggestions.length">
                <NuxtLink
                  v-for="module in suggestions"
                  :key="module.slug"
                  :to="moduleTarget(module)"
                  class="flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm transition duration-150 hover:bg-white dark:hover:bg-slate-800"
                  @click="drawerOpen = false"
                >
                  <span class="min-w-0">
                    <span class="block truncate font-black text-brand-navy dark:text-cyan-200">{{ module.title }}</span>
                    <span class="mt-0.5 block truncate text-xs font-medium text-slate-500 dark:text-slate-400">/{{ module.slug }}</span>
                  </span>
                  <i class="pi pi-arrow-right shrink-0 text-xs text-slate-400" aria-hidden="true" />
                </NuxtLink>
              </template>
              <p v-else class="px-3 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Tidak ada modul ditemukan.</p>
            </div>

            <nav class="mt-5 grid gap-2 text-sm" aria-label="Navigasi mobile">
              <NuxtLink
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                class="flex min-h-12 items-center justify-between rounded-2xl px-4 py-3 font-black text-slate-700 transition duration-150 hover:bg-slate-100 active:scale-[0.99] dark:text-slate-200 dark:hover:bg-slate-800"
                :class="isActive(item.to) ? 'bg-slate-100 text-brand-navy dark:bg-slate-800 dark:text-cyan-200' : ''"
                @click="drawerOpen = false"
              >
                <span>{{ item.label }}</span>
                <i class="pi pi-arrow-right text-xs text-slate-400" aria-hidden="true" />
              </NuxtLink>
              <button
                type="button"
                class="mt-2 inline-flex min-h-12 items-center justify-between rounded-2xl border border-slate-300 px-4 py-3 text-left font-black text-slate-700 transition duration-150 hover:bg-slate-50 active:scale-[0.99] dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="toggle"
              >
                <span>{{ isDark ? 'Mode terang' : 'Mode gelap' }}</span>
                <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" aria-hidden="true" />
              </button>
            </nav>
          </div>

          <div class="border-t border-slate-200 p-4 dark:border-slate-800">
            <button
              type="button"
              class="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-brand-teal px-4 py-3 text-sm font-black text-white shadow-sm transition duration-150 hover:bg-brand-teal-dark active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:focus:ring-cyan-950"
              @click="handleAuthAction"
            >
              {{ auth.profile ? 'Logout' : 'Login' }}
            </button>
          </div>
        </aside>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'
import { useAuthStore } from '~/stores/auth'

const props = withDefaults(defineProps<{
  mode?: 'learning' | 'admin'
}>(), {
  mode: 'learning',
})

const route = useRoute()
const query = ref('')
const debouncedQuery = ref('')
const searchOpen = ref(false)
const drawerOpen = ref(false)
const searchInput = ref<any>(null)
const auth = useAuthStore()
const { isDark, init, toggle } = useDarkMode()
let searchTimer: ReturnType<typeof setTimeout> | null = null

const subtitle = computed(() => props.mode === 'admin' ? 'Content operations' : 'Safety device modules')
const navItems = computed(() => props.mode === 'admin'
  ? [
      { label: 'Modules', to: '/admin/modules' },
      { label: 'Learner View', to: '/' },
    ]
  : [
      { label: 'Modul', to: '/' },
      { label: 'Admin', to: '/admin/modules' },
    ])
const { data: modules, pending } = await useFetch<LearningModule[]>('/api/modules', {
  query: computed(() => debouncedQuery.value ? { search: debouncedQuery.value } : {}),
  default: () => [],
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
  auth.fetchProfile()
  window.addEventListener('keydown', handleShortcut)
  window.addEventListener('keydown', closeOnEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut)
  window.removeEventListener('keydown', closeOnEscape)
  document.documentElement.classList.remove('overflow-hidden')
})

function moduleTarget(module: LearningModule) {
  if (props.mode === 'admin') return `/admin/modules/${module.id || module.slug}`
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
  drawerOpen.value = false
  if (auth.profile) {
    await auth.logout()
    if (route.path.startsWith('/admin')) await navigateTo('/login')
    return
  }
  await navigateTo('/login')
}
</script>
