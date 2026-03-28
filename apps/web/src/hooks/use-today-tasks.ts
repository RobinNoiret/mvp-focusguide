import { useQuery, useQueryClient } from '@tanstack/react-query'
import { REACT_QUERY_DEFAULTS } from '@focus-guide/shared'
import { taskService } from '@/services/task-service'
import { createMutationHook } from '@/hooks/use-mutation-helpers'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@focus-guide/shared'

// ============================================================================
// QUERIES
// ============================================================================

export function useTodayTasks() {
  return useQuery({
    queryKey: ['today', 'tasks'],
    queryFn: () => taskService.getTodayTasks(),
    staleTime: REACT_QUERY_DEFAULTS.STALE_TIME.TODAY_TASKS,
  })
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new task in Today
 */
export const useCreateTask = createMutationHook<CreateTaskInput, Task>({
  mutationFn: (input) => taskService.createTask(input),
  queryKey: ['today', 'tasks'],
  mutationType: 'create',
  entityName: 'tâche',

  onOptimisticUpdate: (queryClient, newTask) => {
    const previousTasks = queryClient.getQueryData<Task[]>(['today', 'tasks'])

    const optimisticTask: Task = {
      id: `temp-${Date.now()}`,
      userId: 'current-user',
      title: newTask.title,
      notes: newTask.notes || null,
      todayStatus: newTask.todayStatus || 'todo',
      projectId: null,
      projectStatus: null,
      deadline: newTask.deadline || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    }

    queryClient.setQueryData<Task[]>(['today', 'tasks'], (old) => [
      optimisticTask,
      ...(old || []),
    ])

    return { previousData: previousTasks }
  },

  customSuccessMessage: 'Tâche créée',
})

/**
 * Update a task in Today
 * AC 6: Optimistic update for Today cache
 * AC 7: Update project cache to show "Dans Today" badge
 * AC 12: Rollback both caches on error
 * AC 13: Invalidate Today cache on success
 */
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return createMutationHook<{ id: string; data: UpdateTaskInput }, Task>({
    mutationFn: ({ id, data }) => taskService.updateTask(id, data),
    queryKey: ['today', 'tasks'],
    mutationType: 'update',
    entityName: 'tâche',

    onOptimisticUpdate: (qc, { id, data }) => {
      const previousTasks = qc.getQueryData<Task[]>(['today', 'tasks'])
      const currentTask = previousTasks?.find((t) => t.id === id)
      const projectId = currentTask?.projectId

      // Optimistic update for today
      qc.setQueryData<Task[]>(['today', 'tasks'], (old) =>
        old?.map((task) =>
          task.id === id
            ? { ...task, ...data, updatedAt: new Date().toISOString() }
            : task
        )
      )

      // AC 7: Update project cache to show "Dans Today" badge
      if (projectId) {
        qc.setQueryData(['projects', projectId], (old: unknown) => {
          const oldProject = old as { tasks?: Task[] } | undefined
          if (!oldProject) return oldProject
          return {
            ...oldProject,
            tasks: oldProject.tasks?.map((t: Task) =>
              t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
            ),
          }
        })
      }

      return {
        previousData: {
          previousTasks,
          previousProject: projectId ? qc.getQueryData(['projects', projectId]) : null,
          projectId,
        },
      }
    },

    onSuccess: (data) => {
      // Use server response (which has synced projectStatus) to update project cache immediately
      if (data.projectId && data) {
        queryClient.setQueryData(['projects', data.projectId], (old: unknown) => {
          const oldProject = old as { tasks?: Task[] } | undefined
          if (!oldProject) return oldProject

          return {
            ...oldProject,
            tasks: oldProject.tasks?.map((t: Task) =>
              t.id === data.id ? data : t
            ),
          }
        })
      }
    },

    customSuccessMessage: 'Tâche modifiée',
  })(
    // Custom error handling to rollback both caches
    {
      onError: (error, _variables, context: any) => {
        // AC 12: Rollback both caches on error
        queryClient.setQueryData(['today', 'tasks'], context?.previousData?.previousTasks)
        if (context?.previousData?.projectId) {
          queryClient.setQueryData(
            ['projects', context.previousData.projectId],
            context?.previousData?.previousProject
          )
        }
      },
      onSuccess: () => {
        // Refetch calendar immediately after any task update
        queryClient.refetchQueries({ queryKey: ['calendar', 'events'] })
      },
    }
  )
}

/**
 * Delete a task from Today
 */
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return createMutationHook<string, void>({
    mutationFn: (id) => taskService.deleteTask(id),
    queryKey: ['today', 'tasks'],
    mutationType: 'delete',
    entityName: 'tâche',

    onOptimisticUpdate: (queryClient, id) => {
      const previousTasks = queryClient.getQueryData<Task[]>(['today', 'tasks'])
      queryClient.setQueryData<Task[]>(['today', 'tasks'], (old) =>
        old?.filter((task) => task.id !== id)
      )
      return { previousData: previousTasks }
    },

    customSuccessMessage: 'Tâche supprimée',
  })(
    {
      onSuccess: () => {
        // Refetch calendar immediately as a deleted task might affect the calendar view
        queryClient.refetchQueries({ queryKey: ['calendar', 'events'] })
      },
    }
  )
}

/**
 * Remove a task from Today (unlink from Today but keep in project)
 */
export function useUnlinkTask() {
  const queryClient = useQueryClient()

  return createMutationHook<{ id: string }, Task>({
    mutationFn: ({ id }) => taskService.updateTask(id, { todayStatus: null }),
    queryKey: ['today', 'tasks'],
    mutationType: 'unlink',
    entityName: 'tâche',

    onOptimisticUpdate: (qc, { id }) => {
      const previousTasks = qc.getQueryData<Task[]>(['today', 'tasks'])
      qc.setQueryData<Task[]>(['today', 'tasks'], (old) =>
        old?.filter((task) => task.id !== id)
      )
      return { previousData: previousTasks }
    },

    onSuccess: () => {
      // Also invalidate projects to show task back in sidebar
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },

    customSuccessMessage: 'Tâche retirée du Today',
  })()
}
