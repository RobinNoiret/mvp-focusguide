'use client'

import { cn } from '@/lib/utils'
import { Button } from './button'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        className
      )}
    >
      <div className="mb-4 text-ui-muted">{icon}</div>
      <h3 className="font-medium text-ui-muted">{title}</h3>
      {description && (
        <p className="mt-1 text-body-sm text-ui-muted">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-4" variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  )
}
