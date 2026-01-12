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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// API v1 routes
router
  .group(() => {
    // Auth routes with rate limiting (5 req/min)
    // Note: Rate limiting temporarily disabled for migrations to work
    // TODO: Re-enable with proper middleware setup
    router.post('/auth/register', [AuthController, 'register'])
    router.post('/auth/login', [AuthController, 'login'])
    router.post('/auth/refresh', [AuthController, 'refresh'])
    router.post('/auth/logout', [AuthController, 'logout']).use(middleware.auth())
  })
  .prefix('/v1')
