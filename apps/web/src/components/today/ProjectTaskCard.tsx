'use client'

import { useState, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUpdateProjectTask, useDeleteProjectTask } from '@/hooks/use-project-tasks'
import { EditTaskModal } from '@/components/modals/EditTaskModal'
import { DeleteConfirmationDialog } from '@/components/modals/DeleteConfirmationDialog'
import { AddToTodayModal } from './AddToTodayModal'
import type { Task } from '@focus-guide/shared'

interface ProjectTaskCardProps {
  task: Task
  projectId: string
}

export function ProjectTaskCard({ task, projectId }: ProjectTaskCardProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [cardElement, setCardElement] = useState<HTMLDivElement | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `panel-${task.id}`, // Prefix to avoid conflicts with kanban tasks
    data: { task }, // AC 8: Pass task data for drag
  })

  const updateTask = useUpdateProjectTask(projectId)
  const deleteTask = useDeleteProjectTask(projectId)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isDone = task.projectStatus === 'done'

  // AC 11: Keyboard shortcut "T" to add to Today
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 't' || e.key === 'T') && cardElement === document.activeElement) {
        e.preventDefault()
        setShowAddModal(true)
      }
    }

    if (cardElement) {
      cardElement.addEventListener('keydown', handleKeyDown)
      return () => cardElement.removeEventListener('keydown', handleKeyDown)
    }
  }, [cardElement])

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newStatus = isDone ? 'todo' : 'done'
    updateTask.mutate({
      id: task.id,
      data: { projectStatus: newStatus },
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

  // Merge both refs
  const mergeRefs = (el: HTMLDivElement | null) => {
    setNodeRef(el)
    setCardElement(el)
  }

  return (
    <>
      <div
        ref={mergeRefs}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          'group bg-chartreuse/10 border border-chartreuse/20 rounded-md p-3 shadow-sm transition-all duration-150',
          isDragging && 'opacity-0',
          !isDragging && 'hover:bg-chartreuse/15 hover:-translate-y-0.5 hover:shadow-md cursor-grab'
        )}
        data-testid="project-task-card"
        tabIndex={0}
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

            {/* Badge if task already in Today */}
            {task.todayStatus && (
              <span className="inline-block mt-2 rounded-full bg-chartreuse px-2 py-0.5 text-xs font-medium text-dark">
                Dans Today
              </span>
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
            aria-label={`Modifier ${task.title}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsDeleteDialogOpen(true)
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            aria-label={`Supprimer ${task.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
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

      {/* AC 11: Modal for keyboard users */}
      <AddToTodayModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        task={task}
      />
    </>
  )
}
