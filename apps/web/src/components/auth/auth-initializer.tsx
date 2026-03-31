'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { userService } from '@/services/user-service'
import type { User } from '@focus-guide/shared'

/**
 * Validates auth token on app load (initial page load only).
 * Does NOT re-validate after a fresh login to avoid race conditions.
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, accessToken, isHydrated } = useAuthStore()
  const hasValidated = useRef(false)

  useEffect(() => {
    if (!isHydrated || hasValidated.current) return

    const validateAuth = async () => {
      hasValidated.current = true

      try {
        if (!isAuthenticated || !accessToken) return

        const user = await userService.getMe()
        if (user) {
          const { accessToken: currentToken, refreshToken: currentRefreshToken } = useAuthStore.getState()
          if (currentToken && currentRefreshToken) {
            useAuthStore.getState().setAuth(user as User, currentToken, currentRefreshToken)
          }
        }
      } catch {
        useAuthStore.getState().logout()
      }
    }

    validateAuth()
  }, [isHydrated, isAuthenticated, accessToken])

  return <>{children}</>
}
