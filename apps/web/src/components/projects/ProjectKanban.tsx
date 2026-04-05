'use client'

import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { ProjectColumn } from './ProjectColumn'
import { ProjectTaskCard } from './ProjectTaskCard'
import { CreateProjectTaskModal } from './CreateProjectTaskModal'
import { EditProjectTaskModal } from './EditProjectTaskModal'
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog'
import {
  useCreateProjectTask,
  useUpdateProjectTask,
  useDeleteProjectTask,
} from '@/hooks/use-project-tasks'
import { useTranslation } from '@/hooks/use-translation'
import type { ProjectWithStats } from '@/services/project-service'
import type { Task, TaskStatus } from '@focus-guide/shared'

interface ProjectKanbanProps {
  project: ProjectWithStats
}

function getColumns(t: any) {
  return [
    { id: 'backlog' as const, title: t.today.kanban.backlog },
    { id: 'todo' as const, title: t.today.kanban.todo },
    { id: 'in_progress' as const, title: t.today.kanban.inProgress },
    { id: 'done' as const, title: t.today.kanban.done },
  ]
}

export function ProjectKanban({ project }: ProjectKanbanProps) {
  const { t } = useTranslation()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<TaskStatus | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const createTask = useCreateProjectTask(project.id)
  const updateTask = useUpdateProjectTask(project.id)
  const deleteTask = useDeleteProjectTask(project.id)
  const columns = getColumns(t)

  // Same sensor configuration as Today page
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  )

  // Group tasks by status, filtering out activeTask during drag
  const tasksByStatus = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      done: [],
    }

    project.tasks?.forEach((task) => {
      // Skip the task being dragged
      if (activeTask && task.id === activeTask.id) return
      if (task.projectStatus && !task.deletedAt) {
        groups[task.projectStatus].push(task)
      }
    })

    return groups
  }, [project.tasks, activeTask])

  const handleDragStart = (event: DragStartEvent) => {
    const task = project.tasks?.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveTask(null)
      return
    }

    const taskId = active.id as string
    const task = project.tasks?.find((t) => t.id === taskId)
    const newStatus = over.id as TaskStatus

    if (!task || task.projectStatus === newStatus) {
      setActiveTask(null)
      return
    }

    // Keep activeTask set during the mutation
    updateTask.mutate(
      {
        id: taskId,
        data: { projectStatus: newStatus },
      },
      {
        onSettled: () => {
          setActiveTask(null)
        },
      }
    )
  }

  const handleAddTask = (columnId: TaskStatus) => {
    setSelectedColumn(columnId)
    setCreateModalOpen(true)
  }

  const handleCreateTask = async (data: {
    title: string
    notes?: string
    projectId: string
    projectStatus: TaskStatus
    todayStatus: null
    deadline?: string | null
  }) => {
    await createTask.mutateAsync({
      title: data.title,
      notes: data.notes,
      projectId: data.projectId,
      projectStatus: data.projectStatus,
      todayStatus: null,
      deadline: data.deadline,
    })
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
  }

  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task)
  }

  return (
    <div className="flex flex-col h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Responsive column layout - single render */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:snap-none h-full flex-1">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 snap-center md:flex-1 h-full"
              style={{ minWidth: '280px' }}
            >
              <ProjectColumn
                id={column.id}
                title={column.title}
                tasks={tasksByStatus[column.id]}
                projectId={project.id}
                onAddTask={() => handleAddTask(column.id)}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          ))}
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeTask && (
            <ProjectTaskCard
              task={activeTask}
              projectId={project.id}
              isDragging
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Modals outside DndContext */}
      <div>
        {/* Create task modal */}
      {selectedColumn && (
        <CreateProjectTaskModal
          isOpen={createModalOpen}
          onClose={() => {
            setCreateModalOpen(false)
            setSelectedColumn(null)
          }}
          projectId={project.id}
          projectStatus={selectedColumn}
          onSubmit={handleCreateTask}
        />
      )}

      {/* Edit task modal */}
      <EditProjectTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSubmit={async (id, data) => {
          await updateTask.mutateAsync({ id, data })
        }}
      />

      {/* Delete confirmation dialog */}
      {deletingTask && (
        <DeleteConfirmationDialog
          isOpen={!!deletingTask}
          onClose={() => setDeletingTask(null)}
          onConfirm={async () => {
            await deleteTask.mutateAsync(deletingTask.id)
          }}
          taskTitle={deletingTask.title}
        />
      )}
      </div>
    </div>
  )
}
