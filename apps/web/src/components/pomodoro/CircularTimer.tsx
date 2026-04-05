'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/use-translation'

interface CircularTimerProps {
  timeRemaining: number
  totalDuration: number
  progressPercentage: number
  formattedTime: string
  mode: 'focus' | 'break'
  currentCycle: number
  totalCycles: number
}

export function CircularTimer({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  timeRemaining,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  totalDuration,
  progressPercentage,
  formattedTime,
  mode,
  currentCycle,
  totalCycles,
}: CircularTimerProps) {
  const { t } = useTranslation()
  // AC 12: Responsive size based on screen
  const getResponsiveSize = () => {
    if (typeof window === 'undefined') return 450
    if (window.innerWidth < 640) return 350 // Mobile
    if (window.innerWidth < 1024) return 400 // Tablet
    return 450 // Desktop
  }

  const [size, setSize] = useState(getResponsiveSize())

  useEffect(() => {
    const handleResize = () => setSize(getResponsiveSize())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // AC 3, 6: SVG half-circle parameters
  const strokeWidth = 45
  const radius = (size - strokeWidth) / 2
  const circumference = Math.PI * radius  // Half circle

  // AC 6: Offset for progress ring (depletes clockwise on half-circle)
  const offset = circumference - (progressPercentage / 100) * circumference

  // Responsive font size based on timer size
  const fontSize = size / 5
  const modefontSize = size / 16

  return (
    <div className="relative" style={{ width: size, height: size * 0.75 }}>
      {/* AC 3: SVG half-circle timer */}
      <svg
        width={size}
        height={size / 2 + strokeWidth / 2}
        viewBox={`0 0 ${size} ${size / 2 + strokeWidth / 2}`}
        style={{ overflow: 'visible' }}
      >
        {/* Background half-circle */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="#9ca3af"
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
        />

        {/* AC 3: Chartreuse progress half-circle */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="#D9FC00"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>

      {/* AC 4, 5, 8: Time and mode display */}
      <div className="absolute left-1/2 flex flex-col items-center" style={{ top: '65%', transform: 'translate(-50%, -50%)' }}>
        {/* AC 4: MM:SS in BN Recon Grotesk font */}
        <div
          className="font-display font-light text-[#262626] tabular-nums text-left"
          style={{ fontSize: `${fontSize}px`, width: `${fontSize * 4.5}px`, paddingLeft: `${fontSize * 0.65}px` }}
        >
          {formattedTime}
        </div>

        {/* AC 5: Current mode below - smaller, tighter spacing */}
        <div
          className="mt-0.5 text-gray-600"
          style={{ fontSize: `${modefontSize * 0.8}px` }}
        >
          {mode === 'focus' ? t.pomodoro.focusTime : t.pomodoro.breakTime}
        </div>

        {/* Cycle count below mode */}
        <div
          className="mt-1 text-gray-500"
          style={{ fontSize: `${modefontSize * 0.7}px` }}
        >
          {currentCycle}/{totalCycles}
        </div>
      </div>
    </div>
  )
}
