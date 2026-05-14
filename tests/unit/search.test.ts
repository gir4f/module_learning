import { describe, expect, it } from 'vitest'
import { seedModules } from '../../app/data/seedModules'
import { moduleMatchesQuery } from '../../app/utils/search'

describe('module search', () => {
  it('matches module titles and detail titles', () => {
    const speedModule = seedModules.find((module) => module.slug === 'device-speed')

    expect(speedModule).toBeTruthy()
    expect(moduleMatchesQuery(speedModule!, 'speed forklift')).toBe(true)
  })

  it('matches component names across details', () => {
    const pidsModule = seedModules.find((module) => module.slug === 'pids')

    expect(pidsModule).toBeTruthy()
    expect(moduleMatchesQuery(pidsModule!, 'max485')).toBe(true)
  })

  it('requires every query word to match', () => {
    const alarmModule = seedModules.find((module) => module.slug === 'alarm')

    expect(alarmModule).toBeTruthy()
    expect(moduleMatchesQuery(alarmModule!, 'alarm max485')).toBe(false)
  })
})
