<template>
  <nav class="hidden lg:block relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 no-print">
    <div class="absolute left-0 top-0 h-full w-1 bg-slate-100 dark:bg-slate-800" aria-hidden="true">
      <div class="w-full bg-brand-teal transition-all" :style="{ height: `${progress}%` }" />
    </div>
    <div v-auto-animate>
      <div class="mb-3 flex items-center justify-between gap-2">
        <p class="text-xs font-bold uppercase text-slate-500">Daftar isi</p>
        <button type="button" class="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" :aria-label="collapsed ? 'Buka daftar isi' : 'Tutup daftar isi'" @click="collapsed = !collapsed">
          <i :class="collapsed ? 'pi pi-angle-down' : 'pi pi-angle-up'" aria-hidden="true" />
        </button>
      </div>
      <div class="mb-3 h-1 rounded-full bg-slate-100 dark:bg-slate-800">
        <div class="h-1 rounded-full bg-brand-teal transition-all" :style="{ width: `${progress}%` }" />
      </div>
      <ol v-if="!collapsed" class="toc-scrollbar relative max-h-[62vh] space-y-1 overflow-y-auto border-l border-slate-200 pl-3 pr-1 text-sm dark:border-slate-800">
        <li v-for="detail in details" :key="detail.slug" class="relative">
          <span
            v-if="activeId === detail.slug"
            class="absolute left-[-17px] top-2 h-5 w-1 rounded-full bg-brand-teal"
            aria-hidden="true"
          />
          <a
            class="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-slate-600 transition hover:bg-slate-50 hover:text-brand-navy dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            :class="activeId === detail.slug ? 'bg-cyan-50 font-semibold text-brand-navy dark:bg-cyan-950/40 dark:text-cyan-200' : ''"
            :href="`#${detail.slug}`"
            @click="activeId = detail.slug"
          >
            <span>{{ detail.title }}</span>
            <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">{{ detail.components.length }}</span>
          </a>
        </li>
      </ol>
    </div>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-8 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-8 opacity-0"
      >
        <button
          v-if="progress > 10"
          type="button"
          class="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy text-white shadow-lg transition hover:-translate-y-1 hover:bg-brand-teal hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:bg-cyan-900 dark:hover:bg-cyan-700 no-print"
          aria-label="Kembali ke atas"
          @click="scrollTop"
        >
          <i class="pi pi-arrow-up" aria-hidden="true" />
        </button>
      </Transition>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import type { ModuleDetail } from '~/types/learning'

const { details } = defineProps<{
  details: ModuleDetail[]
}>()

const activeId = ref(details[0]?.slug || '')
const collapsed = ref(false)
const progress = ref(0)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (visible?.target.id) activeId.value = visible.target.id
  }, { rootMargin: '-120px 0px -65% 0px', threshold: [0.1, 0.4, 0.8] })

  details.forEach((detail) => {
    const element = document.getElementById(detail.slug)
    if (element) observer.observe(element)
  })

  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
  onBeforeUnmount(() => observer.disconnect())
  onBeforeUnmount(() => window.removeEventListener('scroll', updateProgress))
})

function jumpTo(slug: string) {
  activeId.value = slug
  document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  progress.value = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0
}
</script>
