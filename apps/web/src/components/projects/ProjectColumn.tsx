'use client'

import { useDroppable } from '@dnd-kit/core'
import { Plus, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProjectTaskCard } from './ProjectTaskCard'
import type { Task, TaskStatus } from '@focus-guide/shared'

interface ProjectColumnProps {
  id: TaskStatus
  title: string
  tasks: Task[]
  projectId: string
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
}

export function ProjectColumn({
  id,
  title,
  tasks,
  projectId,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: ProjectColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  })

  const isEmpty = tasks.length === 0

  return (
    <div
      className={cn(
        'flex flex-1 min-w-[280px] flex-col rounded-lg border bg-white shadow-sm transition-all duration-150 h-full',
        isOver
          ? 'border-chartreuse ring-2 ring-chartreuse bg-chartreuse/5'
          : 'border-[#E5E5E5]'
      )}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-[#E5E5E5] px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-dark">{title}</h3>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1.5 text-xs font-medium text-dark">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="flex h-7 w-7 items-center justify-center rounded-md text-dark transition-colors hover:bg-chartreuse"
          aria-label={`Ajouter une tâche dans ${title}`}
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
      >
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <ProjectTaskCard
                key={task.id}
                task={task}
                projectId={projectId}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task)}
              />
            ))}
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
