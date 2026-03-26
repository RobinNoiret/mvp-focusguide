import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PomodoroSettings {
  focusDuration: number // minutes
  breakDuration: number // minutes
  repetitions: number
  autoSwitch: boolean
}

interface PomodoroStore {
  // AC 1: State
  timeRemaining: number // seconds
  isRunning: boolean
  mode: 'focus' | 'break'
  currentCycle: number
  settings: PomodoroSettings

  // Actions
  setTimeRemaining: (time: number) => void
  setIsRunning: (running: boolean) => void
  setMode: (mode: 'focus' | 'break') => void
  setCurrentCycle: (cycle: number) => void
  updateSettings: (settings: Partial<PomodoroSettings>) => void
  tick: () => void // Decrement time
  reset: () => void

  // AC 12: Control actions
  startTimer: () => void
  pauseTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  restartTimer: () => void
}

// AC 2: Default settings
const defaultSettings: PomodoroSettings = {
  focusDuration: 25,
  breakDuration: 5,
  repetitions: 3,
  autoSwitch: true,
}

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      // AC 1: Initial state
      timeRemaining: 25 * 60, // 25 minutes in seconds
      isRunning: false,
      mode: 'focus',
      currentCycle: 1,
      settings: defaultSettings,

      setTimeRemaining: (time) => set({ timeRemaining: time }),
      setIsRunning: (running) => set({ isRunning: running }),
      setMode: (mode) => set({ mode }),
      setCurrentCycle: (cycle) => set({ currentCycle: cycle }),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // AC 3: Tick (decrement)
      tick: () => {
        const state = get()
        if (state.timeRemaining > 0) {
          set({ timeRemaining: state.timeRemaining - 1 })
        } else {
          // AC 4: Handle completion
          const { mode, currentCycle, settings } = state

          if (settings.autoSwitch) {
            if (mode === 'focus') {
              // Switch to break
              set({
                mode: 'break',
                timeRemaining: settings.breakDuration * 60,
                isRunning: true,
              })
            } else {
              // Break completed
              // AC 5: Increment cycle
              const nextCycle = currentCycle + 1

              // AC 6: Check if all cycles completed
              if (nextCycle > settings.repetitions) {
                // AC 6: Reset to initial state
                set({
                  mode: 'focus',
                  timeRemaining: settings.focusDuration * 60,
                  currentCycle: 1,
                  isRunning: false,
                })
              } else {
                // Next focus cycle
                set({
                  mode: 'focus',
                  timeRemaining: settings.focusDuration * 60,
                  currentCycle: nextCycle,
                  isRunning: true,
                })
              }
            }
          } else {
            // AC 4: Auto-switch off, just stop
            set({ isRunning: false })
          }
        }
      },

      // AC 6: Reset
      reset: () =>
        set({
          timeRemaining: get().settings.focusDuration * 60,
          isRunning: false,
          mode: 'focus',
          currentCycle: 1,
        }),

      // AC 3: Start timer
      startTimer: () => set({ isRunning: true }),

      // AC 4: Pause timer
      pauseTimer: () => set({ isRunning: false }),

      // AC 5: Stop timer (reset to initial)
      stopTimer: () => {
        const { settings } = get()
        set({
          isRunning: false,
          mode: 'focus',
          currentCycle: 1,
          timeRemaining: settings.focusDuration * 60,
        })
      },

      // AC 6: Reset current mode to beginning without starting
      resetTimer: () => {
        const { mode, settings } = get()
        const duration =
          mode === 'focus'
            ? settings.focusDuration * 60
            : settings.breakDuration * 60

        set({
          timeRemaining: duration,
          isRunning: false, // Do NOT restart
        })
      },

      // AC 6: Restart current mode (resume/replay)
      restartTimer: () => {
        const { mode, settings } = get()
        const duration =
          mode === 'focus'
            ? settings.focusDuration * 60
            : settings.breakDuration * 60

        set({
          timeRemaining: duration,
          isRunning: true, // AC 6: Starts after restart
        })
      },
    }),
    {
      name: 'pomodoro-storage', // AC 9: localStorage persistence
    }
  )
)
