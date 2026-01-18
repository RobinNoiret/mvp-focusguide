import { test } from '@japa/runner'
import User from '#models/user'
import Project from '#models/project'
import Task from '#models/task'
import { TaskSyncService } from '#services/task_sync_service'

test.group('Tasks - Bidirectional Sync (Today → Project)', (group) => {
  let user: User
  let project: Project

  group.each.setup(async () => {
    // Cleanup and create fresh data
    await Task.query().delete()
    await Project.query().delete()
    await User.query().delete()

    user = await User.create({
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      emailVerified: true,
      pomodoroSettings: {},
    })

    project = await Project.create({
      userId: user.id,
      title: 'Test Project',
      description: 'A test project',
      deadline: null,
      tags: [],
    })
  })

  // AC 9: Unit test for sync
  test('syncs today_status=done to project_status=done when project_id exists', async ({ assert }) => {
    const task = await Task.create({
      userId: user.id,
      projectId: project.id,
      title: 'Test Task',
      notes: null,
      projectStatus: 'todo',
      todayStatus: 'todo',
      deadline: null,
    })

    // Mark done in Today
    task.todayStatus = 'done'

    // AC 3: Apply sync
    await TaskSyncService.applyBidirectionalSync(task)

    // AC 1: Verify project_status updated
    const updatedTask = await Task.find(task.id)
    assert.equal(updatedTask?.projectStatus, 'done')
    assert.equal(updatedTask?.todayStatus, 'done')
  })

  test('does not sync if no project_id (standalone task)', async ({ assert }) => {
    const task = await Task.create({
      userId: user.id,
      projectId: null, // Standalone task
      title: 'Standalone Task',
      notes: null,
      todayStatus: 'todo',
      projectStatus: null,
      deadline: null,
    })

    task.todayStatus = 'done'

    await TaskSyncService.applyBidirectionalSync(task)

    // project_status remains null
    const updatedTask = await Task.find(task.id)
    assert.isNull(updatedTask?.projectStatus)
    assert.equal(updatedTask?.todayStatus, 'done')
  })

  test('does not sync if today_status is not done', async ({ assert }) => {
    const task = await Task.create({
      userId: user.id,
      projectId: project.id,
      title: 'Test Task',
      notes: null,
      projectStatus: 'todo',
      todayStatus: 'in_progress',
      deadline: null,
    })

    // Keep it in progress
    await TaskSyncService.applyBidirectionalSync(task)

    // project_status should still be todo
    const updatedTask = await Task.find(task.id)
    assert.equal(updatedTask?.projectStatus, 'todo')
    assert.equal(updatedTask?.todayStatus, 'in_progress')
  })

  // AC 10: Integration test via API
  test('PATCH /v1/tasks/:id with today_status=done syncs project_status', async ({ client, assert }) => {
    const task = await Task.create({
      userId: user.id,
      projectId: project.id,
      title: 'Test Task',
      notes: null,
      projectStatus: 'todo',
      todayStatus: 'todo',
      deadline: null,
    })

    // Login to get token
    const loginResponse = await client.post('/v1/auth/login').json({
      email: 'test@example.com',
      password: 'password',
    })

    const token = loginResponse.body().accessToken

    // AC 7: Update task to mark done
    const updateResponse = await client
      .patch(`/v1/tasks/${task.id}`)
      .bearerToken(token)
      .json({
        todayStatus: 'done',
      })

    updateResponse.assertStatus(200)

    // Verify sync happened
    assert.equal(updateResponse.body().projectStatus, 'done')
    assert.equal(updateResponse.body().todayStatus, 'done')

    // AC 6: Verify database is updated
    const updatedTask = await Task.find(task.id)
    assert.equal(updatedTask?.projectStatus, 'done')
    assert.equal(updatedTask?.todayStatus, 'done')
  })

  test('update without status changes does not sync', async ({ client, assert }) => {
    const task = await Task.create({
      userId: user.id,
      projectId: project.id,
      title: 'Test Task',
      notes: null,
      projectStatus: 'todo',
      todayStatus: 'todo',
      deadline: null,
    })

    // Login
    const loginResponse = await client.post('/v1/auth/login').json({
      email: 'test@example.com',
      password: 'password',
    })

    const token = loginResponse.body().accessToken

    // Update only title, not status
    const updateResponse = await client
      .patch(`/v1/tasks/${task.id}`)
      .bearerToken(token)
      .json({
        title: 'Updated Title',
      })

    updateResponse.assertStatus(200)

    // project_status unchanged
    const updatedTask = await Task.find(task.id)
    assert.equal(updatedTask?.projectStatus, 'todo')
    assert.equal(updatedTask?.todayStatus, 'todo')
    assert.equal(updatedTask?.title, 'Updated Title')
  })
})
