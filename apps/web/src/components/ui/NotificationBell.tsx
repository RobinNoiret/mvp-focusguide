'use client'

import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/lib/hooks/use-media-query'

interface NotificationBellProps {
  count?: number
  onClick?: () => void
}

export function NotificationBell({ count = 0, onClick }: NotificationBellProps) {
  const isMobile = useIsMobile()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // Placeholder for MVP
      console.log('Notification bell clicked')
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'fixed z-50 flex items-center justify-center rounded-full bg-chartreuse transition-all',
        'hover:brightness-95 hover:-translate-y-0.5',
        'active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-chartreuse focus:ring-offset-2',
        isMobile
          ? 'bottom-20 right-4 h-12 w-12'
          : 'bottom-6 right-6 h-14 w-14'
      )}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
      aria-label={`Notifications${count > 0 ? ` (${count} nouvelles)` : ''}`}
    >
      <Bell
        className={cn('text-dark', isMobile ? 'h-5 w-5' : 'h-6 w-6')}
      />

      {/* Notification badge */}
      {count > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white"
          aria-hidden="true"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
