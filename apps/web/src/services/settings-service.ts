import apiClient from '@/lib/api-client'

export interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
  pomodoro_settings: PomodoroSettings
}

export interface PomodoroSettings {
  focusDuration: number
  breakDuration: number
  repetitions: number
  autoSwitch: boolean
}

export const settingsService = {
  async getUser(): Promise<User> {
    const response = await apiClient.get('/users/me')
    return response.data
  },

  async updatePomodoroSettings(settings: PomodoroSettings): Promise<PomodoroSettings> {
    const response = await apiClient.post('/users/me/pomodoro-settings', settings)
    return response.data
  },
}
