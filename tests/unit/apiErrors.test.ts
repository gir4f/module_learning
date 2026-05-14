import { describe, expect, it } from 'vitest'
import { apiErrorMessage, apiFieldErrors, assignFieldErrors } from '../../app/utils/apiErrors'

describe('api error helpers', () => {
  it('extracts field errors from fetch-style errors', () => {
    const error = { data: { message: 'Invalid', fieldErrors: { title: 'Required' } } }
    expect(apiFieldErrors(error)).toEqual({ title: 'Required' })
  })

  it('falls back to Error.message for toast text', () => {
    expect(apiErrorMessage(new Error('Nope'), 'Fallback')).toBe('Nope')
    expect(apiErrorMessage({}, 'Fallback')).toBe('Fallback')
  })

  it('replaces reactive error maps without preserving stale keys', () => {
    const target = { title: 'Old', slug: 'Old' }
    assignFieldErrors(target, { title: 'New' })
    expect(target).toEqual({ title: 'New' })
  })
})
