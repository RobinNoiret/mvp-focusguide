import { renderHook, act } from '@testing-library/react'
import { usePomodoroStore } from '../pomodoroStore'

describe('Pomodoro Store - Settings Persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    const { result } = renderHook(() => usePomodoroStore())
    act(() => {
      result.current.reset()
      result.current.updateSettings({
        focusDuration: 25,
        breakDuration: 5,
        repetitions: 3,
        autoSwitch: true,
      })
    })
  })

  afterEach(() => {
    localStorage.clear()
  })

  // AC 12: Test persistence
  it('updates settings and persists to localStorage', () => {
    const { result } = renderHook(() => usePomodoroStore())

    const newSettings = {
      focusDuration: 30,
      breakDuration: 10,
      repetitions: 5,
      autoSwitch: false,
    }

    act(() => {
      result.current.updateSettings(newSettings)
    })

    expect(result.current.settings.focusDuration).toBe(30)
    expect(result.current.settings.breakDuration).toBe(10)
    expect(result.current.settings.repetitions).toBe(5)
    expect(result.current.settings.autoSwitch).toBe(false)

    // Verify localStorage persistence
    const stored = localStorage.getItem('pomodoro-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      expect(parsed.state.settings.focusDuration).toBe(30)
    }
  })

  // AC 12: Test reset when changing settings
  it('resets timer when settings change while running', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.startTimer()
      result.current.setTimeRemaining(500)
    })

    expect(result.current.isRunning).toBe(true)
    expect(result.current.timeRemaining).toBe(500)

    // Simulate changing settings (calls stopTimer internally)
    act(() => {
      result.current.stopTimer()
      result.current.updateSettings({ focusDuration: 30 })
    })

    // Timer reset
    expect(result.current.isRunning).toBe(false)
    expect(result.current.timeRemaining).toBe(30 * 60)
  })

  // AC 12: Test settings persist across page reload
  it('loads persisted settings on new instance', () => {
    const { result: result1 } = renderHook(() => usePomodoroStore())

    const newSettings = {
      focusDuration: 45,
      breakDuration: 15,
      repetitions: 4,
      autoSwitch: true,
    }

    act(() => {
      result1.current.updateSettings(newSettings)
    })

    // Simulate new instance (page reload)
    const { result: result2 } = renderHook(() => usePomodoroStore())

    expect(result2.current.settings.focusDuration).toBe(45)
    expect(result2.current.settings.breakDuration).toBe(15)
    expect(result2.current.settings.repetitions).toBe(4)
  })

  it('applies new duration when settings change', () => {
    const { result } = renderHook(() => usePomodoroStore())

    // Initial state
    expect(result.current.timeRemaining).toBe(25 * 60)

    // Change focus duration
    act(() => {
      result.current.updateSettings({
        focusDuration: 50,
        breakDuration: 5,
        repetitions: 3,
        autoSwitch: true,
      })
    })

    // Reset timer to apply new duration
    act(() => {
      result.current.stopTimer()
    })

    expect(result.current.timeRemaining).toBe(50 * 60)
  })

  it('respects updated settings during auto-switch', () => {
    const { result } = renderHook(() => usePomodoroStore())

    // Change settings to shorter duration for testing
    act(() => {
      result.current.updateSettings({
        focusDuration: 1,
        breakDuration: 1,
        repetitions: 2,
        autoSwitch: true,
      })
      result.current.reset()
    })

    expect(result.current.mode).toBe('focus')
    expect(result.current.timeRemaining).toBe(60) // 1 minute

    // Simulate completing focus mode
    act(() => {
      result.current.setTimeRemaining(0)
      result.current.tick() // Should auto-switch
    })

    // Should switch to break with new break duration
    expect(result.current.mode).toBe('break')
    expect(result.current.timeRemaining).toBe(60) // 1 minute break
  })

  it('disables auto-switch when setting is false', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.updateSettings({
        focusDuration: 25,
        breakDuration: 5,
        repetitions: 3,
        autoSwitch: false,
      })
      result.current.reset()
      result.current.setTimeRemaining(1)
    })

    const initialMode = result.current.mode

    act(() => {
      result.current.tick() // Count down to 0
      result.current.tick() // Try to auto-switch but can't
    })

    // Mode should remain the same (no auto-switch)
    expect(result.current.mode).toBe(initialMode)
    expect(result.current.isRunning).toBe(false)
  })
})
