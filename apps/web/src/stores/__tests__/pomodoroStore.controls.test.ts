import { renderHook, act } from '@testing-library/react'
import { usePomodoroStore } from '../pomodoroStore'

describe('Pomodoro Store - Controls', () => {
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

  // AC 3: Start timer
  it('starts timer when startTimer is called', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.startTimer()
    })

    expect(result.current.isRunning).toBe(true)
  })

  // AC 4: Pause timer
  it('pauses timer when pauseTimer is called', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.startTimer()
      result.current.pauseTimer()
    })

    expect(result.current.isRunning).toBe(false)
  })

  // AC 5: Stop timer
  it('stops timer and resets to initial state', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.setTimeRemaining(1000)
      result.current.setMode('break')
      result.current.setCurrentCycle(2)
      result.current.startTimer()
    })

    act(() => {
      result.current.stopTimer()
    })

    // AC 5: Reset to initial
    expect(result.current.isRunning).toBe(false)
    expect(result.current.mode).toBe('focus')
    expect(result.current.currentCycle).toBe(1)
    expect(result.current.timeRemaining).toBe(25 * 60)
  })

  // AC 6: Restart timer
  it('restarts current mode and starts running', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.setTimeRemaining(500) // Partially complete
      result.current.setMode('focus')
      result.current.pauseTimer()
    })

    act(() => {
      result.current.restartTimer()
    })

    // AC 6: Reset to full duration, start
    expect(result.current.timeRemaining).toBe(25 * 60)
    expect(result.current.isRunning).toBe(true)
    expect(result.current.mode).toBe('focus') // Same mode
  })

  // AC 6: Restart break mode
  it('restarts break mode with correct duration', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.setMode('break')
      result.current.setTimeRemaining(100)
    })

    act(() => {
      result.current.restartTimer()
    })

    // Should use break duration (5 * 60 = 300)
    expect(result.current.timeRemaining).toBe(5 * 60)
    expect(result.current.isRunning).toBe(true)
    expect(result.current.mode).toBe('break')
  })

  // AC 7: Buttons disabled at 00:00
  it('should be disabled when timeRemaining is 0 and not running', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.setTimeRemaining(0)
      result.current.pauseTimer()
    })

    const isDisabled = result.current.timeRemaining === 0 && !result.current.isRunning
    expect(isDisabled).toBe(true)
  })

  // AC 7: Buttons enabled when running at 00:00
  it('should be enabled when running even at 00:00', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.setTimeRemaining(0)
      result.current.startTimer()
    })

    const isDisabled = result.current.timeRemaining === 0 && !result.current.isRunning
    expect(isDisabled).toBe(false)
  })

  // Play/pause toggle
  it('toggles between play and pause', () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.startTimer()
    })
    expect(result.current.isRunning).toBe(true)

    act(() => {
      result.current.pauseTimer()
    })
    expect(result.current.isRunning).toBe(false)

    act(() => {
      result.current.startTimer()
    })
    expect(result.current.isRunning).toBe(true)
  })

  // Sequential control actions
  it('handles sequential control actions correctly', () => {
    const { result } = renderHook(() => usePomodoroStore())

    // Start
    act(() => {
      result.current.startTimer()
    })
    expect(result.current.isRunning).toBe(true)

    // Reduce time
    act(() => {
      result.current.setTimeRemaining(500)
    })
    expect(result.current.timeRemaining).toBe(500)

    // Pause
    act(() => {
      result.current.pauseTimer()
    })
    expect(result.current.isRunning).toBe(false)

    // Restart (should go back to 25:00)
    act(() => {
      result.current.restartTimer()
    })
    expect(result.current.timeRemaining).toBe(25 * 60)
    expect(result.current.isRunning).toBe(true)

    // Stop
    act(() => {
      result.current.stopTimer()
    })
    expect(result.current.timeRemaining).toBe(25 * 60)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.mode).toBe('focus')
    expect(result.current.currentCycle).toBe(1)
  })
})
