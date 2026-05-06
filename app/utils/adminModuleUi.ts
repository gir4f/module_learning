import type { AttachmentType, LearningModule } from '~/types/learning'

export type AdminModuleCategory = 'device' | 'cable' | 'sop' | 'accessory'
export type AdminHealthValue = 'ready' | 'needs-work' | 'incomplete'

export function componentCount(module: LearningModule) {
  return module.details.reduce((total, detail) => total + detail.components.length, 0)
}

export function attachmentCount(module: LearningModule) {
  return module.details.reduce((total, detail) => total + detail.attachments.length, 0)
}

export function adminModuleCategory(module: Pick<LearningModule, 'slug' | 'title' | 'keywords'>): AdminModuleCategory {
  const text = [module.slug, module.title, module.keywords].join(' ').toLowerCase()
  if (text.includes('alur') || text.includes('sop')) return 'sop'
  if (text.includes('kabel') || text.includes('cable')) return 'cable'
  if (text.includes('accessory') || text.includes('alarm') || text.includes('line-driver') || text.includes('idletimer')) return 'accessory'
  return 'device'
}

export function moduleCategoryLabel(module: Pick<LearningModule, 'slug' | 'title' | 'keywords'>) {
  const category = adminModuleCategory(module)
  if (category === 'device') return 'Device'
  if (category === 'cable') return 'Cable'
  if (category === 'sop') return 'SOP'
  return 'Accessory'
}

export function categoryIcon(module: Pick<LearningModule, 'slug' | 'title' | 'keywords'>) {
  const category = adminModuleCategory(module)
  if (category === 'device') return 'pi pi-bolt'
  if (category === 'cable') return 'pi pi-link'
  if (category === 'sop') return 'pi pi-file'
  return 'pi pi-cog'
}

export function categoryIconClass(module: Pick<LearningModule, 'slug' | 'title' | 'keywords'>) {
  const category = adminModuleCategory(module)
  if (category === 'device') return 'bg-gradient-to-br from-brand-teal to-brand-teal-dark'
  if (category === 'cable') return 'bg-gradient-to-br from-amber-400 to-orange-500'
  if (category === 'sop') return 'bg-gradient-to-br from-purple-500 to-fuchsia-600'
  return 'bg-gradient-to-br from-slate-500 to-slate-700'
}

export function categoryPillClass(module: Pick<LearningModule, 'slug' | 'title' | 'keywords'>) {
  const category = adminModuleCategory(module)
  if (category === 'device') return 'bg-cyan-50 text-brand-teal dark:bg-cyan-950/50 dark:text-cyan-200'
  if (category === 'cable') return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200'
  if (category === 'sop') return 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-200'
  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
}

export function moduleHealth(module: LearningModule) {
  let score = 0
  if (module.title && module.slug) score += 25
  if (module.description) score += 20
  if (module.details.length) score += 25
  if (componentCount(module) || attachmentCount(module)) score += 20
  if (module.status === 'PUBLISHED') score += 10

  if (score >= 80) return { score, label: 'Ready', value: 'ready' as AdminHealthValue, barClass: 'bg-emerald-500' }
  if (score >= 50) return { score, label: 'Needs work', value: 'needs-work' as AdminHealthValue, barClass: 'bg-amber-500' }
  return { score, label: 'Incomplete', value: 'incomplete' as AdminHealthValue, barClass: 'bg-red-500' }
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
  }).format(new Date(value))
}

export function moduleCsvRows(modules: LearningModule[]) {
  return [
    ['Title', 'Slug', 'Status', 'Category', 'Sections', 'Components', 'Attachments', 'Health', 'Updated At'],
    ...modules.map((module) => [
      module.title,
      module.slug,
      module.status,
      moduleCategoryLabel(module),
      module.details.length,
      componentCount(module),
      attachmentCount(module),
      moduleHealth(module).label,
      module.updatedAt || '',
    ]),
  ]
}

export function toCsv(rows: Array<Array<string | number>>) {
  return rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
}
