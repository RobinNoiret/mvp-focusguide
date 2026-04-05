import apiClient from '@/lib/api-client'
import type { PomodoroSettings, User } from '@focus-guide/shared'

class UserService {
  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/users/me')
    return response.data
  }

  async updatePomodoroSettings(settings: PomodoroSettings): Promise<PomodoroSettings> {
    const response = await apiClient.patch<PomodoroSettings>(
      '/users/me/pomodoro-settings',
      settings
    )
    return response.data
  }

  async completeOnboarding(flOnboarding: boolean): Promise<void> {
    await apiClient.patch('/users/me/onboarding', { flOnboarding })
  }
}

export const userService = new UserService()
