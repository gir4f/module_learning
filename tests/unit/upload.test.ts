import { describe, expect, it } from 'vitest'
import {
  attachmentTypeFromMimeType,
  isAllowedUploadMimeType,
  normalizedUploadMimeType,
  previewFilePathFor,
  sanitizeFileName,
} from '../../app/utils/upload'
import { uploadTargetPath } from '../../server/utils/uploads'

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

  it('derives deterministic preview paths for image thumbnails', () => {
    expect(previewFilePathFor('1778763976767-maxresdefault.jpg')).toBe('1778763976767-maxresdefault.preview.webp')
    expect(previewFilePathFor('image')).toBe('image.preview.webp')
  })

  it('rejects upload paths outside the configured upload root', () => {
    const root = 'C:\\app\\uploads'
    expect(uploadTargetPath(root, 'photo.jpg')).toContain('photo.jpg')
    expect(uploadTargetPath(root, '..\\secret.env')).toBeNull()
  })
})
