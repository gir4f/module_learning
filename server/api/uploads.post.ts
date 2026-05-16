import { createError, defineEventHandler, readMultipartFormData } from 'h3'
import { promises as fs } from 'node:fs'
import { extname, resolve } from 'node:path'
import sharp from 'sharp'
import { requireAdmin } from '../utils/auth'
import { previewFilePathFor, uploadTargetPath } from '../utils/uploads'

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])

const extensionMimeTypes: Record<string, string> = {
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

function sanitizeFileName(fileName: string) {
  const cleaned = fileName
    .trim()
    .replace(/[\\/]/g, '-')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return cleaned || 'upload'
}

function mimeTypeFromFileName(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''
  return extensionMimeTypes[extension] || ''
}

/** Maximum upload size: 10 MB */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const PREVIEW_MAX_WIDTH = 960
const PREVIEW_WEBP_QUALITY = 80

function shouldGeneratePreview(mimeType: string) {
  return mimeType === 'image/jpeg' || mimeType === 'image/png' || mimeType === 'image/webp'
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === 'file' && part.filename)
  if (!file?.data || !file.filename) {
    throw createError({ statusCode: 422, statusMessage: 'A file is required.' })
  }

  if (file.data.byteLength > MAX_UPLOAD_BYTES) {
    throw createError({ statusCode: 422, statusMessage: `File exceeds maximum size of ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.` })
  }

  const mimeType = file.type && file.type !== 'application/octet-stream'
    ? file.type
    : mimeTypeFromFileName(file.filename)
  if (!allowedMimeTypes.has(mimeType)) {
    throw createError({ statusCode: 422, statusMessage: 'Unsupported file type.' })
  }

  const config = useRuntimeConfig()
  const uploadRoot = resolve(config.uploadDir)
  await fs.mkdir(uploadRoot, { recursive: true })

  const originalName = sanitizeFileName(file.filename)
  const extension = extname(originalName)
  const baseName = sanitizeFileName(originalName.slice(0, originalName.length - extension.length))
  const fileName = `${Date.now()}-${baseName}${extension}`
  const targetPath = uploadTargetPath(uploadRoot, fileName)
  if (!targetPath) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid upload path.' })
  }

  await fs.writeFile(targetPath, file.data)

  let previewFilePath: string | undefined
  let previewSizeBytes: number | undefined
  if (shouldGeneratePreview(mimeType)) {
    previewFilePath = previewFilePathFor(fileName)
    const previewPath = uploadTargetPath(uploadRoot, previewFilePath)
    if (previewPath) {
      try {
        await sharp(file.data)
          .rotate()
          .resize({ width: PREVIEW_MAX_WIDTH, withoutEnlargement: true })
          .webp({ quality: PREVIEW_WEBP_QUALITY })
          .toFile(previewPath)
        const previewStat = await fs.stat(previewPath)
        previewSizeBytes = previewStat.size
      } catch {
        previewFilePath = undefined
        previewSizeBytes = undefined
      }
    }
  }

  return {
    url: `/api/uploads/${encodeURIComponent(fileName)}`,
    filePath: fileName,
    mimeType,
    sizeBytes: file.data.byteLength,
    fileName: originalName,
    previewUrl: previewFilePath ? `/api/uploads/${encodeURIComponent(previewFilePath)}` : undefined,
    previewFilePath,
    previewMimeType: previewFilePath ? 'image/webp' : undefined,
    previewSizeBytes,
  }
})
