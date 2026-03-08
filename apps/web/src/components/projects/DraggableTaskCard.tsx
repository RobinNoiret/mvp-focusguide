'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ProjectTaskCard } from './ProjectTaskCard'
import type { Task } from '@focus-guide/shared'

interface DraggableTaskCardProps {
  task: Task
  projectId: string
  onEdit: () => void
  onDelete: () => void
}

export function DraggableTaskCard({
  task,
  projectId,
  onEdit,
  onDelete,
}: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ProjectTaskCard
        task={task}
        projectId={projectId}
        isDragging={isDragging}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  )
}
