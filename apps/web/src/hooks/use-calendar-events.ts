import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { REACT_QUERY_DEFAULTS } from '@focus-guide/shared'
import {
  calendarService,
  type CalendarEventItem,
  type CreateCalendarEventInput,
  type UpdateCalendarEventInput,
} from '@/services/calendar-service'
import { toast } from 'sonner'

export type { CalendarEventItem }

// Query hook for user-created calendar events
export function useCalendarEventsQuery() {
  return useQuery({
    queryKey: ['calendar', 'user-events'],
    queryFn: () => calendarService.getCalendarEventItems(),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}

// Mutation hook for creating calendar events
export function useCreateCalendarEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCalendarEventInput) =>
      calendarService.createCalendarEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar', 'user-events'] })
      toast.success('Événement créé')
    },
    onError: () => {
      toast.error('Erreur lors de la création')
    },
  })
}

// Mutation hook for updating calendar events
export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCalendarEventInput }) =>
      calendarService.updateCalendarEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar', 'user-events'] })
      toast.success('Événement mis à jour')
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour')
    },
  })
}

// Mutation hook for deleting calendar events
export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => calendarService.deleteCalendarEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar', 'user-events'] })
      toast.success('Événement supprimé')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    },
  })
}
