import { useQuery } from '@tanstack/react-query'
import { REACT_QUERY_DEFAULTS } from '@focus-guide/shared'
import { calendarService, type CalendarEvent } from '@/services/calendar-service'

export type { CalendarEvent }

export function useCalendarEvents() {
  return useQuery({
    queryKey: ['calendar', 'events'],
    queryFn: () => calendarService.getCalendarEvents(),
    // Shorter stale time for better synchronization when tasks are modified
    staleTime: 30 * 1000, // 30 seconds instead of default
    refetchOnWindowFocus: true, // Refetch when user returns to window
    refetchOnReconnect: true, // Refetch when connection is restored
  })
}
