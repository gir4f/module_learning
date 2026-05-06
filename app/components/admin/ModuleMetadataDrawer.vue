<template>
  <Drawer
    :visible="visible"
    position="right"
    class="!w-full md:!w-[34rem]"
    :pt="drawerPt"
    @update:visible="$emit('update:visible', $event)"
  >
    <template #header>
      <div>
        <p class="text-xs font-bold uppercase tracking-wide text-brand-teal dark:text-cyan-300">{{ module?.id ? 'Edit module' : 'Create module' }}</p>
        <h2 class="text-xl font-bold text-slate-950 dark:text-white">{{ module?.id ? module.title : 'New Learning Module' }}</h2>
      </div>
    </template>

    <ModuleForm :module="module" @save="$emit('save', $event)" @cancel="$emit('update:visible', false)" />
  </Drawer>
</template>

<script setup lang="ts">
import type { LearningModule } from '~/types/learning'
import ModuleForm from '~/components/admin/ModuleForm.vue'

defineProps<{
  visible: boolean
  module?: Partial<LearningModule> | null
}>()

defineEmits<{
  'update:visible': [value: boolean]
  save: [payload: Partial<LearningModule>]
}>()

const drawerPt = {
  root: { class: '!bg-white dark:!bg-slate-950' },
  header: { class: '!border-b !border-slate-200 dark:!border-slate-800 !px-6 !py-5' },
  content: { class: '!px-6 !py-5' },
}
</script>
