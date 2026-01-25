import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { sendErrorResponse, isAppException } from '#exceptions/error_formatter'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    // Handle our custom AppException classes
    if (isAppException(error)) {
      return sendErrorResponse(ctx, error)
    }

    // Handle AdonisJS validation errors with custom formatting
    if (error instanceof Error && error.message.includes('E_VALIDATION_ERROR')) {
      return sendErrorResponse(ctx, error)
    }

    // Log unexpected errors
    logger.error({ err: error }, 'Unhandled exception in request')

    // For unhandled errors, fall back to default handler
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    // Log custom exceptions with context
    if (isAppException(error)) {
      logger.warn(
        {
          code: error.errorCode,
          statusCode: error.statusCode,
          details: error.details,
          path: ctx.request.url(),
          method: ctx.request.method(),
        },
        error.message
      )
      return
    }

    // Let parent handle reporting for other errors
    return super.report(error, ctx)
  }
}
