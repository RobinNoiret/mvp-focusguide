import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth - Logout', (group) => {
  group.each.setup(async () => {
    // Cleanup users table before each test
    await User.query().delete()
  })

  test('POST /v1/auth/logout logs out authenticated user', async ({ client }) => {
    // Create user and login to get access token
    await User.create({
      email: 'test@example.com',
      password: 'SecurePassword123',
      name: 'Test User',
      emailVerified: false,
      pomodoroSettings: {},
    })

    const loginResponse = await client.post('/v1/auth/login').json({
      email: 'test@example.com',
      password: 'SecurePassword123',
    })

    const accessToken = loginResponse.body().accessToken

    const response = await client.post('/v1/auth/logout').bearerToken(accessToken)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Logged out successfully' })
  })

  test('POST /v1/auth/logout rejects unauthenticated request', async ({ client }) => {
    const response = await client.post('/v1/auth/logout')

    response.assertStatus(401)
  })

  test('POST /v1/auth/logout rejects invalid token', async ({ client }) => {
    const response = await client.post('/v1/auth/logout').bearerToken('invalid-token')

    response.assertStatus(401)
  })
})
