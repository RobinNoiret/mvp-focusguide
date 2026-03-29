/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const TasksController = () => import('#controllers/tasks_controller')
const ProjectsController = () => import('#controllers/projects_controller')
const UsersController = () => import('#controllers/users_controller')
const CalendarEventsController = () => import('#controllers/calendar_events_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// API v1 routes
router
  .group(() => {
    // Auth routes
    router.post('/auth/register', [AuthController, 'register'])
    router.post('/auth/login', [AuthController, 'login'])
    router.post('/auth/refresh', [AuthController, 'refresh'])
    router.post('/auth/logout', [AuthController, 'logout']).use(middleware.auth())

    // Email verification routes
    router.post('/auth/verify-email', [AuthController, 'verifyEmail'])
    router
      .post('/auth/resend-verification', [AuthController, 'resendVerification'])
      .use(middleware.auth())

    // User routes
    router.get('/users/me', [UsersController, 'me']).use(middleware.auth())
    router
      .patch('/users/me/pomodoro-settings', [UsersController, 'updatePomodoroSettings'])
      .use(middleware.auth())
    router
      .patch('/users/me/calendar-settings', [UsersController, 'updateCalendarSettings'])
      .use(middleware.auth())

    // Task routes
    router.post('/tasks', [TasksController, 'store']).use(middleware.auth())
    router.get('/today', [TasksController, 'today']).use(middleware.auth())
    router.get('/calendar', [TasksController, 'calendar']).use(middleware.auth())
    router.patch('/tasks/:id', [TasksController, 'update']).use(middleware.auth())
    router.delete('/tasks/:id', [TasksController, 'destroy']).use(middleware.auth())

    // Project routes
    router.get('/projects', [ProjectsController, 'index']).use(middleware.auth())
    router.post('/projects', [ProjectsController, 'store']).use(middleware.auth())
    router.get('/projects/:id', [ProjectsController, 'show']).use(middleware.auth())
    router.patch('/projects/:id', [ProjectsController, 'update']).use(middleware.auth())
    router.delete('/projects/:id', [ProjectsController, 'destroy']).use(middleware.auth())

    // Calendar event routes
    router.get('/calendar-events', [CalendarEventsController, 'index']).use(middleware.auth())
    router.post('/calendar-events', [CalendarEventsController, 'store']).use(middleware.auth())
    router.patch('/calendar-events/:id', [CalendarEventsController, 'update']).use(middleware.auth())
    router.delete('/calendar-events/:id', [CalendarEventsController, 'destroy']).use(middleware.auth())
  })
  .prefix('/v1')
