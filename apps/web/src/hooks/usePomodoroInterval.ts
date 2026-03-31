import { useEffect, useRef } from 'react'
import { pomodoroService } from '@/services/pomodoro-service'

/**
 * Custom hook that initializes the pomodoro background service.
 * The service runs independently of the component lifecycle and checks
 * the store state to determine when to tick.
 */
export function usePomodoroInterval() {
  const startedRef = useRef(false)

  useEffect(() => {
    // Start the service once when the component mounts
    // The service will check isRunning on each tick and continue regardless of unmount
    if (!startedRef.current) {
      startedRef.current = true
      pomodoroService.start()
    }

    // Don't stop the service on unmount - let it continue in background
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
