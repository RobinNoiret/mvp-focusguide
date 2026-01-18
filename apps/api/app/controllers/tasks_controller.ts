import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Task from '#models/task'
import { createTaskValidator, updateTaskValidator } from '#validators/task_validator'

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
      return response.notFound({ error: 'Task not found' })
    }

    if (task.userId !== user.id) {
      return response.forbidden({ error: 'Not authorized to update this task' })
    }

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

    await task.save()

    return response.ok(task)
  }

  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const task = await Task.query()
      .where('id', params.id)
      .whereNull('deletedAt')
      .first()

    if (!task) {
      return response.notFound({ error: 'Task not found' })
    }

    if (task.userId !== user.id) {
      return response.forbidden({ error: 'Not authorized to delete this task' })
    }

    task.deletedAt = DateTime.now()
    await task.save()

    return response.noContent()
  }
}
