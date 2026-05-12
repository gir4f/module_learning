import type { AttachmentType, LearningModule } from '~/types/learning'

export function componentCount(module: LearningModule) {
  return module.details.reduce((total, detail) => total + detail.components.length, 0)
}

export function attachmentCount(module: LearningModule) {
  return module.details.reduce((total, detail) => total + detail.attachments.length, 0)
}

export function attachmentTypeIcon(type: AttachmentType) {
  if (type === 'IMAGE') return 'pi pi-image'
  if (type === 'SPREADSHEET') return 'pi pi-table'
  if (type === 'LINK') return 'pi pi-external-link'
  return 'pi pi-file'
}

export function attachmentTypeClass(type: AttachmentType) {
  if (type === 'IMAGE') return 'bg-cyan-50 text-brand-teal dark:bg-cyan-950/50 dark:text-cyan-200'
  if (type === 'SPREADSHEET') return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200'
  if (type === 'LINK') return 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-200'
  return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
}

export function formatAdminDate(value?: string) {
  if (!value) return 'No date'
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}
