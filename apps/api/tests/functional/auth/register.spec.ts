import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth - Register', (group) => {
  group.each.setup(async () => {
    // Cleanup users table before each test
    await User.query().delete()
  })

  test('POST /v1/auth/register creates user successfully', async ({ client, assert }) => {
    const response = await client.post('/v1/auth/register').json({
      email: 'test@example.com',
      password: 'SecurePassword123',
      name: 'Test User',
    })

    response.assertStatus(201)
    assert.properties(response.body(), ['id', 'email', 'name', 'emailVerified'])
    assert.equal(response.body().email, 'test@example.com')
    assert.equal(response.body().name, 'Test User')
    assert.equal(response.body().emailVerified, false)
    assert.notExists(response.body().password)
  })

  test('POST /v1/auth/register rejects duplicate email', async ({ client }) => {
    await client.post('/v1/auth/register').json({
      email: 'test@example.com',
      password: 'SecurePassword123',
      name: 'Test User',
    })

    const response = await client.post('/v1/auth/register').json({
      email: 'test@example.com',
      password: 'AnotherPassword123',
      name: 'Another User',
    })

    response.assertStatus(409)
    response.assertBodyContains({ error: 'Email already registered' })
  })

  test('POST /v1/auth/register validates email format', async ({ client }) => {
    const response = await client.post('/v1/auth/register').json({
      email: 'invalid-email',
      password: 'SecurePassword123',
      name: 'Test User',
    })

    response.assertStatus(422)
  })

  test('POST /v1/auth/register requires minimum password length', async ({ client }) => {
    const response = await client.post('/v1/auth/register').json({
      email: 'test@example.com',
      password: 'short',
      name: 'Test User',
    })

    response.assertStatus(422)
  })

  test('POST /v1/auth/register requires name', async ({ client }) => {
    const response = await client.post('/v1/auth/register').json({
      email: 'test@example.com',
      password: 'SecurePassword123',
    })

    response.assertStatus(422)
  })
})
