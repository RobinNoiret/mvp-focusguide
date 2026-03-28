import apiClient from '@/lib/api-client'

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
}

class CalendarService {
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    const response = await apiClient.get<CalendarEvent[]>('/calendar')
    return response.data
  }
}

export const calendarService = new CalendarService()
