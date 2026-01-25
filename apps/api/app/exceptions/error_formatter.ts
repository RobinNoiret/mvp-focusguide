import type { HttpContext } from '@adonisjs/core/http'
import { AppException } from '#exceptions/app_exception'

/**
 * Standard error response format sent to client
 */
export interface ErrorResponse {
  error: {
    code: string
    message: string
    statusCode: number
    timestamp: string
    details?: Record<string, unknown>
  }
}

/**
 * Format and send error response to client
 */
export function sendErrorResponse(
  ctx: HttpContext,
  error: unknown
): ErrorResponse | null {
  const { response } = ctx
  const timestamp = new Date().toISOString()

  // Handle AppException and subclasses
  if (error instanceof AppException) {
    const errorResponse: ErrorResponse = {
      error: {
        code: error.errorCode,
        message: error.message,
        statusCode: error.statusCode,
        timestamp,
      },
    }

    // Include details if available
    if (error.details) {
      errorResponse.error.details = error.details
    }

    response.status(error.statusCode).json(errorResponse)
    return errorResponse
  }

  // Handle AdonisJS validation errors
  if (error instanceof Error && error.message.includes('E_VALIDATION_ERROR')) {
    const validationError = error as any

    // Extract field errors from AdonisJS validator
    const fieldErrors: Record<string, string[]> = {}
    if (validationError.messages) {
      Object.entries(validationError.messages).forEach(([field, messages]: [string, any]) => {
        fieldErrors[field] = Array.isArray(messages) ? messages : [messages]
      })
    }

    const errorResponse: ErrorResponse = {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        statusCode: 422,
        timestamp,
        details: fieldErrors,
      },
    }

    response.status(422).json(errorResponse)
    return errorResponse
  }

  // Default: Internal server error
  const statusCode = (error as any)?.status || 500
  const message = (error as any)?.message || 'Internal server error'

  const errorResponse: ErrorResponse = {
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
      statusCode,
      timestamp,
    },
  }

  response.status(statusCode).json(errorResponse)
  return errorResponse
}

/**
 * Check if error is an instance of our custom exceptions
 */
export function isAppException(error: unknown): error is AppException {
  return error instanceof AppException
}
