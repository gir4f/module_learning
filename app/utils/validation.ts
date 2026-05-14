import { z } from 'zod'
import { makeSlug } from './slug'

const attachmentUrlSchema = z.string().trim().min(1, 'Wajib diisi').refine((value) => {
  if (value.startsWith('/api/uploads/')) return true
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}, 'URL belum valid')

export const modulePayloadSchema = z.object({
  title: z.string().trim().min(1, 'Wajib diisi'),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional().nullable(),
  keywords: z.string().trim().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  sortOrder: z.coerce.number().int().default(0),
})

export const detailPayloadSchema = z.object({
  title: z.string().trim().min(1, 'Wajib diisi'),
  slug: z.string().trim().optional(),
  summary: z.string().trim().optional().nullable(),
  keywords: z.string().trim().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  components: z.array(z.object({
    id: z.string().optional(),
    category: z.string().trim().optional().nullable(),
    name: z.string().trim().min(1, 'Wajib diisi'),
    quantity: z.string().trim().min(1, 'Wajib diisi'),
    unit: z.string().trim().min(1, 'Wajib diisi'),
    note: z.string().trim().optional().nullable(),
    sortOrder: z.coerce.number().int().default(0),
  })).default([]),
})

export const attachmentPayloadSchema = z.object({
  type: z.enum(['IMAGE', 'SPREADSHEET', 'FILE', 'LINK']),
  title: z.string().trim().min(1, 'Wajib diisi'),
  url: attachmentUrlSchema,
  filePath: z.string().trim().optional().nullable(),
  mimeType: z.string().trim().optional().nullable(),
  sizeBytes: z.coerce.number().int().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
})

export function slugFromPayload(title: string, slug?: string) {
  return makeSlug(slug || title)
}

export function zodFieldErrors(error: z.ZodError) {
  return error.issues.reduce<Record<string, string>>((errors, issue) => {
    const key = issue.path.join('.') || 'form'
    errors[key] = issue.message
    return errors
  }, {})
}
