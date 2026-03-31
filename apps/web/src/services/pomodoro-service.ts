import { usePomodoroStore } from '@/stores/pomodoroStore'

class PomodoroService {
  private timeoutId: ReturnType<typeof setTimeout> | null = null
  private lastTickTime = 0

  /**
   * Start the background timer service.
   * This runs independently of the component lifecycle.
   */
  start() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
    this.scheduleNextTick()
  }

  /**
   * Stop the background timer service.
   */
  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  /**
   * Schedule the next tick and continuously tick the timer.
   */
  private scheduleNextTick() {
    // Check if timer should be running
    const state = usePomodoroStore.getState()
    const shouldContinue = state.isRunning

    if (shouldContinue) {
      // Calculate time until next second
      const now = Date.now()
      const timeSinceLastTick = now - this.lastTickTime
      const timeUntilNextSecond = Math.max(0, 1000 - timeSinceLastTick)

      this.timeoutId = setTimeout(() => {
        // Double-check that timer should still be running
        const currentState = usePomodoroStore.getState()
        if (currentState.isRunning) {
          this.lastTickTime = Date.now()
          currentState.tick()
        }
        // Always schedule the next check, even if timer is paused
        // This ensures we resume immediately when isRunning becomes true
        this.scheduleNextTick()
      }, timeUntilNextSecond)
    } else {
      // If timer is paused, still check periodically if it should resume
      this.timeoutId = setTimeout(() => {
        this.scheduleNextTick()
      }, 100)
    }
  }
}

export const pomodoroService = new PomodoroService()
