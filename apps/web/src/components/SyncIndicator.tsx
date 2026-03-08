'use client'

import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { backgroundSync } from '@/services/background-sync'

export function SyncIndicator() {
  const [queueCount, setQueueCount] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    // Initial state
    setQueueCount(backgroundSync.getQueueCount())
    setIsOnline(backgroundSync.isOnline())

    // Subscribe to queue changes
    const unsubscribe = backgroundSync.subscribe(() => {
      setQueueCount(backgroundSync.getQueueCount())
    })

    // Listen to online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Poll queue count every second for real-time updates
    const interval = setInterval(() => {
      setQueueCount(backgroundSync.getQueueCount())
    }, 1000)

    return () => {
      unsubscribe()
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  const handleRetry = async () => {
    setIsRetrying(true)
    await backgroundSync.processQueue()
    setIsRetrying(false)
  }

  // Don't show anything if online and no pending changes
  if (isOnline && queueCount === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-all',
        !isOnline
          ? 'bg-red-100 text-red-700'
          : queueCount > 0
            ? 'bg-chartreuse/20 text-dark'
            : 'bg-green-100 text-green-700'
      )}
    >
      {!isOnline ? (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Hors ligne</span>
        </>
      ) : queueCount > 0 ? (
        <>
          <RefreshCw
            className={cn('h-4 w-4', isRetrying && 'animate-spin')}
          />
          <span>
            {queueCount} modification{queueCount > 1 ? 's' : ''} en attente
          </span>
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="ml-2 rounded bg-chartreuse px-2 py-0.5 text-xs font-semibold text-dark hover:bg-chartreuse/80 disabled:opacity-50"
          >
            {isRetrying ? 'Sync...' : 'Réessayer'}
          </button>
        </>
      ) : (
        <>
          <Check className="h-4 w-4" />
          <span>Synchronisé</span>
        </>
      )}
    </div>
  )
}
