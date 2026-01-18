import Task from '#models/task'

/**
 * TaskSyncService - Handles bidirectional sync between Today and Project statuses
 *
 * AC 2, 3: Sync logic for task status changes
 * Current: today_status=done → project_status=done (if project_id exists)
 * Future: Can expand to other statuses
 */
export class TaskSyncService {
  /**
   * AC 2, 3: Apply bidirectional sync
   * When task is marked done in Today, mark done in Project
   *
   * @param task - The task to sync
   */
  public static async applyBidirectionalSync(task: Task): Promise<void> {
    // AC 3: Sync today_status=done → project_status=done
    if (task.todayStatus === 'done' && task.projectId) {
      task.projectStatus = 'done'
      await task.save()
    } else if (task.todayStatus !== 'done' || !task.projectId) {
      // If not marked done or no project, just save without sync
      await task.save()
    }
  }

}
