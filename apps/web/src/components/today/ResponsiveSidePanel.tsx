'use client'

import { useState } from 'react'
import { SidePanel } from './SidePanel'
import { SidePanelModal } from './SidePanelModal'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { Task } from '@focus-guide/shared'

interface ResponsiveSidePanelProps {
  isExpanded?: boolean
  onToggleExpand?: (expanded: boolean) => void
  activeTask?: Task | null
}

export function ResponsiveSidePanel({
  isExpanded = true,
  onToggleExpand,
  activeTask,
}: ResponsiveSidePanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  // AC 5: Media query to switch between panel and modal at md breakpoint (768px)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  // AC 5: Desktop shows panel, mobile shows modal
  if (isDesktop) {
    return (
      <SidePanel
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        activeTask={activeTask}
      />
    )
  }

  return (
    <SidePanelModal
      isOpen={isModalOpen}
      onOpenChange={setIsModalOpen}
    />
  )
}
