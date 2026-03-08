'use client'

import { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePomodoroStore } from '@/stores/pomodoroStore'
import { usePomodoroKeyboard } from '@/hooks/usePomodoroKeyboard'
import { useLoadPomodoroSettings } from '@/hooks/useLoadPomodoroSettings'
import { CircularTimer } from './CircularTimer'
import { TimerControls } from './TimerControls'
import { PomodoroSettingsModal } from './PomodoroSettingsModal'

export function PomodoroTimer() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  const {
    timeRemaining,
    isRunning,
    mode,
    currentCycle,
    settings,
    tick,
  } = usePomodoroStore()

  // AC 5: Load settings on mount
  useLoadPomodoroSettings()

  // AC 8: Keyboard shortcuts
  usePomodoroKeyboard()

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

  // AC 3: setInterval for countdown
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      tick() // AC 3: Decrement every second
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, tick])

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
      >
        <Settings className="h-5 w-5" />
      </Button>

      <div className="w-full h-full flex flex-col items-center justify-center space-y-8">

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
      <TimerControls />

      {/* Settings modal */}
      <PomodoroSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      </div>
    </>
  )
}
