<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/88">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-3" aria-label="Beranda modul pembelajaran">
        <img class="h-12 w-auto" :src="'/module-assets/Gitronikbgputih.jpg'" alt="PT. Gitronik Dimindo Indonesia">
        <span class="hidden text-sm font-semibold text-slate-700 dark:text-slate-200 sm:inline">Modul Pembelajaran</span>
      </NuxtLink>

      <div class="relative hidden min-w-0 flex-1 lg:block">
        <label class="sr-only" for="global-search">Cari modul</label>
        <div class="relative mx-auto max-w-xl">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true" />
          <input
            id="global-search"
            ref="searchInput"
            v-model="query"
            type="search"
            class="w-full rounded-lg border border-slate-300 bg-white px-9 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-teal focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-cyan-950"
            placeholder="Cari modul..."
            @focus="searchOpen = true"
            @keydown.escape="searchOpen = false"
          >
          <kbd class="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:border-slate-700 md:block">Ctrl K</kbd>
        </div>
        <div
          v-if="searchOpen && query"
          class="absolute left-1/2 top-full mt-2 w-full max-w-xl -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
          <NuxtLink
            v-for="module in suggestions"
            :key="module.slug"
            :to="`/modules/${module.slug}`"
            class="block rounded-md px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            @click="searchOpen = false"
          >
            <span class="font-semibold text-brand-navy dark:text-brand-dark-navy">{{ module.title }}</span>
            <span class="ml-2 text-xs text-slate-500">{{ module.details.length }} section</span>
          </NuxtLink>
          <p v-if="!suggestions.length" class="px-3 py-2 text-sm text-slate-500">Tidak ada modul ditemukan.</p>
        </div>
      </div>

      <nav class="hidden items-center gap-3 text-sm lg:flex">
        <NuxtLink to="/" class="font-medium text-slate-600 hover:text-brand-navy dark:text-slate-300 dark:hover:text-white">Modul</NuxtLink>
        <button
          type="button"
          class="rounded-md border border-slate-300 px-3 py-2 text-slate-700 transition hover:border-brand-teal focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:text-slate-200"
          :aria-label="isDark ? 'Gunakan mode terang' : 'Gunakan mode gelap'"
          @click="toggleDark"
        >
          <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" aria-hidden="true" />
        </button>
        <NuxtLink to="/admin/modules" class="rounded-md bg-brand-teal px-3 py-2 font-semibold text-white hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-cyan-100">
          Admin
        </NuxtLink>
      </nav>

      <button
        type="button"
        class="rounded-md border border-slate-300 px-3 py-2 text-slate-700 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:text-slate-200 lg:hidden"
        aria-label="Buka menu"
        @click="drawerOpen = true"
      >
        <i class="pi pi-bars" aria-hidden="true" />
      </button>
    </div>

    <div v-if="drawerOpen" class="fixed inset-0 z-50 bg-slate-950/40 lg:hidden" @click.self="drawerOpen = false">
      <aside class="ml-auto h-full w-80 max-w-[88vw] border-l border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div class="flex items-center justify-between">
          <span class="font-bold text-brand-navy dark:text-brand-dark-navy">Menu</span>
          <button type="button" class="rounded-md p-2 text-slate-600 dark:text-slate-300" aria-label="Tutup menu" @click="drawerOpen = false">
            <i class="pi pi-times" aria-hidden="true" />
          </button>
        </div>
        <label class="mt-5 grid gap-2">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Cari modul</span>
          <input v-model="query" type="search" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        </label>
        <div v-if="query" class="mt-3 grid gap-1">
          <NuxtLink
            v-for="module in suggestions"
            :key="module.slug"
            :to="`/modules/${module.slug}`"
            class="rounded-md px-3 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-100 dark:text-brand-dark-navy dark:hover:bg-slate-800"
            @click="drawerOpen = false"
          >
            {{ module.title }}
          </NuxtLink>
        </div>
        <nav class="mt-5 grid gap-2 text-sm">
          <NuxtLink to="/" class="rounded-md px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" @click="drawerOpen = false">Modul</NuxtLink>
          <NuxtLink to="/admin/modules" class="rounded-md bg-brand-teal px-3 py-2 font-semibold text-white" @click="drawerOpen = false">Admin</NuxtLink>
          <button type="button" class="rounded-md border border-slate-300 px-3 py-2 text-left font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200" @click="toggleDark">
            {{ isDark ? 'Mode terang' : 'Mode gelap' }}
          </button>
        </nav>
      </aside>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'

const query = ref('')
const searchOpen = ref(false)
const drawerOpen = ref(false)
const isDark = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

const { data: modules } = await useFetch<LearningModule[]>('/api/modules', { default: () => [] })

const suggestions = computed(() => {
  const needle = query.value.trim().toLowerCase()
  if (!needle) return []
  return (modules.value || []).filter((module) => {
    const haystack = [module.title, module.description, module.keywords, ...module.details.map((detail) => detail.title)].join(' ').toLowerCase()
    return haystack.includes(needle)
  }).slice(0, 6)
})

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  applyTheme()
  window.addEventListener('keydown', handleShortcut)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut)
})

function toggleDark() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  applyTheme()
}

function applyTheme() {
  document.documentElement.classList.toggle('dark', isDark.value)
}

function handleShortcut(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchOpen.value = true
    searchInput.value?.focus()
  }
}
</script>
