import { describe, expect, it } from 'vitest'
import { seedModules } from '../../app/data/seedModules'

describe('seed modules', () => {
  it('preserves the current 13 learning modules', () => {
    expect(seedModules).toHaveLength(13)
  })

  it('keeps component-table content in structured rows', () => {
    const componentCount = seedModules.flatMap((module) => module.details).reduce(
      (count, detail) => count + detail.components.length,
      0,
    )

    expect(componentCount).toBeGreaterThanOrEqual(140)
  })

  it('includes the static image attachments used by learner pages', () => {
    const attachments = seedModules.flatMap((module) => module.details.flatMap((detail) => detail.attachments))

    expect(attachments.some((attachment) => attachment.url.includes('Alurkerja.png'))).toBe(true)
    expect(attachments.some((attachment) => attachment.url.includes('Device%20Speed%20Uni.jpg'))).toBe(true)
  })
})
