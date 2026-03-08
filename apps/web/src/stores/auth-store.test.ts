import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth-store'
import type { User } from '@focus-guide/shared'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.getState().logout()
  })

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    emailVerified: true,
    pomodoroSettings: {
      focusDuration: 25,
      breakDuration: 5,
      repetitions: 3,
      autoSwitch: true,
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  it('should start with unauthenticated state', () => {
    const { isAuthenticated, user, accessToken, refreshToken } = useAuthStore.getState()

    expect(isAuthenticated).toBe(false)
    expect(user).toBeNull()
    expect(accessToken).toBeNull()
    expect(refreshToken).toBeNull()
  })

  it('should set auth state correctly', () => {
    const accessToken = 'test-access-token'
    const refreshToken = 'test-refresh-token'

    useAuthStore.getState().setAuth(mockUser, accessToken, refreshToken)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(mockUser)
    expect(state.accessToken).toBe(accessToken)
    expect(state.refreshToken).toBe(refreshToken)
  })

  it('should update access token', () => {
    useAuthStore.getState().setAuth(mockUser, 'old-token', 'refresh-token')

    useAuthStore.getState().setAccessToken('new-access-token')

    const { accessToken } = useAuthStore.getState()
    expect(accessToken).toBe('new-access-token')
  })

  it('should logout and clear all state', () => {
    useAuthStore.getState().setAuth(mockUser, 'access-token', 'refresh-token')

    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
    expect(state.refreshToken).toBeNull()
  })
})
