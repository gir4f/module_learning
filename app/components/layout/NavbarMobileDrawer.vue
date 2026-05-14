<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-70 bg-slate-950/55 backdrop-blur-[2px] lg:hidden" @click.self="$emit('update:modelValue', false)" />
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
        v-if="modelValue"
        class="fixed inset-y-0 right-0 z-80 flex h-dvh w-full max-w-sm flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:w-[24rem] lg:hidden"
        aria-label="Menu mobile"
      >
        <!-- Header -->
        <div class="flex items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
          <div class="flex min-w-0 items-center gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-900/10 dark:ring-white/10">
              <img :src="logoSrc" alt="" class="h-full w-full object-contain" aria-hidden="true">
            </span>
            <div class="min-w-0">
              <p class="truncate font-black text-brand-navy dark:text-cyan-200">Gitronik Modul Ajar</p>
              <p class="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
            </div>
          </div>
          <button type="button" class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-600 transition duration-150 hover:bg-slate-100 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-cyan-950" aria-label="Tutup menu" @click="$emit('update:modelValue', false)">
            <i class="pi pi-times" aria-hidden="true" />
          </button>
        </div>

        <!-- Content -->
        <div class="min-h-0 flex-1 overflow-y-auto p-4">
          <!-- Mobile search -->
          <label class="grid gap-2">
            <span class="text-sm font-bold text-slate-700 dark:text-slate-200">Cari modul</span>
            <span class="relative">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true" />
              <InputText
                v-model="searchQuery"
                type="search"
                class="w-full rounded-xl! border-slate-300! bg-white! py-3! pl-10! pr-10! text-sm! text-slate-900! dark:border-slate-700! dark:bg-slate-900! dark:text-slate-100!"
                placeholder="Cari modul..."
              />
              <button
                v-if="searchQuery"
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Hapus pencarian"
                @click="searchQuery = ''"
              >
                <i class="pi pi-times text-xs" aria-hidden="true" />
              </button>
            </span>
          </label>

          <!-- Mobile search results -->
          <div v-if="searchQuery" class="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
            <p v-if="searchPending" class="px-3 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Mencari modul...</p>
            <template v-else-if="searchResults.length">
              <NuxtLink
                v-for="module in searchResults"
                :key="module.slug"
                :to="moduleTarget(module)"
                class="flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm transition duration-150 hover:bg-white dark:hover:bg-slate-800"
                @click="$emit('update:modelValue', false)"
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

          <!-- Nav items -->
          <nav class="mt-5 grid gap-2 text-sm" aria-label="Navigasi mobile">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex min-h-12 items-center justify-between rounded-2xl px-4 py-3 font-black text-slate-700 transition duration-150 hover:bg-slate-100 active:scale-[0.99] dark:text-slate-200 dark:hover:bg-slate-800"
              :class="isActive(item.to) ? 'bg-slate-100 text-brand-navy dark:bg-slate-800 dark:text-cyan-200' : ''"
              @click="$emit('update:modelValue', false)"
            >
              <span>{{ item.label }}</span>
              <i class="pi pi-arrow-right text-xs text-slate-400" aria-hidden="true" />
            </NuxtLink>
          </nav>
        </div>

        <!-- Footer -->
        <div class="border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            type="button"
            class="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-brand-teal px-4 py-3 text-sm font-black text-white shadow-sm transition duration-150 hover:bg-brand-teal-dark active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-cyan-100 disabled:cursor-wait disabled:opacity-70 dark:focus:ring-cyan-950"
            :aria-busy="authPending"
            :disabled="authPending"
            @click="$emit('auth-action')"
          >
            {{ authLabel }}
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'

const { modelValue, subtitle, navItems, isDark, authLabel, authPending = false, mode } = defineProps<{
  modelValue: boolean
  subtitle: string
  navItems: Array<{ label: string; to: string }>
  isDark: boolean
  authLabel: string
  authPending?: boolean
  mode: 'learning' | 'admin'
}>()
const logoSrc = '/module-assets/LogoGitronikPolos.png'

defineEmits<{
  'update:modelValue': [value: boolean]
  'toggle-dark': []
  'auth-action': []
}>()

const searchQuery = ref('')
const debouncedQuery = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (value) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedQuery.value = value.trim()
  }, 180)
})

const api = useApiClient()
const { data: searchModules, pending: searchPending } = await useAsyncData<LearningModule[]>('mobile-drawer-module-search', async () => {
  const { data } = await api.get<LearningModule[]>('/api/modules', {
    params: debouncedQuery.value ? { search: debouncedQuery.value } : undefined,
  })
  return data
}, {
  default: () => [],
  watch: [debouncedQuery],
})
const searchResults = computed(() => searchQuery.value ? (searchModules.value || []).slice(0, 6) : [])

const route = useRoute()
watch(() => route.fullPath, () => {
  searchQuery.value = ''
})

function moduleTarget(module: LearningModule) {
  if (mode === 'admin') return `/admin/modules/${module.id || module.slug}`
  return `/modules/${module.slug}`
}

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
