'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Check, Pencil, Trash2, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUpdateProjectTask } from '@/hooks/use-project-tasks'
import type { Task } from '@focus-guide/shared'

interface ProjectTaskCardProps {
  task: Task
  projectId: string
  isDragging?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function ProjectTaskCard({
  task,
  projectId,
  isDragging: isDraggingOverlay,
  onEdit,
  onDelete,
}: ProjectTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
    data: { task },
  })

  const updateTask = useUpdateProjectTask(projectId)
  const isDone = task.projectStatus === 'done'

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newStatus = isDone ? 'todo' : 'done'
    updateTask.mutate({
      id: task.id,
      data: { projectStatus: newStatus },
    })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    })
  }

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'group bg-chartreuse/10 border border-chartreuse/20 rounded-md p-3 shadow-sm transition-all duration-150',
        isDragging && 'opacity-0',
        isDraggingOverlay && 'shadow-lg scale-105 rotate-2 cursor-grabbing',
        !isDragging && !isDraggingOverlay && 'hover:bg-chartreuse/15 hover:-translate-y-0.5 hover:shadow-md cursor-grab'
      )}
      data-testid="project-task-card"
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={handleToggleComplete}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
            isDone
              ? 'bg-chartreuse border-chartreuse'
              : 'border-gray-300 hover:border-chartreuse'
          )}
          aria-label={isDone ? 'Marquer comme non fait' : 'Marquer comme fait'}
        >
          {isDone && <Check className="w-3 h-3 text-dark" />}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'font-medium text-dark line-clamp-2',
              isDone && 'line-through text-gray-400'
            )}
          >
            {task.title}
          </p>
          {task.notes && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {task.notes.length > 100
                ? `${task.notes.slice(0, 100)}...`
                : task.notes}
            </p>
          )}

          {/* Metadata row */}
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            {task.deadline && (
              <span className="flex items-center gap-1 text-amber-600">
                <Calendar className="w-3 h-3" />
                {formatDate(task.deadline)}
              </span>
            )}
            {task.todayStatus && (
              <span className="rounded-full bg-chartreuse px-2 py-0.5 text-dark font-medium">
                Dans Today
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.()
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          aria-label={`Modifier ${task.title}`}
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.()
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          aria-label={`Supprimer ${task.title}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
