import { describe, expect, it } from 'vitest'
import {
  attachmentTypeFromMimeType,
  isAllowedUploadMimeType,
  normalizedUploadMimeType,
  sanitizeFileName,
} from '../../app/utils/upload'

describe('upload utilities', () => {
  it('sanitizes unsafe file names for storage paths', () => {
    expect(sanitizeFileName('GT GY2 & wiring/photo.png')).toBe('GT-GY2-wiring-photo.png')
    expect(sanitizeFileName('   ')).toBe('module-asset')
  })

  it('normalizes and validates supported upload MIME types', () => {
    expect(normalizedUploadMimeType('parts.xlsx', '')).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    expect(isAllowedUploadMimeType('parts.xlsx', '')).toBe(true)
    expect(isAllowedUploadMimeType('script.exe', 'application/octet-stream')).toBe(false)
  })

  it('maps MIME types to attachment types', () => {
    expect(attachmentTypeFromMimeType('image/png')).toBe('IMAGE')
    expect(attachmentTypeFromMimeType('text/csv')).toBe('SPREADSHEET')
    expect(attachmentTypeFromMimeType('application/pdf')).toBe('FILE')
  })
})
