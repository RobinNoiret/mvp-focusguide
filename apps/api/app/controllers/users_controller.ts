import type { HttpContext } from '@adonisjs/core/http'
import { BadRequestException } from '#exceptions/app_exception'

export default class UsersController {
  // AC 5: Get user with settings
  async me({ auth, response }: HttpContext) {
    const user = await auth.authenticateUsing(['api'])

    return response.ok({
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      pomodoro_settings: user.pomodoroSettings,
    })
  }

  // AC 4: Update Pomodoro settings
  async updatePomodoroSettings({ auth, request, response }: HttpContext) {
    const user = await auth.authenticateUsing(['api'])

    const settings = request.only([
      'focusDuration',
      'breakDuration',
      'repetitions',
      'autoSwitch',
    ])

    // Validate settings
    if (
      typeof settings.focusDuration !== 'number' ||
      typeof settings.breakDuration !== 'number' ||
      typeof settings.repetitions !== 'number' ||
      typeof settings.autoSwitch !== 'boolean'
    ) {
      throw new BadRequestException('Invalid settings types')
    }

    if (
      settings.focusDuration < 1 ||
      settings.focusDuration > 60 ||
      settings.breakDuration < 1 ||
      settings.breakDuration > 30 ||
      settings.repetitions < 1 ||
      settings.repetitions > 10
    ) {
      throw new BadRequestException('Invalid settings values')
    }

    // AC 4: Update JSONB field
    user.pomodoroSettings = settings
    await user.save()

    return response.ok(user.pomodoroSettings)
  }
}
