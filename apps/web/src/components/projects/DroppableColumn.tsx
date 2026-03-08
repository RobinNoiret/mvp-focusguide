'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { DraggableTaskCard } from './DraggableTaskCard'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus } from '@focus-guide/shared'

interface DroppableColumnProps {
  column: {
    id: TaskStatus
    title: string
    tasks: Task[]
  }
  projectId: string
  vertical: boolean
  className?: string
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
}

export function DroppableColumn({
  column,
  projectId,
  vertical,
  className,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-lg bg-white p-4 shadow-sm transition-colors',
        vertical ? 'w-64 flex flex-col' : 'flex-1 flex flex-col',
        isOver && 'ring-2 ring-chartreuse ring-offset-2',
        className
      )}
    >
      {/* Column header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
          {column.title}
          <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-normal">
            {column.tasks.length}
          </span>
        </h3>

        {/* Add task button */}
        <button
          onClick={onAddTask}
          className="rounded p-1 hover:bg-gray-100"
          aria-label={`Ajouter une tâche à ${column.title}`}
        >
          <Plus className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Tasks list */}
      <SortableContext
        items={column.tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={cn(
            'space-y-3 min-h-[100px]',
            vertical && 'flex-1 overflow-y-auto max-h-[calc(100vh-300px)]'
          )}
        >
          {column.tasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">Aucune tâche</p>
          ) : (
            column.tasks.map((task) => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                projectId={projectId}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}
