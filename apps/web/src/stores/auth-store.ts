'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@focus-guide/shared'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isHydrated: boolean

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  setAccessToken: (accessToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      setAccessToken: (accessToken) =>
        set({ accessToken }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return (_state, _error) => {
          // Mark as hydrated after Zustand persist finishes loading from storage
          // This happens on initial page load and ensures components wait for
          // localStorage data to be loaded before checking auth state
          useAuthStore.setState({ isHydrated: true })
        }
      },
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
