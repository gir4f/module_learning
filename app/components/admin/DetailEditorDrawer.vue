<template>
  <Drawer
    :visible="visible"
    position="right"
    class="!w-full lg:!w-[58rem]"
    :pt="drawerPt"
    @update:visible="$emit('update:visible', $event)"
  >
    <template #header>
      <div>
        <p class="text-xs font-bold uppercase tracking-wide text-brand-teal dark:text-cyan-300">{{ detail?.id ? 'Edit detail' : 'Create detail' }}</p>
        <h2 class="text-xl font-bold text-slate-950 dark:text-white">{{ detail?.title || 'New Detail Section' }}</h2>
      </div>
    </template>

    <form class="grid gap-5" @submit.prevent="submit">
      <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div class="grid gap-4 md:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Title <span class="text-red-500">*</span></span>
            <InputText v-model="form.title" :invalid="Boolean(errors.title)" placeholder="Example: Fatigue Merah Putih" />
            <small v-if="errors.title" class="text-red-600 dark:text-red-300">{{ errors.title }}</small>
          </label>
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Slug</span>
            <InputText v-model="form.slug" placeholder="Auto-generated when empty" />
            <small class="text-xs text-slate-500 dark:text-slate-400">Unique within this module.</small>
          </label>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <label class="grid gap-2">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Summary</span>
          <Textarea v-model="form.summary" rows="2" placeholder="Short section summary for admins and learners" />
        </label>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Keywords</span>
            <InputText v-model="form.keywords" placeholder="pcb, cable, top, bot" />
          </label>
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Sort Order</span>
            <InputNumber v-model="form.sortOrder" class="w-full" />
          </label>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div>
            <h3 class="font-bold text-slate-950 dark:text-white">Component Rows</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Every filled row must include name, quantity, and unit.</p>
          </div>
          <Button type="button" label="Add Row" icon="pi pi-plus" size="small" @click="addRow" />
        </div>

        <DataTable :value="form.components" data-key="_key" :pt="componentEditorPt" table-style="min-width: 920px">
          <template #empty>
            <div class="px-6 py-8">
              <EmptyState title="No component rows" description="Add a row if this section needs a structured parts table." icon="pi pi-table">
                <Button type="button" label="Add Row" icon="pi pi-plus" @click="addRow" />
              </EmptyState>
            </div>
          </template>
          <Column header="CATEGORY">
            <template #body="{ data }"><InputText v-model="data.category" class="w-full !text-sm" placeholder="PCB / Top / Kabel" /></template>
          </Column>
          <Column header="NAME">
            <template #body="{ data }"><InputText v-model="data.name" class="w-full !text-sm" placeholder="Component name" /></template>
          </Column>
          <Column header="QTY">
            <template #body="{ data }"><InputText v-model="data.quantity" class="w-full !text-sm" placeholder="1" /></template>
          </Column>
          <Column header="UNIT">
            <template #body="{ data }"><InputText v-model="data.unit" class="w-full !text-sm" placeholder="pcs" /></template>
          </Column>
          <Column header="NOTE">
            <template #body="{ data }"><InputText v-model="data.note" class="w-full !text-sm" placeholder="Substitution / note" /></template>
          </Column>
          <Column header="">
            <template #body="{ index }">
              <div class="flex justify-end gap-1">
                <Button type="button" icon="pi pi-arrow-up" text rounded :disabled="index === 0" aria-label="Move component up" @click="moveRow(index, -1)" />
                <Button type="button" icon="pi pi-arrow-down" text rounded :disabled="index === form.components.length - 1" aria-label="Move component down" @click="moveRow(index, 1)" />
                <Button type="button" icon="pi pi-trash" severity="danger" text rounded aria-label="Remove component row" @click="removeRow(index)" />
              </div>
            </template>
          </Column>
        </DataTable>
        <small v-if="errors.components" class="block border-t border-red-100 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">{{ errors.components }}</small>
      </div>

      <p v-if="formError" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">{{ formError }}</p>

      <div class="sticky bottom-0 -mx-1 flex justify-end gap-2 border-t border-slate-200 bg-white/95 px-1 pt-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <Button type="button" label="Cancel" severity="secondary" outlined @click="$emit('update:visible', false)" />
        <Button type="submit" label="Save Detail" icon="pi pi-save" />
      </div>
    </form>
  </Drawer>
