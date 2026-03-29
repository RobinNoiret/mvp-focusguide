import apiClient from '@/lib/api-client'
import type { PomodoroSettings } from '@focus-guide/shared'

interface CalendarSettings {
  weekStartDay?: number
}

interface User {
  id: string
  email: string
  name: string
  pomodoro_settings?: PomodoroSettings
  calendar_settings?: CalendarSettings
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

  async updateCalendarSettings(settings: CalendarSettings): Promise<CalendarSettings> {
    const response = await apiClient.patch<CalendarSettings>(
      '/users/me/calendar-settings',
      settings
    )
    return response.data
  }
}

export const userService = new UserService()
export type { CalendarSettings, User }
