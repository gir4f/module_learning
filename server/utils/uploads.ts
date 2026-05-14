import { promises as fs } from 'node:fs'
import { extname, resolve } from 'node:path'

export function previewFilePathFor(filePath: string) {
  const extension = extname(filePath)
  if (!extension) return `${filePath}.preview.webp`
  return `${filePath.slice(0, -extension.length)}.preview.webp`
}

export function uploadTargetPath(uploadRoot: string, filePath: string) {
  const targetPath = resolve(uploadRoot, filePath)
  if (!targetPath.startsWith(uploadRoot)) return null
  return targetPath
}

export async function deleteUploadedFileWithPreview(uploadRoot: string, filePath?: string | null) {
  if (!filePath) return

  const targetPath = uploadTargetPath(uploadRoot, filePath)
  if (targetPath) await fs.unlink(targetPath).catch(() => undefined)

  const previewPath = uploadTargetPath(uploadRoot, previewFilePathFor(filePath))
  if (previewPath) await fs.unlink(previewPath).catch(() => undefined)
}
