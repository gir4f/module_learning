import axios from 'axios'
import type { ApiErrorShape } from '~/types/learning'

export function apiErrorMessage(error: unknown, fallback = 'Request failed.') {
  const data = apiErrorData(error)
  if (data?.statusMessage) return data.statusMessage
  if (data?.message) return data.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export function apiFieldErrors(error: unknown) {
  return apiErrorData(error)?.fieldErrors || {}
}

export function assignFieldErrors(target: Record<string, string>, source: Record<string, string>) {
  Object.keys(target).forEach((key) => {
    delete target[key]
  })
  Object.entries(source).forEach(([key, value]) => {
    target[key] = value
  })
}

type ApiErrorPayload = ApiErrorShape & {
  statusMessage?: string
}

function apiErrorData(error: unknown): ApiErrorPayload | undefined {
  if (axios.isAxiosError(error)) return error.response?.data as ApiErrorPayload | undefined
  return (error as { data?: ApiErrorPayload })?.data
}
