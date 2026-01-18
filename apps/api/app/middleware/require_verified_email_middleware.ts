import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * RequireVerifiedEmail middleware
 *
 * Ensures the authenticated user has verified their email address.
 * Use this middleware on routes that require email verification.
 *
 * Returns 403 Forbidden with code 'EMAIL_NOT_VERIFIED' if email is not verified.
 */
export default class RequireVerifiedEmailMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    if (!user.emailVerified) {
      return response.forbidden({
        error: 'Email verification required',
        code: 'EMAIL_NOT_VERIFIED',
      })
    }

    return await next()
  }
}
