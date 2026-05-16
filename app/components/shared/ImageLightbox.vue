<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="image"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 no-print sm:backdrop-blur-sm"
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
          <img
            :src="image.url"
            :alt="image.title"
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

const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')

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

<style scoped>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 170ms ease-out;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>
