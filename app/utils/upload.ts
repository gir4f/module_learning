const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])

const FILE_EXTENSION_MIME_TYPES: Record<string, string> = {
  csv: 'text/csv',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  pdf: 'application/pdf',
  png: 'image/png',
  webp: 'image/webp',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export function sanitizeFileName(fileName: string) {
  const cleaned = fileName
    .trim()
    .replace(/[\\/]/g, '-')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return cleaned || 'module-asset'
}

export function mimeTypeFromFileName(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''
  return FILE_EXTENSION_MIME_TYPES[extension] || ''
}

export function normalizedUploadMimeType(fileName: string, mimeType?: string) {
  return mimeType || mimeTypeFromFileName(fileName)
}

export function isAllowedUploadMimeType(fileName: string, mimeType?: string) {
  return ALLOWED_UPLOAD_MIME_TYPES.has(normalizedUploadMimeType(fileName, mimeType))
}

export function attachmentTypeFromMimeType(mimeType: string) {
  if (mimeType.startsWith('image/')) return 'IMAGE'
  if (mimeType === 'text/csv' || mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'SPREADSHEET'
  return 'FILE'
}

export async function uploadFile(file: File, title?: string): Promise<{ url: string, filePath: string, mimeType: string, sizeBytes: number, fileName: string }> {
  const formData = new FormData()
  formData.append('file', file)
  if (title) formData.append('title', title)
  return $fetch('/api/uploads', { method: 'POST', body: formData })
}
