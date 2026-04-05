'use client'

import { ChevronLeft } from 'lucide-react'
import { ProjectSelectorDropdown } from './ProjectSelectorDropdown'
import { ProjectTaskList } from './ProjectTaskList'

import type { Task } from '@focus-guide/shared'

interface SidePanelProps {
  isExpanded?: boolean
  onToggleExpand?: (expanded: boolean) => void
  activeTask?: Task | null
}

export function SidePanel({
  isExpanded = true,
  onToggleExpand,
  activeTask,
}: SidePanelProps) {
  const panelWidth = isExpanded ? 'w-72' : 'w-16'

  return (
    // AC 1: Right side panel, expandable from 16px to 288px
    <aside
      className={`flex-shrink-0 border-l border-gray-200 bg-white transition-all duration-300 flex flex-col h-full ${panelWidth}`}
      aria-label="Panneau de sélection de projet"
      role="complementary"
    >
      {/* AC 7: Independent scroll - full height flex container */}
      <div className="flex flex-col overflow-hidden h-full">
        {/* AC 2: Panel header with project selector and toggle */}
        <div className={`border-b border-gray-200 ${isExpanded ? 'p-3' : 'p-2'} flex flex-col ${isExpanded ? 'gap-2' : 'gap-0'}`}>
          {/* Toggle button - always visible, centered when collapsed */}
          {onToggleExpand && (
            <div className={isExpanded ? '' : 'flex justify-center'}>
              <button
                onClick={() => onToggleExpand(!isExpanded)}
                className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 transition-colors"
                aria-label={isExpanded ? 'Replier le panneau' : 'Déplier le panneau'}
                data-tour="side-panel-toggle"
              >
                <ChevronLeft
                  className="h-5 w-5 text-gray-600 transition-transform duration-300"
                  style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
            </div>
          )}

          {/* Title and project selector - only visible when expanded */}
          {isExpanded && (
            <>
              <h3 className="text-sm font-medium text-dark">Projets</h3>
              <ProjectSelectorDropdown />
            </>
          )}
        </div>

        {/* AC 3, 7: Panel body with independent scroll - hidden when collapsed */}
        {isExpanded && (
          <div className="flex-1 overflow-y-auto p-3">
            {/* AC 9: Scrollable task list */}
            <ProjectTaskList activeTask={activeTask} />
          </div>
        )}
      </div>
    </aside>
  )
}
