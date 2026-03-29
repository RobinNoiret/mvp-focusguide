import { useQuery } from '@tanstack/react-query'
import { calendarService } from '@/services/calendar-service'

// Maps task deadlines to FullCalendar event format
export function useCalendarDeadlines() {
  const query = useQuery({
    queryKey: ['calendar', 'events'],
    queryFn: async () => {
      const events = await calendarService.getCalendarEvents()
      return events
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  return query
}