</template>

<script setup lang="ts">
import type { ComponentItem, ModuleDetail } from '~/types/learning'
import EmptyState from '~/components/shared/EmptyState.vue'

type EditableComponent = ComponentItem & { _key: string }

const props = defineProps<{
  visible: boolean
  detail?: ModuleDetail | null
  error?: string
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  save: [payload: {
    title: string
    slug: string
    summary: string
    keywords: string
    sortOrder: number
    components: Array<{
      category: string | null
      name: string
      quantity: string
      unit: string
      note: string | null
      sortOrder: number
    }>
  }]
}>()

const formError = computed(() => props.error || '')
const errors = reactive<Record<string, string>>({})
const form = reactive({
  title: '',
  slug: '',
  summary: '',
  keywords: '',
  sortOrder: 0,
  components: [] as EditableComponent[],
})

watch(() => props.detail, (detail) => {
  form.title = detail?.title || ''
  form.slug = detail?.slug || ''
  form.summary = detail?.summary || ''
  form.keywords = detail?.keywords || ''
  form.sortOrder = detail?.sortOrder || 0
  form.components = (detail?.components || []).map((component, index) => ({
    ...component,
    _key: component.id || `${component.name}-${index}`,
    category: component.category || '',
    note: component.note || '',
  }))
  clearRecord(errors)
}, { immediate: true })

function componentPayload() {
  return form.components
    .map((component, index) => ({
      category: component.category || null,
      name: component.name.trim(),
      quantity: component.quantity.trim(),
      unit: component.unit.trim(),
      note: component.note || null,
      sortOrder: index,
    }))
    .filter((component) => component.name || component.quantity || component.unit || component.note)
}

function submit() {
  clearRecord(errors)
  if (!form.title.trim()) errors.title = 'Detail title is required.'
  if (componentPayload().some((component) => !component.name || !component.quantity || !component.unit)) {
    errors.components = 'Every filled component row must include name, quantity, and unit.'
  }
  if (errors.title || errors.components) return
  emit('save', {
    title: form.title,
    slug: form.slug,
    summary: form.summary,
    keywords: form.keywords,
    sortOrder: form.sortOrder,
    components: componentPayload(),
  })
}

function addRow() {
  form.components.push({
    _key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    category: '',
    name: '',
    quantity: '',
    unit: '',
    note: '',
    sortOrder: form.components.length,
  })
}

function removeRow(index: number) {
  form.components.splice(index, 1)
}

function moveRow(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= form.components.length) return
  const [row] = form.components.splice(index, 1)
  form.components.splice(target, 0, row)
}

function clearRecord(record: Record<string, string>) {
  Object.keys(record).forEach((key) => {
    delete record[key]
  })
}

const drawerPt = {
  root: { class: '!bg-white dark:!bg-slate-950' },
  header: { class: '!border-b !border-slate-200 dark:!border-slate-800 !px-6 !py-5' },
  content: { class: '!px-6 !py-5' },
}

const componentEditorPt = {
  tableContainer: { class: 'overflow-x-auto' },
  table: { class: 'w-full text-left text-sm text-slate-500 dark:text-slate-300' },
  thead: { class: 'bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400' },
  headerRow: { class: 'border-b border-slate-200 dark:border-slate-800' },
  headerCell: { class: 'border-0 bg-slate-50 px-3 py-3 font-bold tracking-wide dark:bg-slate-900' },
  bodyRow: { class: 'border-b border-slate-100 bg-white transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800' },
  bodyCell: { class: 'border-0 px-3 py-3 align-middle' },
}
</script>
