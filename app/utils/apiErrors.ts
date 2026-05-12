import type { ApiErrorShape } from '~/types/learning'

export function apiErrorMessage(error: unknown, fallback = 'Request failed.') {
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export function apiFieldErrors(error: unknown) {
  const maybeFetchError = error as { data?: ApiErrorShape }
  return maybeFetchError?.data?.fieldErrors || {}
}

export function assignFieldErrors(target: Record<string, string>, source: Record<string, string>) {
  Object.keys(target).forEach((key) => {
    delete target[key]
  })
  Object.entries(source).forEach(([key, value]) => {
    target[key] = value
  })
}
