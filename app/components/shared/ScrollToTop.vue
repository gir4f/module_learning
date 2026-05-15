<template>
  <div v-auto-animate="{ duration: 160, easing: 'ease-out' }">
    <button
      v-if="visible"
      type="button"
      class="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 z-60 flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal text-white shadow-[0_8px_18px_rgba(15,23,42,0.22)] transition hover:bg-brand-teal-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 dark:shadow-[0_8px_18px_rgba(0,0,0,0.34)] sm:bottom-6 sm:right-6 sm:h-12 sm:w-12 no-print"
      aria-label="Kembali ke atas"
      @click="scrollTop"
    >
      <i class="pi pi-arrow-up" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
const visible = ref(false)
let updateFrame = 0

onMounted(() => {
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  document.addEventListener('scroll', scheduleUpdate, { passive: true })
  update()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scheduleUpdate)
  document.removeEventListener('scroll', scheduleUpdate)
  if (updateFrame) window.cancelAnimationFrame(updateFrame)
})

function scheduleUpdate() {
  if (updateFrame) return
  updateFrame = window.requestAnimationFrame(() => {
    updateFrame = 0
    update()
  })
}

function update() {
  visible.value = currentScrollY() > 280
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
  document.body.scrollTo({ top: 0, behavior: 'smooth' })
}

function currentScrollY() {
  return Math.max(
    window.scrollY || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0,
  )
}
</script>
