import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { PomodoroSettingsModal } from '../PomodoroSettingsModal'
import { usePomodoroStore } from '@/stores/pomodoroStore'
import { vi } from 'vitest'

// Mock the hooks
vi.mock('@/hooks/useUpdatePomodoroSettings', () => ({
  useUpdatePomodoroSettings: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
  }),
}))

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}))

describe('PomodoroSettingsModal', () => {
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

  // AC 1: Settings modal opens and closes
  it('renders settings modal when isOpen is true', () => {
    render(
      <PomodoroSettingsModal
        isOpen={true}
        onClose={() => {}}
      />
    )

    expect(screen.getByText('Paramètres Pomodoro')).toBeInTheDocument()
  })

  it('does not render settings modal when isOpen is false', () => {
    render(
      <PomodoroSettingsModal
        isOpen={false}
        onClose={() => {}}
      />
    )

    expect(screen.queryByText('Paramètres Pomodoro')).not.toBeInTheDocument()
  })

  // AC 2: Form fields present with correct labels
  it('renders all form fields with correct labels', () => {
    render(
      <PomodoroSettingsModal
        isOpen={true}
        onClose={() => {}}
      />
    )

    expect(screen.getByText('Durée de focus (minutes)')).toBeInTheDocument()
    expect(screen.getByText('Durée de pause (minutes)')).toBeInTheDocument()
    expect(screen.getByText('Nombre de cycles')).toBeInTheDocument()
    expect(screen.getByText('Passer automatiquement au suivant')).toBeInTheDocument()
  })

  // AC 8: Pre-fill current values
  it('pre-fills form with current settings values', () => {
    render(
      <PomodoroSettingsModal
        isOpen={true}
        onClose={() => {}}
      />
    )

    const focusInput = screen.getByDisplayValue('25') as HTMLInputElement
    const breakInput = screen.getByDisplayValue('5') as HTMLInputElement
    const repsInput = screen.getByDisplayValue('3') as HTMLInputElement

    expect(focusInput).toBeInTheDocument()
    expect(breakInput).toBeInTheDocument()
    expect(repsInput).toBeInTheDocument()
  })

  // AC 9: Validation - reject invalid values
  it('shows validation errors for invalid focus duration', async () => {
    render(
      <PomodoroSettingsModal
        isOpen={true}
        onClose={() => {}}
      />
    )

    const focusInput = screen.getByDisplayValue('25') as HTMLInputElement

    act(() => {
      fireEvent.change(focusInput, { target: { value: '100' } })
    })

    const saveButton = screen.getByRole('button', { name: /Enregistrer/ })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Maximum 60 minutes')).toBeInTheDocument()
    })
  })

  it('shows validation error for zero focus duration', async () => {
    render(
      <PomodoroSettingsModal
        isOpen={true}
        onClose={() => {}}
      />
    )

    const focusInput = screen.getByDisplayValue('25') as HTMLInputElement

    act(() => {
      fireEvent.change(focusInput, { target: { value: '0' } })
    })

    const saveButton = screen.getByRole('button', { name: /Enregistrer/ })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Minimum 1 minute')).toBeInTheDocument()
    })
  })

  // AC 6: Warning dialog shows when timer is running
  it('shows warning dialog when timer is running and settings change attempted', async () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.startTimer()
    })

    const onCloseMock = vi.fn()
    render(
      <PomodoroSettingsModal
        isOpen={true}
        onClose={onCloseMock}
      />
    )

    const focusInput = screen.getByDisplayValue('25') as HTMLInputElement
    act(() => {
      fireEvent.change(focusInput, { target: { value: '30' } })
    })

    const saveButton = screen.getByRole('button', { name: /Enregistrer/ })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Modifier les paramètres ?')).toBeInTheDocument()
    })
  })

  // AC 7: Confirmed change stops timer
  it('stops timer when warning is confirmed', async () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.startTimer()
    })

    expect(result.current.isRunning).toBe(true)

    render(
      <PomodoroSettingsModal
        isOpen={true}
        onClose={() => {}}
      />
    )

    const focusInput = screen.getByDisplayValue('25') as HTMLInputElement
    act(() => {
      fireEvent.change(focusInput, { target: { value: '30' } })
    })

    const saveButton = screen.getByRole('button', { name: /Enregistrer/ })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Modifier les paramètres ?')).toBeInTheDocument()
    })

    const confirmButton = screen.getByRole('button', { name: /Continuer/ })
    fireEvent.click(confirmButton)

    // Timer should be stopped
    expect(result.current.isRunning).toBe(false)
  })

  // AC 3: Save updates store
  it('updates store when settings are saved', async () => {
    const { result } = renderHook(() => usePomodoroStore())

    const onCloseMock = vi.fn()
    render(
      <PomodoroSettingsModal
        isOpen={true}
        onClose={onCloseMock}
      />
    )

    const focusInput = screen.getByDisplayValue('25') as HTMLInputElement
    const breakInput = screen.getByDisplayValue('5') as HTMLInputElement

    act(() => {
      fireEvent.change(focusInput, { target: { value: '30' } })
      fireEvent.change(breakInput, { target: { value: '10' } })
    })

    const saveButton = screen.getByRole('button', { name: /Enregistrer/ })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(result.current.settings.focusDuration).toBe(30)
      expect(result.current.settings.breakDuration).toBe(10)
    })
  })

  it('closes modal after save', async () => {
    const onCloseMock = vi.fn()
    render(
      <PomodoroSettingsModal
        isOpen={true}
        onClose={onCloseMock}
      />
    )

    const focusInput = screen.getByDisplayValue('25') as HTMLInputElement
    act(() => {
      fireEvent.change(focusInput, { target: { value: '30' } })
    })

    const saveButton = screen.getByRole('button', { name: /Enregistrer/ })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled()
    })
  })

  // Cancel button
  it('closes modal when cancel is clicked', () => {
    const onCloseMock = vi.fn()
    render(
      <PomodoroSettingsModal
        isOpen={true}
        onClose={onCloseMock}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /Annuler/ })
    fireEvent.click(cancelButton)

    expect(onCloseMock).toHaveBeenCalled()
  })

  // Warning dialog cancel
  it('closes warning dialog when canceled', async () => {
    const { result } = renderHook(() => usePomodoroStore())

    act(() => {
      result.current.startTimer()
    })

    render(
      <PomodoroSettingsModal
        isOpen={true}
        onClose={() => {}}
      />
    )

    const focusInput = screen.getByDisplayValue('25') as HTMLInputElement
    act(() => {
      fireEvent.change(focusInput, { target: { value: '30' } })
    })

    const saveButton = screen.getByRole('button', { name: /Enregistrer/ })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Modifier les paramètres ?')).toBeInTheDocument()
    })

    const cancelAlertButton = screen.getByRole('button', { name: /Annuler/ })
    fireEvent.click(cancelAlertButton)

    // Warning dialog should be closed
    expect(screen.queryByText('Modifier les paramètres ?')).not.toBeInTheDocument()
  })
})
