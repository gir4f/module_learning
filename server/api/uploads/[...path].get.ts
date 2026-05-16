import { createError, defineEventHandler, getRouterParam, setHeader, sendStream } from 'h3'
import { createReadStream } from 'node:fs'
import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'
import { uploadTargetPath } from '../../utils/uploads'

const mimeTypes: Record<string, string> = {
  '.csv': 'text/csv',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export default defineEventHandler(async (event) => {
  const rawPath = getRouterParam(event, 'path') || ''
  const filePath = rawPath.split('/').map(decodeURIComponent).join('/')
  if (!filePath || filePath.includes('..')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file path.' })
  }

  const config = useRuntimeConfig()
  const uploadRoot = resolve(config.uploadDir)
  const targetPath = uploadTargetPath(uploadRoot, filePath)
  if (!targetPath) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file path.' })
  }

  const stat = await fs.stat(targetPath).catch(() => null)
  if (!stat?.isFile()) {
    throw createError({ statusCode: 404, statusMessage: 'File not found.' })
  }

  const extension = targetPath.slice(targetPath.lastIndexOf('.')).toLowerCase()
  setHeader(event, 'Content-Type', mimeTypes[extension] || 'application/octet-stream')
  setHeader(event, 'Content-Length', stat.size)
  return sendStream(event, createReadStream(targetPath))
})
