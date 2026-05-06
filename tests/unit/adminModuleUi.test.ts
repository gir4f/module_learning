import { describe, expect, it } from 'vitest'
import type { LearningModule } from '../../app/types/learning'
import {
  attachmentCount,
  adminModuleCategory,
  componentCount,
  moduleCsvRows,
  moduleHealth,
  toCsv,
} from '../../app/utils/adminModuleUi'

function moduleFactory(overrides: Partial<LearningModule> = {}): LearningModule {
  return {
    id: 'm1',
    slug: 'device-speed',
    title: 'Device Speed',
    description: 'Speed limiter module',
    keywords: 'device, speed',
    status: 'PUBLISHED',
    sortOrder: 0,
    details: [
      {
        id: 'd1',
        slug: 'speed-uni',
        title: 'Speed Uni',
        summary: 'Summary',
        keywords: '',
        sortOrder: 0,
        components: [
          { id: 'c1', name: 'PCB', quantity: '1', unit: 'pcs', note: null, category: 'PCB', sortOrder: 0 },
          { id: 'c2', name: 'Cable', quantity: '2', unit: 'pcs', note: null, category: 'Cable', sortOrder: 1 },
        ],
        attachments: [
          { id: 'a1', type: 'IMAGE', title: 'Photo', url: 'https://example.com/photo.png', sortOrder: 0 },
        ],
      },
    ],
    ...overrides,
  }
}

describe('adminModuleUi', () => {
  it('counts components and attachments', () => {
    const module = moduleFactory()
    expect(componentCount(module)).toBe(2)
    expect(attachmentCount(module)).toBe(1)
  })

  it('derives module category from slug and keywords', () => {
    expect(adminModuleCategory(moduleFactory({ slug: 'kabel-body', title: 'Kabel Body', keywords: 'cable' }))).toBe('cable')
    expect(adminModuleCategory(moduleFactory({ slug: 'alur-kerja', title: 'Alur Kerja', keywords: 'sop' }))).toBe('sop')
    expect(adminModuleCategory(moduleFactory({ slug: 'alarm', title: 'Alarm', keywords: 'accessory' }))).toBe('accessory')
  })

  it('scores health from existing module content', () => {
    expect(moduleHealth(moduleFactory()).value).toBe('ready')
    expect(moduleHealth(moduleFactory({ description: '', details: [], status: 'DRAFT' })).value).toBe('incomplete')
  })

  it('builds csv rows safely', () => {
    const csv = toCsv(moduleCsvRows([moduleFactory({ title: 'Device "Speed"' })]))
    expect(csv).toContain('"Device ""Speed"""')
    expect(csv).toContain('"Sections"')
  })
})
