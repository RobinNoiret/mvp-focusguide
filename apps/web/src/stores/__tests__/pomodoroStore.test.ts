import { renderHook, act } from '@testing-library/react'
import { usePomodoroStore } from '../pomodoroStore'

describe('Pomodoro Store - Timer Logic', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure fresh state
    localStorage.clear()
    // Reset the store to default state
    const { result } = renderHook(() => usePomodoroStore())
    act(() => {
      result.current.reset()
      // Also reset settings to defaults
      result.current.updateSettings({
        focusDuration: 25,
        breakDuration: 5,
        repetitions: 3,
        autoSwitch: true,
      })
    })
  })

  afterEach(() => {
    // Clean up after each test
    localStorage.clear()
  })

  // AC 3: Countdown
  it('decrements timeRemaining when tick is called', () => {
    const { result } = renderHook(() => usePomodoroStore())

    const initialTime = result.current.timeRemaining

    act(() => {
      result.current.tick()
    })

    expect(result.current.timeRemaining).toBe(initialTime - 1)
  })

  // AC 4: Auto-switch from focus to break
  it('switches from focus to break when time reaches 0', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.setTimeRemaining(1)
      result.current.setMode('focus')
      result.current.setIsRunning(true)
    })

    // Tick to 0
    act(() => {
      result.current.tick()
    })

    // AC 4: Mode switched to break
    expect(result.current.mode).toBe('break')
    expect(result.current.timeRemaining).toBe(5 * 60) // 5 min break
    expect(result.current.isRunning).toBe(true) // Auto-switch keeps running
  })

  // AC 5: Increment cycle after break
  it('increments cycle after break completes', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.setTimeRemaining(1)
      result.current.setMode('break')
      result.current.setCurrentCycle(1)
      result.current.setIsRunning(true)
    })

    // Complete break
    act(() => {
      result.current.tick()
    })

    // AC 5: Cycle incremented
    expect(result.current.currentCycle).toBe(2)
    expect(result.current.mode).toBe('focus')
  })

  // AC 6: Reset after all repetitions
  it('resets to initial state after all cycles complete', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.setTimeRemaining(1)
      result.current.setMode('break')
      result.current.setCurrentCycle(3) // Last cycle
      result.current.setIsRunning(true)
    })

    // Complete last break
    act(() => {
      result.current.tick()
    })

    // AC 6: Reset to initial
    expect(result.current.currentCycle).toBe(1)
    expect(result.current.mode).toBe('focus')
    expect(result.current.isRunning).toBe(false) // Stops after all cycles
  })

  // AC 4: Auto-switch disabled
  it('stops timer at 0 when autoSwitch is false', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.updateSettings({ autoSwitch: false })
      result.current.setTimeRemaining(1)
      result.current.setIsRunning(true)
    })

    act(() => {
      result.current.tick()
    })

    // AC 4: Stops, no mode switch
    expect(result.current.isRunning).toBe(false)
    expect(result.current.timeRemaining).toBe(0)
  })

  // AC 1: Store initialization
  it('initializes with correct default values', () => {
    const { result } = renderHook(() => usePomodoroStore())

    expect(result.current.timeRemaining).toBe(25 * 60)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.mode).toBe('focus')
    expect(result.current.currentCycle).toBe(1)
  })

  // AC 2: Default settings
  it('has correct default settings', () => {
    const { result } = renderHook(() => usePomodoroStore())

    expect(result.current.settings.focusDuration).toBe(25)
    expect(result.current.settings.breakDuration).toBe(5)
    expect(result.current.settings.repetitions).toBe(3)
    expect(result.current.settings.autoSwitch).toBe(true)
  })

  // Settings update
  it('updates settings correctly', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.updateSettings({ focusDuration: 30, breakDuration: 10 })
    })

    expect(result.current.settings.focusDuration).toBe(30)
    expect(result.current.settings.breakDuration).toBe(10)
    expect(result.current.settings.repetitions).toBe(3) // Should remain unchanged
  })

  // Multiple ticks
  it('decrements correctly over multiple ticks', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.setTimeRemaining(100)
    })

    const initialTime = result.current.timeRemaining

    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.tick()
      }
    })

    expect(result.current.timeRemaining).toBe(initialTime - 5)
  })

  // Reset functionality
  it('resets to initial state correctly', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.setTimeRemaining(100)
      result.current.setIsRunning(true)
      result.current.setMode('break')
      result.current.setCurrentCycle(2)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.timeRemaining).toBe(25 * 60)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.mode).toBe('focus')
    expect(result.current.currentCycle).toBe(1)
  })
})
