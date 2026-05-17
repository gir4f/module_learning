import type { LearningModule } from '~/types/learning'

export type ModuleCategory = 'semua' | 'device' | 'kabel' | 'aksesori' | 'sop'
export type ModuleSort = 'default' | 'newest' | 'oldest' | 'alpha'

export const categoryTabs: Array<{ label: string, value: ModuleCategory }> = [
  { label: 'Semua', value: 'semua' },
  { label: 'Device', value: 'device' },
  { label: 'Kabel', value: 'kabel' },
  { label: 'Aksesori', value: 'aksesori' },
  { label: 'SOP', value: 'sop' },
]

export const moduleSortOptions: Array<{ label: string, value: ModuleSort }> = [
  { label: 'Default', value: 'default' },
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'A-Z', value: 'alpha' },
]

export function sortModules(modules: LearningModule[], sort: ModuleSort) {
  const sorted = [...modules]
  if (sort === 'newest') {
    return sorted.sort((a, b) => dateValue(b.updatedAt || b.createdAt) - dateValue(a.updatedAt || a.createdAt) || a.title.localeCompare(b.title))
  }
  if (sort === 'oldest') {
    return sorted.sort((a, b) => dateValue(a.updatedAt || a.createdAt) - dateValue(b.updatedAt || b.createdAt) || a.title.localeCompare(b.title))
  }
  if (sort === 'alpha') {
    return sorted.sort((a, b) => a.title.localeCompare(b.title))
  }
  return sorted
}

export function moduleCategory(module: LearningModule): Exclude<ModuleCategory, 'semua'> {
  const text = [module.slug, module.title, module.keywords, module.description].join(' ').toLowerCase()
  if (text.includes('alur') || text.includes('sop') || text.includes('kerja')) return 'sop'
  if (text.includes('kabel') || text.includes('cable')) return 'kabel'
  if (text.includes('alarm') || text.includes('line') || text.includes('gyroscope') || text.includes('imu')) return 'aksesori'
  return 'device'
}

export function categoryLabel(category: string) {
  if (category === 'device') return 'Device'
  if (category === 'kabel') return 'Kabel'
  if (category === 'aksesori') return 'Aksesori'
  if (category === 'sop') return 'SOP'
  return 'Semua'
}

export function categoryClasses(category: string) {
  if (category === 'kabel') return 'border-category-cable bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-200'
  if (category === 'aksesori') return 'border-category-accessory bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
  if (category === 'sop') return 'border-category-sop bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-200'
  return 'border-category-device bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-200'
}

export function moduleIcon(module: LearningModule) {
  const text = [module.slug, module.title, module.keywords].join(' ').toLowerCase()
  if (text.includes('speed') || text.includes('limiter')) return 'pi pi-bolt'
  if (text.includes('fatigue') || text.includes('safety') || text.includes('fire')) return 'pi pi-shield'
  if (text.includes('kabel')) return 'pi pi-link'
  if (text.includes('alur')) return 'pi pi-sitemap'
  if (text.includes('gyro') || text.includes('imu')) return 'pi pi-compass'
  return 'pi pi-cog'
}

function dateValue(value?: string | null) {
  if (!value) return 0
  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}
