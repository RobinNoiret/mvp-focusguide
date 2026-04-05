'use client'

import { useDroppable } from '@dnd-kit/core'
import { Plus, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@focus-guide/shared'

export type ColumnStatus = 'backlog' | 'todo' | 'in_progress' | 'done'

interface KanbanColumnProps {
  id: ColumnStatus
  title: string
  count: number
  children?: React.ReactNode
  onAddTask?: () => void
}

export function KanbanColumn({
  id,
  title,
  count,
  children,
  onAddTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver, active } = useDroppable({
    id: id,
  })

  const isEmpty = count === 0

  // AC 4: Check if dragging from panel
  const draggedTask = active?.data.current?.task as Task
  const isDraggingFromPanel = draggedTask?.projectId && !draggedTask.todayStatus

  // AC 2, 3: Only backlog and todo accept panel drops
  const acceptsPanelDrop = id === 'backlog' || id === 'todo'

  // AC 4: Visual feedback based on drop validity
  const isValidDrop = isOver && !isDraggingFromPanel
  const isInvalidPanelDrop = isOver && isDraggingFromPanel && !acceptsPanelDrop
  const isValidPanelDrop = isOver && isDraggingFromPanel && acceptsPanelDrop

  return (
    <div
      className={cn(
        'flex min-w-[280px] flex-col rounded-lg border bg-white shadow-sm transition-all duration-150 h-full',
        // Valid drop for Today tasks
        isValidDrop && 'border-chartreuse ring-2 ring-chartreuse bg-chartreuse/5',
        // Valid drop for panel tasks (AC 2, 4)
        isValidPanelDrop && 'border-chartreuse ring-2 ring-chartreuse bg-chartreuse/5',
        // Invalid drop for panel tasks (AC 3, 4)
        isInvalidPanelDrop && 'border-red-400 ring-2 ring-red-400 bg-red-50',
        // Default
        !isOver && 'border-[#E5E5E5]'
      )}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-[#E5E5E5] px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-dark">{title}</h3>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1.5 text-xs font-medium text-dark">
            {count}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="flex h-7 w-7 items-center justify-center rounded-md text-dark transition-colors hover:bg-chartreuse"
          aria-label={`Ajouter une tâche dans ${title}`}
          data-tour={id === 'todo' ? 'btn-create-task' : undefined}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Column body */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 overflow-y-auto p-3',
          'min-h-[400px]'
        )}
        style={{ contentVisibility: 'auto' }}
      >
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-2">{children}</div>
        )}

        {/* AC 4: Helper text for invalid panel drops */}
        {isInvalidPanelDrop && (
          <div className="mt-2 text-center text-xs text-red-600">
            D&eacute;posez d&apos;abord dans &quot;Backlog&quot; ou &quot;À faire
            aujourd&apos;hui&quot;
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <Inbox className="mb-3 h-12 w-12 text-[#A0A0A0]" />
      <p className="font-medium text-[#A0A0A0]">Aucune tâche</p>
      <p className="mt-1 text-sm text-[#A0A0A0]">
        Créez une nouvelle tâche avec le bouton +
      </p>
    </div>
  )
}
