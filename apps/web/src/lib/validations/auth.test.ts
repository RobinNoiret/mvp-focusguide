import { describe, it, expect } from 'vitest'
import { registerSchema, loginSchema } from './auth'

describe('registerSchema', () => {
  it('validates a valid registration', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    }

    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('requires name to be at least 2 characters', () => {
    const invalidData = {
      name: 'J',
      email: 'john@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('requires a valid email', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'Password123',
      confirmPassword: 'Password123',
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('requires password to have at least 8 characters', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Pass1',
      confirmPassword: 'Pass1',
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('requires password to have at least one uppercase letter', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('requires password to have at least one lowercase letter', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'PASSWORD123',
      confirmPassword: 'PASSWORD123',
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('requires password to have at least one digit', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Passworddd',
      confirmPassword: 'Passworddd',
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('requires passwords to match', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
      confirmPassword: 'DifferentPassword123',
    }

    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('validates a valid login', () => {
    const validData = {
      email: 'john@example.com',
      password: 'anypassword',
    }

    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('requires a valid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'anypassword',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('requires a password', () => {
    const invalidData = {
      email: 'john@example.com',
      password: '',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
