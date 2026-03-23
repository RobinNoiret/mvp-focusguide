import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Project from '#models/project'
import Task from '#models/task'
import { createProjectValidator, updateProjectValidator } from '#validators/project_validator'
import { calculateProjectStats } from '#services/project_stats_service'
import { NotFoundException, BadRequestException } from '#exceptions/app_exception'

export default class ProjectsController {
  /**
   * GET /v1/projects
   * Returns all non-deleted projects with completionPercentage, taskCounts
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const projects = await Project.query()
      .where('userId', user.id)
      .whereNull('deletedAt')
      .preload('tasks', (query) => {
        query.whereNull('deletedAt')
      })
      .orderBy('createdAt', 'desc')

    const projectsWithStats = projects.map((project) => {
      const stats = calculateProjectStats(project.tasks)

      return {
        ...project.serialize(),
        ...stats,
      }
    })

    return response.ok(projectsWithStats)
  }

  /**
   * POST /v1/projects
   * Creates a new project
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createProjectValidator)

    // Validate deadline is in future if provided
    if (data.deadline) {
      const deadlineDate = DateTime.fromISO(data.deadline)
      if (!deadlineDate.isValid || deadlineDate < DateTime.now().startOf('day')) {
        throw new BadRequestException('Deadline must be a valid future date')
      }
    }

    const project = await Project.create({
      userId: user.id,
      title: data.title,
      description: data.description || null,
      deadline: data.deadline ? DateTime.fromISO(data.deadline) : null,
      tags: data.tags || [],
    })

    return response.created({
      ...project.serialize(),
      completionPercentage: 0,
      taskCount: 0,
      taskCounts: { backlog: 0, todo: 0, inProgress: 0, done: 0 },
    })
  }

  /**
   * GET /v1/projects/:id
   * Returns project with all tasks as a flat array
   */
  async show({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const project = await Project.query()
      .where('id', params.id)
      .where('userId', user.id)
      .whereNull('deletedAt')
      .first()

    if (!project) {
      throw new NotFoundException('Project', params.id)
    }

    const tasks = await project
      .related('tasks')
      .query()
      .whereNull('deletedAt')
      .orderBy('createdAt', 'desc')

    const stats = calculateProjectStats(tasks)

    return response.ok({
      ...project.serialize(),
      ...stats,
      tasks: tasks.map((t) => t.serialize()),
    })
  }

  /**
   * PATCH /v1/projects/:id
   * Updates project metadata
   */
  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const project = await Project.query()
      .where('id', params.id)
      .where('userId', user.id)
      .whereNull('deletedAt')
      .first()

    if (!project) {
      throw new NotFoundException('Project', params.id)
    }

    const data = await request.validateUsing(updateProjectValidator)

    // Validate deadline if provided
    if (data.deadline !== undefined) {
      if (data.deadline === null || data.deadline === '') {
        project.deadline = null
      } else {
        const deadlineDate = DateTime.fromISO(data.deadline)
        if (!deadlineDate.isValid) {
          throw new BadRequestException('Invalid deadline format')
        }
        project.deadline = deadlineDate
      }
    }

    if (data.title !== undefined) {
      project.title = data.title
    }

    if (data.description !== undefined) {
      project.description =
        typeof data.description === 'string' && data.description.trim().length > 0
          ? data.description.trim().substring(0, 2000)
          : null
    }

    if (data.tags !== undefined) {
      project.tags = data.tags
    }

    await project.save()

    return response.ok(project.serialize())
  }

  /**
   * DELETE /v1/projects/:id
   * Soft deletes project and cascade deletes tasks
   * AC 3, 4: Uses transaction for atomic cascade delete
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    // Fetch project - include deleted ones for idempotent delete
    const project = await Project.query()
      .where('id', params.id)
      .where('userId', user.id)
      .first()

    if (!project) {
      throw new NotFoundException('Project', params.id)
    }

    // If already deleted, return success (idempotent)
    if (project.deletedAt) {
      return response.noContent()
    }

    // AC 4: Start transaction for atomic cascade delete
    const trx = await db.transaction()

    try {
      const now = DateTime.now()

      // AC 4: Cascade soft delete all tasks in this project
      await Task.query({ client: trx })
        .where('projectId', project.id)
        .whereNull('deletedAt')
        .update({ deletedAt: now.toSQL() })

      // Soft delete the project (use transaction client for atomicity)
      await Project.query({ client: trx })
        .where('id', project.id)
        .update({ deletedAt: now.toSQL() })

      await trx.commit()

      return response.noContent()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
