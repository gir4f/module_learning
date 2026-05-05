import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '../../utils/auth'
import { validationError } from '../../utils/apiError'

const signPayloadSchema = z.object({
  path: z.string().trim().min(1, 'Required'),
  contentType: z.string().trim().min(1, 'Required'),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const parsed = signPayloadSchema.safeParse(await readBody(event))
  if (!parsed.success) throw validationError(parsed.error)

  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceKey = config.supabaseServiceRoleKey

  if (!supabaseUrl || !serviceKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase server credentials are not configured.',
    })
  }

  const supabase = createClient(supabaseUrl, serviceKey)
  const bucket = config.public.moduleAssetsBucket
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(parsed.data.path)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
