import Task from '#models/task'

/**
 * TaskSyncService - Handles unidirectional sync from Today to Project
 *
 * Sync only on FORWARD progression (advancement), not on regression (reporting):
 * - Backlog → Todo ✅
 * - Todo → In Progress ✅
 * - In Progress → Done ✅
 * - But NOT: Done → In Progress, In Progress → Todo, etc. (regression = local decision)
 *
 * Reason: Regression in Today doesn't mean the task regressed in Project.
 * It's just a personal decision to postpone/reschedule for another day.
 */
export class TaskSyncService {
  /**
   * Apply unidirectional sync: Today status → Project status (FORWARD ONLY)
   * When todayStatus changes forward, sync to projectStatus if task has a project
   *
   * @param task - The task to sync (must have old projectStatus for comparison)
   * @param previousProjectStatus - The previous projectStatus before update
   */
  public static async applyBidirectionalSync(
    task: Task,
    previousProjectStatus?: string | null
  ): Promise<void> {
    // Only sync if task has a project and new status is valid
    if (!task.todayStatus || !task.projectId) {
      await task.save()
      return
    }

    // Define progression order
    const statusOrder = { backlog: 0, todo: 1, in_progress: 2, done: 3 }

    const currentLevel = statusOrder[task.todayStatus as keyof typeof statusOrder]
    const previousLevel = previousProjectStatus
      ? statusOrder[previousProjectStatus as keyof typeof statusOrder]
      : -1

    // Only sync if we're moving FORWARD (higher level), not backward
    if (currentLevel > previousLevel) {
      // Map today statuses to project statuses
      const validStatuses = ['backlog', 'todo', 'in_progress', 'done']
      if (validStatuses.includes(task.todayStatus)) {
        task.projectStatus = task.todayStatus as
          | 'backlog'
          | 'todo'
          | 'in_progress'
          | 'done'
      }
    }
    // If regressing, don't update projectStatus - it's just a local Today decision

    await task.save()
  }
}
