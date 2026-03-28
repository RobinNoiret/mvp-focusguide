import { useQuery } from '@tanstack/react-query'
import { REACT_QUERY_DEFAULTS } from '@focus-guide/shared'
import { calendarService, type CalendarEvent } from '@/services/calendar-service'

export type { CalendarEvent }

export function useCalendarEvents() {
  return useQuery({
    queryKey: ['calendar', 'events'],
    queryFn: () => calendarService.getCalendarEvents(),
    staleTime: REACT_QUERY_DEFAULTS.STALE_TIME.TODAY_TASKS,
  })
}
