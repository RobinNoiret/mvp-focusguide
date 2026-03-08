import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthInitializer } from '../auth-initializer'
import { useAuthStore } from '@/stores/auth-store'
import { userService } from '@/services/user-service'
import type { User } from '@focus-guide/shared'

// Mock dependencies
vi.mock('@/stores/auth-store')
vi.mock('@/services/user-service')

describe('AuthInitializer', () => {
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

  const mockSetAuth = vi.fn()
  const mockLogout = vi.fn()

  const mockAuthState = {
    isAuthenticated: true,
    accessToken: 'test-token',
    refreshToken: 'refresh-token',
    user: mockUser,
    isHydrated: true,
    setAuth: mockSetAuth,
    setAccessToken: vi.fn(),
    logout: mockLogout,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore).mockReturnValue(mockAuthState as unknown as ReturnType<typeof useAuthStore>)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(useAuthStore as any).getState = vi.fn(() => mockAuthState)
  })

  it('should render children when auth is valid', async () => {
    vi.mocked(userService.getMe).mockResolvedValueOnce(mockUser as unknown as Awaited<ReturnType<typeof userService.getMe>>)

    render(
      <AuthInitializer>
        <div>Protected Content</div>
      </AuthInitializer>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should validate token on mount', async () => {
    vi.mocked(userService.getMe).mockResolvedValueOnce(mockUser as unknown as Awaited<ReturnType<typeof userService.getMe>>)

    render(
      <AuthInitializer>
        <div>Test</div>
      </AuthInitializer>
    )

    await waitFor(() => {
      expect(userService.getMe).toHaveBeenCalled()
    })
  })

  it('should logout if token validation fails', async () => {
    vi.mocked(userService.getMe).mockRejectedValueOnce(new Error('Unauthorized'))

    render(
      <AuthInitializer>
        <div>Test</div>
      </AuthInitializer>
    )

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled()
    })
  })

  it('should not validate token if user is not authenticated', async () => {
    const unauthenticatedState = {
      ...mockAuthState,
      isAuthenticated: false,
      accessToken: null,
    }
    vi.mocked(useAuthStore).mockReturnValue(unauthenticatedState as unknown as ReturnType<typeof useAuthStore>)

    render(
      <AuthInitializer>
        <div>Test</div>
      </AuthInitializer>
    )

    await waitFor(() => {
      expect(userService.getMe).not.toHaveBeenCalled()
    })
  })

  it('should not validate if store is not hydrated', async () => {
    const notHydratedState = {
      ...mockAuthState,
      isHydrated: false,
    }
    vi.mocked(useAuthStore).mockReturnValue(notHydratedState as unknown as ReturnType<typeof useAuthStore>)

    render(
      <AuthInitializer>
        <div>Test</div>
      </AuthInitializer>
    )

    await waitFor(() => {
      expect(userService.getMe).not.toHaveBeenCalled()
    })
  })

  it('should handle network errors gracefully', async () => {
    vi.mocked(userService.getMe).mockRejectedValueOnce(
      new Error('Network error')
    )

    render(
      <AuthInitializer>
        <div>Test</div>
      </AuthInitializer>
    )

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled()
    })
  })

  it('should render children even if validation is pending', () => {
    vi.mocked(userService.getMe).mockImplementationOnce(
      () => new Promise(() => {})
    )

    render(
      <AuthInitializer>
        <div>Protected Content</div>
      </AuthInitializer>
    )

    // Children should render immediately
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
