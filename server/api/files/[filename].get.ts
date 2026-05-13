import { promises as fs, createReadStream } from 'node:fs'
import path from 'node:path'
import { sendStream } from 'h3'

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename')
  if (!filename) throw createError({ statusCode: 400, statusMessage: 'Bad Request' })

  // prevent path traversal
  const safeFilename = path.basename(filename)
  const uploadDir = process.env.UPLOAD_DIR || './uploads'
  const filePath = path.join(uploadDir, safeFilename)

  try {
    const stat = await fs.stat(filePath)
    if (!stat.isFile()) throw new Error()
    
    // basic mime type detection
    const ext = path.extname(safeFilename).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
      '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf', '.zip': 'application/zip',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.csv': 'text/csv'
    }
    const contentType = mimeTypes[ext] || 'application/octet-stream'
    
    setResponseHeader(event, 'Content-Type', contentType)
    setResponseHeader(event, 'Content-Length', stat.size)
    setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    
    return sendStream(event, createReadStream(filePath))
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }
})
