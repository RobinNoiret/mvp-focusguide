'use client'

import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useState } from 'react'
import { REACT_QUERY_DEFAULTS } from '@focus-guide/shared'
import { SyncIndicator } from './SyncIndicator'
import { AuthInitializer } from './auth/auth-initializer'
import { backgroundSync } from '@/services/background-sync'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Increased from 30 seconds to 5 minutes by default
            // Most data is stable enough not to require constant refetches
            staleTime: REACT_QUERY_DEFAULTS.STALE_TIME.PROJECTS,
            retry: 2,
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 3,
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 16000),
          },
        },
      })
  )

  useEffect(() => {
    backgroundSync.start()
    return () => backgroundSync.stop()
  }, [])

  return (
    <AuthInitializer>
      <QueryClientProvider client={queryClient}>
        {children}
        <SyncIndicator />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              border: '1px solid #E5E5E5',
              color: '#262626',
            },
            classNames: {
              success: 'border-chartreuse',
              error: 'border-red-500',
            },
          }}
        />
      </QueryClientProvider>
    </AuthInitializer>
  )
}
