<template>
  <button
    v-if="visible"
    type="button"
    class="fixed bottom-5 right-5 z-30 rounded-full bg-brand-teal p-3 text-white shadow-lg transition hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-cyan-100 no-print"
    aria-label="Kembali ke atas"
    @click="scrollTop"
  >
    <i class="pi pi-arrow-up" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
const visible = ref(false)

onMounted(() => {
  window.addEventListener('scroll', update, { passive: true })
  update()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', update)
})

function update() {
  visible.value = window.scrollY > 300
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
