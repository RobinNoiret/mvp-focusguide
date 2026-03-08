'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const accessToken = useAuthStore((s) => s.accessToken)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // If we have auth data but store isn't hydrated yet, wait a bit
    // This handles the fresh login case where data is set before persist kicks in
    if (isAuthenticated && accessToken && !isHydrated) {
      const timer = setTimeout(() => {
        if (isAuthenticated && accessToken) {
          setIsReady(true)
        }
      }, 10)
      return () => clearTimeout(timer)
    }

    // Wait for store to hydrate before checking auth
    if (!isHydrated) return

    if (!isAuthenticated || !accessToken) {
      router.replace('/login')
    } else {
      setIsReady(true)
    }
  }, [isHydrated, isAuthenticated, accessToken, router])

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light">
        <div className="text-dark">Chargement...</div>
      </div>
    )
  }

  return <>{children}</>
}
