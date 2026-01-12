import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
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
}
