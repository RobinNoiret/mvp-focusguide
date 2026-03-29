import apiClient from '@/lib/api-client'

// Task deadline events from /calendar endpoint
export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
  extendedProps?: {
    task?: any
  }
}

// User-created calendar events
export interface CalendarEventItem {
  id: string
  title: string
  startDate: string
  endDate: string | null
  isAllDay: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateCalendarEventInput {
  title: string
  startDate: string
  endDate?: string | null
  isAllDay?: boolean
}

export interface UpdateCalendarEventInput {
  title?: string
  startDate?: string
  endDate?: string | null
  isAllDay?: boolean
}

class CalendarService {
  // Task deadlines (read-only)
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    const response = await apiClient.get<CalendarEvent[]>('/calendar')
    return response.data
  }

  // User-created calendar events
  async getCalendarEventItems(): Promise<CalendarEventItem[]> {
    const response = await apiClient.get<CalendarEventItem[]>('/calendar-events')
    return response.data
  }

  async createCalendarEvent(data: CreateCalendarEventInput): Promise<CalendarEventItem> {
    const response = await apiClient.post<CalendarEventItem>('/calendar-events', data)
    return response.data
  }

  async updateCalendarEvent(id: string, data: UpdateCalendarEventInput): Promise<CalendarEventItem> {
    const response = await apiClient.patch<CalendarEventItem>(`/calendar-events/${id}`, data)
    return response.data
  }

  async deleteCalendarEvent(id: string): Promise<void> {
    await apiClient.delete(`/calendar-events/${id}`)
  }
}

export const calendarService = new CalendarService()
