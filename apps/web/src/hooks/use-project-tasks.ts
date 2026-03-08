import { useQueryClient } from '@tanstack/react-query'
import { taskService } from '@/services/task-service'
import { createMutationHook } from '@/hooks/use-mutation-helpers'
import type { ProjectWithStats } from '@/services/project-service'
import type { CreateTaskInput, UpdateTaskInput, Task } from '@focus-guide/shared'

/**
 * Helper: Calculate task counts by status
 */
function calculateTaskCounts(tasks: Task[]) {
  const counts = { backlog: 0, todo: 0, inProgress: 0, done: 0 }

  tasks.forEach((task) => {
    if (task.projectStatus === 'backlog') counts.backlog++
    else if (task.projectStatus === 'todo') counts.todo++
    else if (task.projectStatus === 'in_progress') counts.inProgress++
    else if (task.projectStatus === 'done') counts.done++
  })

  return counts
}

/**
 * Helper: Calculate completion percentage from task counts
 */
function calculateCompletionPercentage(
  taskCounts: { done: number },
  totalCount: number
): number {
  if (totalCount === 0) return 0
  return Math.round((taskCounts.done / totalCount) * 100)
}

/**
 * Helper: Recalculate project stats after task changes
 */
function recalculateProjectStats(
  old: ProjectWithStats | undefined,
  updatedTasks: Task[] | undefined
): Partial<ProjectWithStats> {
  if (!old || !updatedTasks) return {}

  const newTaskCounts = calculateTaskCounts(updatedTasks)

  return {
    tasks: updatedTasks,
    taskCount: updatedTasks.length,
    taskCounts: newTaskCounts,
    completionPercentage: calculateCompletionPercentage(newTaskCounts, updatedTasks.length),
  }
}

/**
 * Create a task within a project
 */
export function useCreateProjectTask(projectId: string) {
  const queryClient = useQueryClient()

  return createMutationHook<CreateTaskInput, Task>({
    mutationFn: (input) => taskService.createTask(input),
    queryKey: ['projects', projectId],
    mutationType: 'create',
    entityName: 'tâche',

    onOptimisticUpdate: (qc, newTaskInput) => {
      const previousProject = qc.getQueryData<ProjectWithStats>(['projects', projectId])

      qc.setQueryData<ProjectWithStats>(['projects', projectId], (old) => {
        if (!old) return old

        const optimisticTask: Task = {
          id: `temp-${Date.now()}`,
          userId: 'current-user',
          projectId: newTaskInput.projectId || null,
          title: newTaskInput.title,
          notes: newTaskInput.notes || null,
          todayStatus: newTaskInput.todayStatus || null,
          projectStatus: newTaskInput.projectStatus || null,
          deadline: newTaskInput.deadline || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        }

        const newTasks = [...(old.tasks || []), optimisticTask]

        return {
          ...old,
          ...recalculateProjectStats(old, newTasks),
        }
      })

      return { previousData: previousProject }
    },

    onSuccess: () => {
      // Invalidate both specific project and list of projects
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },

    customSuccessMessage: 'Tâche créée',
  })(
    {
      onSuccess: () => {
        // Additional invalidation after standard behavior
        queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      },
    }
  )
}

/**
 * Update a task within a project
 */
export function useUpdateProjectTask(projectId: string) {
  const queryClient = useQueryClient()

  return createMutationHook<{ id: string; data: UpdateTaskInput }, Task>({
    mutationFn: ({ id, data }) => taskService.updateTask(id, data),
    queryKey: ['projects', projectId],
    mutationType: 'update',
    entityName: 'tâche',

    onOptimisticUpdate: (qc, { id, data }) => {
      const previousProject = qc.getQueryData<ProjectWithStats>(['projects', projectId])

      qc.setQueryData<ProjectWithStats>(['projects', projectId], (old) => {
        if (!old) return old

        const updatedTasks = old.tasks?.map((task) => {
          if (task.id !== id) return task

          return {
            ...task,
            title: data.title ?? task.title,
            notes: data.notes !== undefined ? data.notes : task.notes,
            projectStatus: data.projectStatus !== undefined ? data.projectStatus : task.projectStatus,
            deadline: data.deadline !== undefined ? data.deadline : task.deadline,
            updatedAt: new Date().toISOString(),
          }
        })

        return {
          ...old,
          ...recalculateProjectStats(old, updatedTasks),
        }
      })

      return { previousData: previousProject }
    },

    onSuccess: (data) => {
      // Invalidate project caches
      queryClient.invalidateQueries({ queryKey: ['projects'] })

      // Invalidate Today cache if task is in Today (bidirectional sync)
      // This ensures that changes in project status are reflected in Today
      if (data?.todayStatus) {
        queryClient.invalidateQueries({ queryKey: ['today', 'tasks'] })
      }
    },

    customSuccessMessage: 'Tâche modifiée',
  })(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      },
    }
  )
}

/**
 * Delete a task from a project
 */
export function useDeleteProjectTask(projectId: string) {
  const queryClient = useQueryClient()

  return createMutationHook<string, void>({
    mutationFn: (taskId) => taskService.deleteTask(taskId),
    queryKey: ['projects', projectId],
    mutationType: 'delete',
    entityName: 'tâche',

    onOptimisticUpdate: (qc, taskId) => {
      const previousProject = qc.getQueryData<ProjectWithStats>(['projects', projectId])

      qc.setQueryData<ProjectWithStats>(['projects', projectId], (old) => {
        if (!old) return old

        const updatedTasks = old.tasks?.filter((task) => task.id !== taskId)

        return {
          ...old,
          ...recalculateProjectStats(old, updatedTasks),
        }
      })

      return { previousData: previousProject }
    },

    onSuccess: () => {
      // Invalidate project caches
      queryClient.invalidateQueries({ queryKey: ['projects'] })

      // Invalidate Today cache in case the deleted task was in Today
      queryClient.invalidateQueries({ queryKey: ['today', 'tasks'] })
    },

    customSuccessMessage: 'Tâche supprimée',
  })(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      },
    }
  )
}
