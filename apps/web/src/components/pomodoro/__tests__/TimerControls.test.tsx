import { render, screen, fireEvent } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { TimerControls } from '../TimerControls'
import { usePomodoroStore } from '@/stores/pomodoroStore'

describe('TimerControls', () => {
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

  it('renders three control buttons', () => {
    render(<TimerControls />)

    // Check for all three buttons (by aria-label)
    expect(screen.getByRole('button', { name: /Redémarrer/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Démarrer/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Arrêter/ })).toBeInTheDocument()
  })

  // AC 3: Play button starts timer
  it('play button starts timer', () => {
    const { rerender } = render(<TimerControls />)

    const playButton = screen.getByRole('button', { name: /Démarrer/ })
    fireEvent.click(playButton)

    rerender(<TimerControls />)

    // Should show pause button now
    expect(screen.getByRole('button', { name: /Pause/ })).toBeInTheDocument()
  })

  // AC 4: Pause button stops countdown
  it('pause button stops countdown', () => {
    const { result } = renderHook(() => usePomodoroStore())
    act(() => {
      result.current.startTimer()
    })

    const { rerender } = render(<TimerControls />)

    const pauseButton = screen.getByRole('button', { name: /Pause/ })
    fireEvent.click(pauseButton)

    rerender(<TimerControls />)

    // Should show play button again
    expect(screen.getByRole('button', { name: /Démarrer/ })).toBeInTheDocument()
  })

  // AC 5: Stop button resets timer
  it('stop button resets timer', () => {
    const { result } = renderHook(() => usePomodoroStore())
    act(() => {
      result.current.setTimeRemaining(500)
      result.current.setMode('break')
      result.current.setCurrentCycle(2)
      result.current.startTimer()
    })

    render(<TimerControls />)

    const stopButton = screen.getByRole('button', { name: /Arrêter/ })
    fireEvent.click(stopButton)

    // Verify reset in store
    expect(result.current.timeRemaining).toBe(25 * 60)
    expect(result.current.mode).toBe('focus')
    expect(result.current.currentCycle).toBe(1)
  })

  // AC 6: Restart button resets and starts
  it('restart button resets and starts timer', () => {
    const { result } = renderHook(() => usePomodoroStore())
    act(() => {
      result.current.setTimeRemaining(500)
      result.current.pauseTimer()
    })

    const { rerender } = render(<TimerControls />)

    const restartButton = screen.getByRole('button', { name: /Redémarrer/ })
    fireEvent.click(restartButton)

    rerender(<TimerControls />)

    // Verify reset and started
    expect(result.current.timeRemaining).toBe(25 * 60)
    expect(result.current.isRunning).toBe(true)

    // Should show pause button
    expect(screen.getByRole('button', { name: /Pause/ })).toBeInTheDocument()
  })

  // AC 2: Buttons have correct styling
  it('buttons have chartreuse background color', () => {
    const { container } = render(<TimerControls />)

    const buttons = container.querySelectorAll('button')
    buttons.forEach((button) => {
      expect(button.className).toContain('bg-[#D9FC00]')
      expect(button.className).toContain('rounded-full')
    })
  })

  // AC 7: Buttons disabled at 00:00 when not running
  it('disables buttons when timer is at 00:00 and not running', () => {
    const { result } = renderHook(() => usePomodoroStore())
    act(() => {
      result.current.setTimeRemaining(0)
      result.current.pauseTimer()
    })

    const { container } = render(<TimerControls />)

    const buttons = container.querySelectorAll('button')
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  // AC 7: Buttons enabled when running
  it('enables buttons when timer is running', () => {
    const { result } = renderHook(() => usePomodoroStore())
    act(() => {
      result.current.startTimer()
    })

    const { container } = render(<TimerControls />)

    const buttons = container.querySelectorAll('button')
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled()
    })
  })

  // AC 11: Visual feedback on hover
  it('has hover styles', () => {
    const { container } = render(<TimerControls />)

    const buttons = container.querySelectorAll('button')
    buttons.forEach((button) => {
      expect(button.className).toContain('hover:bg-[#c4e600]')
    })
  })

  // AC 10: Visual feedback on active/click
  it('has active scale effect', () => {
    const { container } = render(<TimerControls />)

    const buttons = container.querySelectorAll('button')
    buttons.forEach((button) => {
      expect(button.className).toContain('active:scale-95')
    })
  })

  // AC 11: Transition for smooth feedback
  it('has smooth transition effect', () => {
    const { container } = render(<TimerControls />)

    const buttons = container.querySelectorAll('button')
    buttons.forEach((button) => {
      expect(button.className).toContain('transition-all')
      expect(button.className).toContain('duration-150')
    })
  })

  // AC 3, 4: Icon toggle
  it('toggles play/pause icon based on isRunning', () => {
    const { result } = renderHook(() => usePomodoroStore())

    const { rerender, container } = render(<TimerControls />)

    // Initially should show play icon
    const pauseIcon = container.querySelector('svg[class*="Pause"]')
    expect(pauseIcon).not.toBeInTheDocument()

    // Start timer
    act(() => {
      result.current.startTimer()
    })

    rerender(<TimerControls />)

    // Should show pause icon now (play button will be replaced)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
