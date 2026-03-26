'use client'

import { usePomodoroStore } from '@/stores/pomodoroStore'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function TimerControls() {
  const {
    isRunning,
    timeRemaining,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
  } = usePomodoroStore()

  // AC 7: Disable at 00:00 when not running
  const isDisabled = timeRemaining === 0 && !isRunning

  return (
    <div className="flex items-center gap-4">
      {/* AC 1, 6: Reset button */}
      <Button
        onClick={resetTimer}
        disabled={isDisabled}
        variant="ghost"
        size="icon"
        className={cn(
          // AC 2: Chartreuse background, black icon, rounded corners
          'h-12 w-12 rounded-lg bg-[#D9FC00] text-[#262626]',
          // AC 9: Darker on hover
          'hover:bg-[#c4e600]',
          // AC 10: Scale down on active
          'active:scale-95',
          // AC 11: Transition for feedback
          'transition-all duration-150',
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
        aria-label="Réinitialiser"
      >
        <RotateCcw className="h-6 w-6" />
      </Button>

      {/* AC 1, 3, 4: Play/Pause button */}
      <Button
        onClick={isRunning ? pauseTimer : startTimer}
        disabled={isDisabled}
        variant="ghost"
        size="icon"
        className={cn(
          'h-14 w-14 rounded-lg bg-[#D9FC00] text-[#262626]',
          'hover:bg-[#c4e600]',
          'active:scale-95',
          'transition-all duration-150',
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
        aria-label={isRunning ? 'Pause' : 'Démarrer'}
      >
        {/* AC 3, 4: Toggle icon */}
        {isRunning ? (
          <Pause className="h-7 w-7" fill="#262626" />
        ) : (
          <Play className="h-7 w-7" fill="#262626" />
        )}
      </Button>

      {/* AC 1, 5: Stop button */}
      <Button
        onClick={stopTimer}
        disabled={isDisabled}
        variant="ghost"
        size="icon"
        className={cn(
          'h-12 w-12 rounded-lg bg-[#D9FC00] text-[#262626]',
          'hover:bg-[#c4e600]',
          'active:scale-95',
          'transition-all duration-150',
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
        aria-label="Arrêter"
      >
        <Square className="h-6 w-6" fill="#262626" />
      </Button>
    </div>
  )
}
