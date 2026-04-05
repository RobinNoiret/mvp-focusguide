'use client'

import { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePomodoroStore } from '@/stores/pomodoroStore'
import { usePomodoroKeyboard } from '@/hooks/usePomodoroKeyboard'
import { useLoadPomodoroSettings } from '@/hooks/useLoadPomodoroSettings'
import { usePomodoroInterval } from '@/hooks/usePomodoroInterval'
import { CircularTimer } from './CircularTimer'
import { TimerControls } from './TimerControls'
import { PomodoroSettingsModal } from './PomodoroSettingsModal'

export function PomodoroTimer() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Use selectors to avoid re-renders on every store change
  const timeRemaining = usePomodoroStore((s) => s.timeRemaining)
  const isRunning = usePomodoroStore((s) => s.isRunning)
  const mode = usePomodoroStore((s) => s.mode)
  const currentCycle = usePomodoroStore((s) => s.currentCycle)
  const settings = usePomodoroStore((s) => s.settings)
  const tick = usePomodoroStore((s) => s.tick)

  // AC 5: Load settings on mount
  useLoadPomodoroSettings()

  // AC 8: Keyboard shortcuts
  usePomodoroKeyboard()

  // AC 3: Handle pomodoro countdown interval
  usePomodoroInterval()

  // AC 10: Keyboard shortcut ","
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ',') {
        e.preventDefault()
        setSettingsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // AC 7: MM:SS formatting
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // AC 8: Progress percentage
  const totalDuration = mode === 'focus'
    ? settings.focusDuration * 60
    : settings.breakDuration * 60

  const progressPercentage = (timeRemaining / totalDuration) * 100

  return (
    <>
      {/* AC 1: Settings icon button - fixed at top-right corner */}
      <Button
        onClick={() => setSettingsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-chartreuse text-dark hover:bg-chartreuse/90 rounded-lg h-10 w-10"
        aria-label="Paramètres"
        data-tour="pomodoro-settings"
      >
        <Settings className="h-5 w-5" />
      </Button>

      <div className="w-full h-full flex flex-col items-center justify-center space-y-8" data-tour="pomodoro-timer">

      <CircularTimer
        timeRemaining={timeRemaining}
        totalDuration={totalDuration}
        progressPercentage={progressPercentage}
        formattedTime={formatTime(timeRemaining)}
        mode={mode}
        currentCycle={currentCycle}
        totalCycles={settings.repetitions}
      />

      {/* Timer controls */}
      <div data-tour="pomodoro-controls">
        <TimerControls />
      </div>

      {/* Settings modal */}
      <PomodoroSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      </div>
    </>
  )
}
