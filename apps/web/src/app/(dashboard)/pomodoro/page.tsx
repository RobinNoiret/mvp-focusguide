'use client'

import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer'

export default function PomodoroPage() {
  return (
    <div className="flex h-full items-center justify-center bg-[#EDEAE9] p-8">
      <PomodoroTimer />
    </div>
  )
}
