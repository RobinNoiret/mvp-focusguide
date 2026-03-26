import { useEffect } from 'react'
import { usePomodoroStore } from '@/stores/pomodoroStore'

export function usePomodoroKeyboard() {
  // Use selectors to avoid re-registering listeners on every store change
  const isRunning = usePomodoroStore((s) => s.isRunning)
  const timeRemaining = usePomodoroStore((s) => s.timeRemaining)
  const startTimer = usePomodoroStore((s) => s.startTimer)
  const pauseTimer = usePomodoroStore((s) => s.pauseTimer)
  const stopTimer = usePomodoroStore((s) => s.stopTimer)
  const resetTimer = usePomodoroStore((s) => s.resetTimer)

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
        case 'R': // AC 8: R for reset
          event.preventDefault()
          if (!isDisabled) {
            resetTimer()
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
  }, [isRunning, timeRemaining, startTimer, pauseTimer, stopTimer, resetTimer])
}
