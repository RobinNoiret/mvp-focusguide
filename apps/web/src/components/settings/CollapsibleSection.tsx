'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-ui-border last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <h3 className="text-sm font-semibold text-dark">{title}</h3>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-ui-muted',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </button>

      {isOpen && <div className="pb-6 bg-gray-50 rounded-lg p-4 -mx-6 px-6">{children}</div>}
    </div>
  )
}
