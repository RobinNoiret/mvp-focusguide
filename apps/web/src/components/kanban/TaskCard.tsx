'use client'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import { useUpdateTask, useDeleteTask, useUnlinkTask } from '@/hooks/use-today-tasks'
import { EditTaskModal } from '@/components/modals/EditTaskModal'
import { DeleteConfirmationDialog } from '@/components/modals/DeleteConfirmationDialog'
import type { Task } from '@focus-guide/shared'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export function TaskCard({ task, isDragging: isDraggingOverlay }: TaskCardProps) {
  const { t } = useTranslation()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const unlinkTask = useUnlinkTask()

  const isDone = task.todayStatus === 'done'

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newStatus = isDone ? 'todo' : 'done'
    updateTask.mutate({
      id: task.id,
      data: { todayStatus: newStatus },
    })
  }

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync(task.id)
      setIsDeleteDialogOpen(false)
    } catch {
      // Error handled by React Query
    }
  }

  const handleUnlink = (e: React.MouseEvent) => {
    e.stopPropagation()
    unlinkTask.mutate({ id: task.id })
  }

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined

  return (
    <>
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
            aria-label={isDone ? t.common.markNotDone : t.common.markDone}
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
          </div>
        </div>

        <div className="flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsEditModalOpen(true)
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            aria-label={`${t.common.edit} ${task.title}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          {task.projectId && (
            <button
              type="button"
              onClick={handleUnlink}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
              aria-label={`${t.common.remove} ${task.title}`}
              title={t.common.remove}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {!task.projectId && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsDeleteDialogOpen(true)
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              aria-label={`${t.common.delete} ${task.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <EditTaskModal
        task={task}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <DeleteConfirmationDialog
        taskTitle={task.title}
        isOpen={isDeleteDialogOpen}
        isDeleting={deleteTask.isPending}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </>
  )
}
