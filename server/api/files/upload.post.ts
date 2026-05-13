import { promises as fs } from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.data.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const uploadDir = process.env.UPLOAD_DIR || './uploads'
  await fs.mkdir(uploadDir, { recursive: true })

  const uploadedFiles = []

  for (const part of formData) {
    if (part.filename && part.data) {
      const ext = path.extname(part.filename)
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 10000)}${ext}`
      const filePath = path.join(uploadDir, uniqueName)
      
      await fs.writeFile(filePath, part.data)
      
      uploadedFiles.push({
        url: `/api/files/${uniqueName}`,
        filePath,
        title: part.filename,
        mimeType: part.type || 'application/octet-stream',
        sizeBytes: part.data.length
      })
    }
  }

  return { files: uploadedFiles }
})
