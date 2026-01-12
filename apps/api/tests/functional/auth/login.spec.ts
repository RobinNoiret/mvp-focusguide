import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth - Login', (group) => {
  group.each.setup(async () => {
    // Cleanup users table before each test
    await User.query().delete()
  })

  test('POST /v1/auth/login returns tokens for valid credentials', async ({ client, assert }) => {
    // Create user first
    await User.create({
      email: 'test@example.com',
      password: 'SecurePassword123',
      name: 'Test User',
      emailVerified: false,
      pomodoroSettings: {},
    })

    const response = await client.post('/v1/auth/login').json({
      email: 'test@example.com',
      password: 'SecurePassword123',
    })

    response.assertStatus(200)
    assert.properties(response.body(), ['user', 'accessToken', 'refreshToken'])
    assert.properties(response.body().user, ['id', 'email', 'name', 'emailVerified'])
    assert.isString(response.body().accessToken)
    assert.isString(response.body().refreshToken)
    assert.notExists(response.body().user.password)
  })

  test('POST /v1/auth/login rejects invalid email', async ({ client }) => {
    const response = await client.post('/v1/auth/login').json({
      email: 'nonexistent@example.com',
      password: 'WrongPassword',
    })

    response.assertStatus(400)
  })

  test('POST /v1/auth/login rejects invalid password', async ({ client }) => {
    await User.create({
      email: 'test@example.com',
      password: 'SecurePassword123',
      name: 'Test User',
      emailVerified: false,
      pomodoroSettings: {},
    })

    const response = await client.post('/v1/auth/login').json({
      email: 'test@example.com',
      password: 'WrongPassword',
    })

    response.assertStatus(400)
  })

  test('POST /v1/auth/login validates required fields', async ({ client }) => {
    const response = await client.post('/v1/auth/login').json({
      email: 'test@example.com',
    })

    response.assertStatus(422)
  })
})
