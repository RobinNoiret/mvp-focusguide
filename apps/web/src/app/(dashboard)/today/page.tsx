'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { useTranslation } from '@/hooks/use-translation'
import { KanbanBoard } from '@/components/kanban'
import { ColumnStatus } from '@/components/kanban/KanbanColumn'
import { TaskCard } from '@/components/kanban/TaskCard'
import { CreateTaskModal } from '@/components/modals/CreateTaskModal'
import { ResponsiveSidePanel } from '@/components/today/ResponsiveSidePanel'
import { useTodayTasks, useUpdateTask } from '@/hooks/use-today-tasks'
import type { Task, TaskStatus } from '@focus-guide/shared'

export default function TodayPage() {
  const { t } = useTranslation()
  const { data: tasks, isLoading, error } = useTodayTasks()
  const updateTask = useUpdateTask()
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<TaskStatus>('todo')
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [sidePanelExpanded, setSidePanelExpanded] = useState(true)

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

  const handleAddTask = (columnId: ColumnStatus) => {
    setSelectedColumn(columnId)
    setModalOpen(true)
  }

  const handleDragStart = (event: DragStartEvent) => {
    // Handle both Today tasks and panel tasks
    const task = event.active.data.current?.task
    if (task) {
      setActiveTask(task)
    } else {
      // Fallback for Today tasks (find by ID, remove 'panel-' prefix if present)
      const taskId = (event.active.id as string).replace('panel-', '')
      const todayTask = tasks?.find((t) => t.id === taskId)
      setActiveTask(todayTask || null)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event
    if (!over) return

    // AC 3: Only allow drops in Backlog and À faire aujourd'hui for panel tasks
    const task = active.data.current?.task as Task
    const isFromPanel = task?.projectId && !task.todayStatus

    if (isFromPanel) {
      const allowedColumns: TaskStatus[] = ['backlog', 'todo']
      const targetColumn = over.id as TaskStatus
      // Prevent drop feedback if column is invalid
      if (!allowedColumns.includes(targetColumn)) {
        return
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveTask(null)
      return
    }

    const activeId = active.id as string
    const isFromPanel = activeId.startsWith('panel-') // Tasks from sidebar have 'panel-' prefix

    let taskId = activeId
    if (isFromPanel) {
      // Remove 'panel-' prefix to get actual task ID
      taskId = activeId.replace('panel-', '')
    }

    const newStatus = over.id as TaskStatus

    if (isFromPanel) {
      // AC 2, 3: Dropping a task from panel into kanban
      // The task will be added to Today with the target status
      // Note: Project sync will handle status mapping (Today status → Project status)

      // Optimistic update: add task to Today immediately
      if (activeTask) {
        queryClient.setQueryData<Task[]>(['today', 'tasks'], (old) => {
          const exists = old?.some((t) => t.id === taskId)
          if (!exists) {
            const newTask: Task = {
              ...activeTask,
              todayStatus: newStatus,
              updatedAt: new Date().toISOString(),
            }
            return [newTask, ...(old || [])]
          }
          return old
        })
      }

      // AC 5, 6: Update task with today_status on server
      updateTask.mutate(
        {
          id: taskId,
          data: { todayStatus: newStatus },
        },
        {
          onSettled: () => {
            setActiveTask(null)
          },
        }
      )
    } else {
      // Handle Today task drag within Today columns
      const task = tasks?.find((t) => t.id === taskId)

      if (!task || task.todayStatus === newStatus) {
        setActiveTask(null)
        return
      }

      // Keep activeTask set during the mutation so DragOverlay stays visible
      // The optimistic update will handle showing the task in the new column
      updateTask.mutate(
        {
          id: taskId,
          data: { todayStatus: newStatus },
        },
        {
          onSettled: () => {
            // Only clear activeTask after mutation is done
            setActiveTask(null)
          },
        }
      )
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse text-gray-500">{t.common.loading}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{t.today.loadFailed}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-chartreuse hover:underline"
          >
            {t.common.retry}
          </button>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full flex-row overflow-hidden">
        {/* Main content area with header and kanban */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-3xl font-bold font-display text-dark">{t.today.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.today.subtitle}
            </p>
          </div>

          {/* Kanban area */}
          <div className="flex-1 overflow-auto p-6">
            <KanbanBoard
              tasks={tasks?.filter((t) => t.id !== activeTask?.id) || []}
              onAddTask={handleAddTask}
            />
          </div>
        </div>

        {/* AC 1, 6: Side panel on the right with responsive behavior - full height */}
        <ResponsiveSidePanel
          isExpanded={sidePanelExpanded}
          onToggleExpand={setSidePanelExpanded}
          activeTask={activeTask}
        >
          {/* AC 3: Empty initially, will be populated in Story 3.3 */}
        </ResponsiveSidePanel>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} isDragging />}
        </DragOverlay>
      </div>

      <CreateTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        columnStatus={selectedColumn}
      />
    </DndContext>
  )
}
