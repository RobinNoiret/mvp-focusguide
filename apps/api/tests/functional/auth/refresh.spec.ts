import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth - Refresh', (group) => {
  group.each.setup(async () => {
    // Cleanup users table before each test
    await User.query().delete()
  })

  test('POST /v1/auth/refresh returns new access token with valid refresh token', async ({
    client,
    assert,
  }) => {
    // Create user and login to get tokens
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

    const refreshToken = loginResponse.body().refreshToken

    const response = await client.post('/v1/auth/refresh').json({
      refreshToken: refreshToken,
    })

    response.assertStatus(200)
    assert.properties(response.body(), ['accessToken'])
    assert.isString(response.body().accessToken)
  })

  test('POST /v1/auth/refresh rejects invalid refresh token', async ({ client }) => {
    const response = await client.post('/v1/auth/refresh').json({
      refreshToken: 'invalid-token',
    })

    response.assertStatus(401)
    response.assertBodyContains({ error: 'Invalid refresh token' })
  })

  test('POST /v1/auth/refresh validates required fields', async ({ client }) => {
    const response = await client.post('/v1/auth/refresh').json({})

    response.assertStatus(422)
  })
})
