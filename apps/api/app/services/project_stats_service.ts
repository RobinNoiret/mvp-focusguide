import Task from '#models/task'

export interface ProjectStats {
  taskCount: number
  taskCounts: {
    backlog: number
    todo: number
    inProgress: number
    done: number
  }
  completionPercentage: number
}

/**
 * Calculate project statistics from tasks array
 * Optimized to O(n) with single pass instead of multiple filters
 */
export function calculateProjectStats(tasks: InstanceType<typeof Task>[]): ProjectStats {
  if (tasks.length === 0) {
    return {
      taskCount: 0,
      taskCounts: {
        backlog: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
      },
      completionPercentage: 0,
    }
  }

  // Single pass through tasks
  const stats = tasks.reduce(
    (acc, task) => {
      // Count by status
      if (task.projectStatus === 'backlog') acc.backlog++
      else if (task.projectStatus === 'todo') acc.todo++
      else if (task.projectStatus === 'in_progress') acc.inProgress++
      else if (task.projectStatus === 'done') acc.done++

      // Track done for percentage calculation
      if (task.projectStatus === 'done') acc.doneCount++

      return acc
    },
    {
      backlog: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      doneCount: 0,
    }
  )

  const completionPercentage = Math.round((stats.doneCount / tasks.length) * 100)

  return {
    taskCount: tasks.length,
    taskCounts: {
      backlog: stats.backlog,
      todo: stats.todo,
      inProgress: stats.inProgress,
      done: stats.done,
    },
    completionPercentage,
  }
}
