<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 backdrop-blur-none"
      enter-to-class="opacity-100 backdrop-blur-sm"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 backdrop-blur-sm"
      leave-to-class="opacity-0 backdrop-blur-none"
    >
      <div
        v-if="image"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 no-print backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      :aria-label="image.title"
      @click.self="$emit('close')"
    >
      <div class="w-full max-w-5xl">
        <div class="mb-3 flex items-center justify-between gap-3 text-white">
          <h2 class="font-bold">{{ image.title }}</h2>
          <button
            ref="closeButton"
            type="button"
            class="rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-100"
            aria-label="Tutup preview"
            @click="$emit('close')"
          >
            <i class="pi pi-times" aria-hidden="true" />
          </button>
        </div>
        <NuxtImg
          :src="image.url"
          :alt="image.title"
          format="webp"
          class="max-h-[80vh] w-full rounded-lg bg-white object-contain"
        />
      </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Attachment } from '~/types/learning'

defineProps<{
  image: Attachment | null
}>()

const emit = defineEmits<{
  close: []
}>()

const closeButton = ref<HTMLButtonElement | null>(null)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

watch(closeButton, () => {
  closeButton.value?.focus()
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}
</script>
