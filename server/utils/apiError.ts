import { createError } from 'h3'
import type { ZodError } from 'zod'
import { zodFieldErrors } from '../../app/utils/validation'

export function validationError(error: ZodError) {
  return createError({
    statusCode: 422,
    statusMessage: 'Validation failed.',
    data: {
      message: 'Validation failed.',
      fieldErrors: zodFieldErrors(error),
    },
  })
}

export function notFound(message = 'Resource not found.') {
  return createError({
    statusCode: 404,
    statusMessage: message,
    data: { message },
  })
}
