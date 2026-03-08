import apiClient from '@/lib/api-client'
import type { PomodoroSettings } from '@focus-guide/shared'

interface User {
  id: string
  email: string
  name: string
  pomodoro_settings?: PomodoroSettings
}

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
}

export const userService = new UserService()
