import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Task from '#models/task'
import { createTaskValidator, updateTaskValidator } from '#validators/task_validator'
import { TaskSyncService } from '#services/task_sync_service'
import { NotFoundException, ForbiddenException } from '#exceptions/app_exception'

export default class TasksController {
  async store({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createTaskValidator)

    const task = await Task.create({
      userId: user.id,
      title: data.title.trim(),
      notes: data.notes?.trim() || null,
      todayStatus: data.todayStatus || null,
      projectId: data.projectId || null,
      projectStatus: data.projectStatus || null,
      deadline: data.deadline ? DateTime.fromISO(data.deadline) : null,
    })

    return response.status(201).json(task)
  }

  async today({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const tasks = await Task.query()
      .where('userId', user.id)
      .whereNotNull('todayStatus')
      .whereNull('deletedAt')
      .orderBy('createdAt', 'desc')

    return tasks
  }

  async update({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(updateTaskValidator)

    const task = await Task.query()
      .where('id', params.id)
      .whereNull('deletedAt')
      .first()

    if (!task) {
      throw new NotFoundException('Task', params.id)
    }

    if (task.userId !== user.id) {
      throw new ForbiddenException('Not authorized to update this task')
    }

    // Save old projectStatus before modifications (for sync logic)
    const previousProjectStatus = task.projectStatus

    if (data.title !== undefined) {
      task.title = data.title.trim()
    }
    if (data.notes !== undefined) {
      const notes = typeof data.notes === 'string' ? data.notes.trim() : null
      task.notes = notes && notes.length > 0 ? notes.substring(0, 2000) : null
    }
    if (data.todayStatus !== undefined) {
      task.todayStatus = data.todayStatus
    }
    if (data.projectStatus !== undefined) {
      task.projectStatus = data.projectStatus
    }
    if (data.deadline !== undefined) {
      if (data.deadline === null || data.deadline === '') {
        task.deadline = null
      } else if (typeof data.deadline === 'string') {
        task.deadline = DateTime.fromISO(data.deadline)
      }
    }

    // AC 4: Apply unidirectional sync (Today → Project only, FORWARD progression)
    // Only sync if todayStatus changed (not projectStatus)
    // Pass the previous projectStatus to determine if we're advancing or regressing
    if (data.todayStatus !== undefined) {
      await TaskSyncService.applyBidirectionalSync(task, previousProjectStatus)
    } else if (data.projectStatus !== undefined && data.projectStatus === 'done' && task.todayStatus) {
      // Reverse sync: If projectStatus changes to "done" and task is in Today, mark it done in Today too
      // This ensures consistency: if done in project, should be done in Today
      task.todayStatus = 'done'
      await task.save()
    } else {
      await task.save()
    }

    return response.ok(task)
  }

  async destroy({ params, auth, response }: HttpContext) {
    console.log('[TASK DESTROY] Called with id:', params.id)
    const user = auth.getUserOrFail()

    try {
      console.log('[TASK DESTROY] User authenticated:', user.id)
      const task = await Task.query()
        .where('id', params.id)
        .first()

      console.log('[TASK DESTROY] Task found:', task ? 'YES' : 'NO')

      if (!task) {
        throw new NotFoundException('Task', params.id)
      }

      console.log('[TASK DESTROY] Ownership check - task userId:', task.userId, 'user id:', user.id)

      if (task.userId !== user.id) {
        throw new ForbiddenException('Not authorized to delete this task')
      }

      console.log('[TASK DESTROY] Task deletedAt:', task.deletedAt)

      // If already deleted, return success (idempotent)
      if (task.deletedAt) {
        console.log('[TASK DESTROY] Already deleted, returning 204')
        return response.noContent()
      }

      console.log('[TASK DESTROY] Performing UPDATE...')

      // Use direct UPDATE to avoid model save issues
      await Task.query()
        .where('id', params.id)
        .update({ deletedAt: DateTime.now() })

      console.log('[TASK DESTROY] Update complete, returning 204')
      console.log('[TASK DESTROY] About to call response.noContent()')
      const result = response.noContent()
      console.log('[TASK DESTROY] response.noContent() completed:', result)
      return result
    } catch (error) {
      console.error('[TASK DELETE ERROR]', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        stack: error instanceof Error ? error.stack : 'No stack',
      })
      throw error
    }
  }
}
