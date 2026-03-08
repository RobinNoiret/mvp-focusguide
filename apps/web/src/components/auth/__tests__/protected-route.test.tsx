import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { ProtectedRoute } from '../protected-route'
import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'

// Mock dependencies
vi.mock('@/stores/auth-store')
vi.mock('next/navigation')

describe('ProtectedRoute', () => {
  const mockReplace = vi.fn()

  const defaultState = {
    isAuthenticated: true,
    accessToken: 'test-token',
    isHydrated: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.mocked(useRouter).mockReturnValue({
      replace: mockReplace,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    // useAuthStore is called with individual selectors: (s) => s.fieldName
    vi.mocked(useAuthStore).mockImplementation((selector?: unknown) => {
      if (typeof selector === 'function') {
        return (selector as (s: typeof defaultState) => unknown)(defaultState)
      }
      return defaultState as unknown as ReturnType<typeof useAuthStore>
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should show loading state initially when not hydrated', () => {
    const state = { ...defaultState, isHydrated: false }
    vi.mocked(useAuthStore).mockImplementation((selector?: unknown) => {
      if (typeof selector === 'function') {
        return (selector as (s: typeof state) => unknown)(state)
      }
      return state as unknown as ReturnType<typeof useAuthStore>
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Chargement...')).toBeInTheDocument()
  })

  it('should render children when authenticated and hydrated', () => {
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('should redirect to login when not authenticated', () => {
    const state = { ...defaultState, isAuthenticated: false, accessToken: null }
    vi.mocked(useAuthStore).mockImplementation((selector?: unknown) => {
      if (typeof selector === 'function') {
        return (selector as (s: typeof state) => unknown)(state)
      }
      return state as unknown as ReturnType<typeof useAuthStore>
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(mockReplace).toHaveBeenCalledWith('/login')
  })

  it('should redirect to login if no access token', () => {
    const state = { ...defaultState, accessToken: null }
    vi.mocked(useAuthStore).mockImplementation((selector?: unknown) => {
      if (typeof selector === 'function') {
        return (selector as (s: typeof state) => unknown)(state)
      }
      return state as unknown as ReturnType<typeof useAuthStore>
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(mockReplace).toHaveBeenCalledWith('/login')
  })

  it('should redirect when access token is removed', () => {
    const { rerender } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    // Update auth state to remove access token
    const state = { ...defaultState, accessToken: null }
    vi.mocked(useAuthStore).mockImplementation((selector?: unknown) => {
      if (typeof selector === 'function') {
        return (selector as (s: typeof state) => unknown)(state)
      }
      return state as unknown as ReturnType<typeof useAuthStore>
    })

    rerender(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(mockReplace).toHaveBeenCalledWith('/login')
  })

  it('should render children when authenticated but not yet hydrated (fresh login case)', () => {
    const state = { ...defaultState, isHydrated: false }
    vi.mocked(useAuthStore).mockImplementation((selector?: unknown) => {
      if (typeof selector === 'function') {
        return (selector as (s: typeof state) => unknown)(state)
      }
      return state as unknown as ReturnType<typeof useAuthStore>
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    // Should wait a bit for hydration, then render
    act(() => {
      vi.advanceTimersByTime(10)
    })

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
