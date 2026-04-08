import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import User from '#models/user'
import VerificationToken from '#models/verification_token'
import { emailService } from '#services/email_service'
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  verifyEmailValidator,
} from '#validators/auth_validator'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    // Check if user exists
    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      return response.conflict({ error: 'Email already registered' })
    }

    const user = await User.create({
      email: data.email,
      password: data.password, // Auto-hashed by beforeSave hook
      name: data.name,
      emailVerified: false,
      pomodoroSettings: {
        focusDuration: 25,
        breakDuration: 5,
        repetitions: 3,
        autoSwitch: false,
      },
    })

    // Generate verification token (24h expiry)
    const token = randomUUID()
    const expiresAt = DateTime.now().plus({ hours: 24 })

    await VerificationToken.create({
      userId: user.id,
      token,
      type: 'email_verification',
      expiresAt,
    })

    // Send verification email (don't fail registration if email fails)
    try {
      await emailService.sendVerificationEmail(user, token)
    } catch (error) {
      console.error('Failed to send verification email:', error)
    }

    return response.created({
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)

      // Generate access token (15 minutes)
      const accessToken = await User.accessTokens.create(user, ['*'], {
        expiresIn: '15 minutes',
        name: 'access_token',
      })

      // Generate refresh token (7 days)
      const refreshToken = await User.accessTokens.create(user, ['*'], {
        expiresIn: '7 days',
        name: 'refresh_token',
      })

      return response.ok({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          flOnboarding: user.flOnboarding,
          pomodoroSettings: user.pomodoroSettings,
        },
        accessToken: accessToken.value!.release(),
        refreshToken: refreshToken.value!.release(),
      })
    } catch (error) {
      return response.badRequest({ error: 'Invalid credentials' })
    }
  }

  async refresh({ request, response, auth }: HttpContext) {
    const { refreshToken } = await request.validateUsing(refreshTokenValidator)

    try {
      // Temporarily set the Authorization header to use auth system for verification
      request.request.headers.authorization = `Bearer ${refreshToken}`

      // Use the auth system to verify the token
      await auth.use('api').authenticate()
      const user = auth.use('api').user!

      // Generate new access token
      const newAccessToken = await User.accessTokens.create(user, ['*'], {
        expiresIn: '15 minutes',
        name: 'access_token',
      })

      return response.ok({
        accessToken: newAccessToken.value!.release(),
      })
    } catch (error) {
      return response.unauthorized({ error: 'Invalid refresh token' })
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = await auth.authenticateUsing(['api'])
    const token = (user as any).currentAccessToken

    if (token) {
      await User.accessTokens.delete(user, token.identifier)
    }

    return response.ok({ message: 'Logged out successfully' })
  }

  async verifyEmail({ request, response }: HttpContext) {
    const { token } = await request.validateUsing(verifyEmailValidator)

    // Find token
    const verificationToken = await VerificationToken.query()
      .where('token', token)
      .where('type', 'email_verification')
      .preload('user')
      .first()

    if (!verificationToken) {
      return response.badRequest({ error: 'Invalid verification token' })
    }

    // Check expiry
    if (verificationToken.isExpired()) {
      await verificationToken.delete()
      return response.badRequest({ error: 'Verification token expired' })
    }

    // Mark user as verified
    verificationToken.user.emailVerified = true
    await verificationToken.user.save()

    // Delete token (one-time use)
    await verificationToken.delete()

    return response.ok({
      message: 'Email verified successfully',
      user: {
        id: verificationToken.user.id,
        email: verificationToken.user.email,
        name: verificationToken.user.name,
        emailVerified: verificationToken.user.emailVerified,
      },
    })
  }

  async resendVerification({ auth, response }: HttpContext) {
    const user = auth.user!

    // Check if already verified
    if (user.emailVerified) {
      return response.badRequest({ error: 'Email already verified' })
    }

    // Delete old tokens
    await VerificationToken.query()
      .where('user_id', user.id)
      .where('type', 'email_verification')
      .delete()

    // Generate new token
    const token = randomUUID()
    const expiresAt = DateTime.now().plus({ hours: 24 })

    await VerificationToken.create({
      userId: user.id,
      token,
      type: 'email_verification',
      expiresAt,
    })

    // Send email
    try {
      await emailService.sendVerificationEmail(user, token)
    } catch (error) {
      console.error('Failed to send verification email:', error)
      return response.internalServerError({ error: 'Failed to send email' })
    }

    return response.ok({ message: 'Verification email sent' })
  }
}
