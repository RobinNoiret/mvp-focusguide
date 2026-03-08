import { useEffect } from 'react'
import { usePomodoroStore } from '@/stores/pomodoroStore'

export function usePomodoroKeyboard() {
  const {
    isRunning,
    timeRemaining,
    startTimer,
    pauseTimer,
    stopTimer,
    restartTimer,
  } = usePomodoroStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing in input or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      )
        return

      const isDisabled = timeRemaining === 0 && !isRunning

      switch (event.key) {
        case ' ': // AC 8: Space for play/pause
          event.preventDefault()
          if (!isDisabled) {
            if (isRunning) {
              pauseTimer()
            } else {
              startTimer()
            }
          }
          break

        case 'r':
        case 'R': // AC 8: R for restart
          event.preventDefault()
          if (!isDisabled) {
            restartTimer()
          }
          break

        case 's':
        case 'S': // AC 8: S for stop
          event.preventDefault()
          if (!isDisabled) {
            stopTimer()
          }
          break

        case 'Escape': // AC 8: Escape for stop
          event.preventDefault()
          if (!isDisabled) {
            stopTimer()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRunning, timeRemaining, startTimer, pauseTimer, stopTimer, restartTimer])
}
