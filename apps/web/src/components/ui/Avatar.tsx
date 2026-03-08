'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  src?: string | null
  name?: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
}

const sizePx: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name)

  if (src) {
    return (
      <Image
        src={src}
        alt={name || 'Avatar'}
        width={sizePx[size]}
        height={sizePx[size]}
        className={cn(
          'rounded-full object-cover',
          sizeClasses[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-chartreuse font-semibold text-dark',
        sizeClasses[size],
        className
      )}
      aria-label={name || 'User avatar'}
    >
      {initials}
    </div>
  )
}

function getInitials(name: string | undefined): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
