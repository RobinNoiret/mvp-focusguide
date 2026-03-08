'use client'

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useProject } from '@/hooks/use-project'
import { useTodayStore } from '@/stores/today-store'
import { ProjectTaskCard } from './ProjectTaskCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { Task, TaskStatus } from '@focus-guide/shared'

interface ProjectTaskListProps {
  activeTask?: Task | null
}

export function ProjectTaskList({ activeTask }: ProjectTaskListProps) {
  const { selectedProjectId } = useTodayStore()

  // AC 1, 10: Fetch project with tasks
  const { data: project, isLoading } = useProject(selectedProjectId || '')

  // No project selected
  if (!selectedProjectId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-center text-sm text-gray-500">
          Sélectionnez un projet...
        </p>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  // AC 7: Empty state
  if (!project?.tasks || project.tasks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-center text-sm text-gray-500">
          Aucune tâche dans ce projet
        </p>
      </div>
    )
  }

  // Filter out tasks already in Today to avoid duplicates
  // Also filter out the task being dragged (activeTask) to avoid animation glitch
  const tasksNotInToday = project.tasks?.filter((task) =>
    !task.todayStatus && !task.deletedAt && task.id !== activeTask?.id
  ) || []

  // AC 4: Group tasks by projectStatus
  const tasksByStatus = {
    backlog: [] as Task[],
    todo: [] as Task[],
    in_progress: [] as Task[],
    done: [] as Task[],
  }

  tasksNotInToday.forEach((task) => {
    if (task.projectStatus) {
      tasksByStatus[task.projectStatus as TaskStatus].push(task)
    }
  })

  // Exclude done tasks from display (show only actionable tasks: backlog, todo, in_progress)
  const orderedStatuses: TaskStatus[] = ['backlog', 'todo', 'in_progress']

  // Count actionable tasks (excluding done)
  const actionableTasksCount = orderedStatuses.reduce(
    (sum, status) => sum + tasksByStatus[status].length,
    0
  )

  // Check if all tasks are done or already in Today
  if (actionableTasksCount === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-center text-sm text-gray-500">
          Aucune tâche à faire ou en cours
        </p>
      </div>
    )
  }

  return (
    // AC 9: Scrollable (parent has overflow-y-auto)
    // AC 11: Smooth transition (React Query handles caching)
    <div className="space-y-3">
      {/* AC 6: Task count */}
      <div className="text-sm">
        <span className="font-medium text-dark">
          {actionableTasksCount} tâche{actionableTasksCount > 1 ? 's' : ''} à faire
        </span>
      </div>

      {/* AC 4: Tasks grouped by status */}
      {orderedStatuses.map((status) => {
        const tasks = tasksByStatus[status]
        if (tasks.length === 0) return null

        const statusLabels = {
          backlog: 'Backlog',
          todo: 'À faire',
          in_progress: 'En cours',
          done: 'Terminées',
        }

        return (
          <div key={status} className="space-y-1">
            {/* AC 4: Status headers */}
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-600">
              {statusLabels[status]}
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs">
                {tasks.length}
              </span>
            </h3>

            {/* AC 2, 3, 5, 8: Task cards */}
            <div className="space-y-1.5">
              <SortableContext
                items={tasks.map((t) => `panel-${t.id}`)}
                strategy={verticalListSortingStrategy}
              >
                {tasks.map((task) => (
                  <ProjectTaskCard
                    key={task.id}
                    task={task}
                    projectId={selectedProjectId}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
        )
      })}
    </div>
  )
}
