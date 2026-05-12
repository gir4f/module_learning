import { describe, expect, it } from 'vitest'
import type { LearningModule } from '../../app/types/learning'
import {
  attachmentCount,
  componentCount,
  formatAdminDate,
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

  it('formats admin dates', () => {
    expect(formatAdminDate('2026-05-12T00:00:00.000Z')).toContain('2026')
    expect(formatAdminDate()).toBe('No date')
  })
})
