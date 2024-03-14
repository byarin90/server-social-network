import axios from 'axios'
import { ZodError } from 'zod'

interface TransformedError {
  statusCode: number
  type: string
  message: string
  stack: string
}
export type TransformError = (e: any) => TransformedError

class StandardError extends Error {
  type: string

  statusCode: number

  constructor (message: string, type?: string, statusCode?: number) {
    super(message)

    this.type = type ?? 'INTERNAL_ERROR'
    this.statusCode = statusCode ?? 500
  }
}

const transformError: TransformError = (e) => {
  // Initialize with default values
  const error: TransformedError = {
    statusCode: 500, // Default to internal server error code
    type: 'INTERNAL_ERROR', // Default error type
    message: 'An unexpected server error occurred', // Default message
    stack: e?.stack ?? 'Stack unavailable' // Use the provided stack or a default message
  }

  if (e instanceof ZodError) {
    error.statusCode = 400
    error.type = 'CLIENT_ERROR'

    if (e.errors && Array.isArray(e.errors) && e.errors.length > 0) {
      const firstError = e.errors[0]

      error.message = firstError.message ? `${firstError.path.join('.')} ${firstError.message}` : 'Validation error'
    }
  } else if (axios.isAxiosError(e)) {
    error.statusCode = Number(e.response?.status ?? 500)
    error.type = 'INTERNAL_ERROR'
    error.message = e.response?.data?.message ?? 'An unexpected server error occurred'
  } else {
    error.statusCode = e?.statusCode ?? 500
    error.type = e?.type ?? 'INTERNAL_ERROR'
    error.message = e?.message ?? 'An unexpected server error occurred'
  }

  // No need to assign the stack here as it's already done in the initial value

  return error
}

export {
  StandardError,
  transformError,
  type TransformedError
}
