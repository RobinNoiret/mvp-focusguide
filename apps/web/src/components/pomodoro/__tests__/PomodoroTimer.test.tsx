import { render, screen, waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { PomodoroTimer } from '../PomodoroTimer'
import { usePomodoroStore } from '@/stores/pomodoroStore'

describe('PomodoroTimer', () => {
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

  it('renders CircularTimer component', () => {
    const { container } = render(<PomodoroTimer />)

    // Should render SVG timer
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('displays initial time of 25:00 for focus mode', () => {
    render(<PomodoroTimer />)

    // Initial state: 25 minutes * 60 = 1500 seconds
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('displays Focus mode label initially', () => {
    render(<PomodoroTimer />)

    // Initial mode is 'focus'
    expect(screen.getByText('Focus')).toBeInTheDocument()
  })

  it('displays cycle indicator', () => {
    render(<PomodoroTimer />)

    // AC: Cycle indicator shows progress
    expect(screen.getByText('Cycle 1 / 3')).toBeInTheDocument()
  })

  it('has centered flex layout', () => {
    const { container } = render(<PomodoroTimer />)

    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('flex')
    expect(wrapper).toHaveClass('flex-col')
    expect(wrapper).toHaveClass('items-center')
    expect(wrapper).toHaveClass('justify-center')
  })

  it('updates time when store changes', () => {
    const { rerender } = render(<PomodoroTimer />)

    // Initially shows 25:00
    expect(screen.getByText('25:00')).toBeInTheDocument()

    // Update store
    const { result } = renderHook(() => usePomodoroStore())
    act(() => {
      result.current.setTimeRemaining(1499)
    })

    rerender(<PomodoroTimer />)

    // Should show new time
    expect(screen.getByText('24:59')).toBeInTheDocument()
  })

  it('shows pause mode when in break', () => {
    const { rerender } = render(<PomodoroTimer />)

    // Initially shows Focus
    expect(screen.getByText('Focus')).toBeInTheDocument()

    // Update store to break mode
    const { result } = renderHook(() => usePomodoroStore())
    act(() => {
      result.current.setMode('break')
    })

    rerender(<PomodoroTimer />)

    // Should show Pause
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })

  it('updates cycle indicator when cycle changes', () => {
    const { rerender } = render(<PomodoroTimer />)

    // Initially shows Cycle 1 / 3
    expect(screen.getByText('Cycle 1 / 3')).toBeInTheDocument()

    // Update store
    const { result } = renderHook(() => usePomodoroStore())
    act(() => {
      result.current.setCurrentCycle(2)
    })

    rerender(<PomodoroTimer />)

    // Should show Cycle 2 / 3
    expect(screen.getByText('Cycle 2 / 3')).toBeInTheDocument()
  })

  // AC 3: Timer decrements when running
  it('starts countdown when isRunning is true', async () => {
    const { rerender } = render(<PomodoroTimer />)

    // Initially 25:00
    expect(screen.getByText('25:00')).toBeInTheDocument()

    // Start timer
    const { result } = renderHook(() => usePomodoroStore())
    act(() => {
      result.current.setIsRunning(true)
    })

    rerender(<PomodoroTimer />)

    // Wait for tick
    await waitFor(
      () => {
        expect(screen.getByText('24:59')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })
})
