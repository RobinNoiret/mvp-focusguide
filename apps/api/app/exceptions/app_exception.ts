/**
 * Structured exception for API errors
 * All app errors should extend this for consistent error responses
 */
export class AppException extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppException'
  }
}

/**
 * Validation error with field-level details
 */
export class ValidationException extends AppException {
  constructor(
    message: string,
    public fieldErrors: Record<string, string[]>
  ) {
    super(422, 'VALIDATION_ERROR', message, fieldErrors)
    this.name = 'ValidationException'
  }
}

/**
 * Resource not found (404)
 */
export class NotFoundException extends AppException {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with id ${identifier} not found`
      : `${resource} not found`
    super(404, 'NOT_FOUND', message)
    this.name = 'NotFoundException'
  }
}

/**
 * Unauthorized (401)
 */
export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message)
    this.name = 'UnauthorizedException'
  }
}

/**
 * Forbidden (403)
 */
export class ForbiddenException extends AppException {
  constructor(message: string = 'Forbidden') {
    super(403, 'FORBIDDEN', message)
    this.name = 'ForbiddenException'
  }
}

/**
 * Bad request (400)
 */
export class BadRequestException extends AppException {
  constructor(message: string) {
    super(400, 'BAD_REQUEST', message)
    this.name = 'BadRequestException'
  }
}

/**
 * Conflict (409)
 */
export class ConflictException extends AppException {
  constructor(message: string) {
    super(409, 'CONFLICT', message)
    this.name = 'ConflictException'
  }
}
