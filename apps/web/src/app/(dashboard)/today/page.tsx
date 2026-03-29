'use client'

import { useEffect, useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Flag } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useCalendarEventsQuery,
  useUpdateCalendarEvent,
} from '@/hooks/use-calendar-events'
import { useCalendarDeadlines } from '@/hooks/use-calendar-deadlines'
import { useTodayTasks, useUpdateTask } from '@/hooks/use-today-tasks'
import { userService } from '@/services/user-service'
import { TaskCard } from '@/components/kanban/TaskCard'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { data: deadlineEvents } = useCalendarDeadlines()
  const { data: userEvents } = useCalendarEventsQuery()
  const { data: tasks } = useTodayTasks()
  const [firstDay, setFirstDay] = useState<number>(1) // Default to Monday
  const updateTask = useUpdateTask()
  const updateCalendarEvent = useUpdateCalendarEvent()
  const queryClient = useQueryClient()

  // Fetch user calendar settings on mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const user = await userService.getMe()
        if (user.calendar_settings?.weekStartDay !== undefined) {
          setFirstDay(user.calendar_settings.weekStartDay)
        }
      } catch (err) {
        console.error('Failed to fetch user settings:', err)
      }
    }
    fetchUserSettings()
  }, [])

  // Get only "À faire aujourd'hui" tasks
  const todayTasks = tasks?.filter((t) => t.todayStatus === 'todo') || []

  // Merge calendar events
  const mergedEvents = useMemo(() => {
    const allEvents = []

    if (deadlineEvents) {
      allEvents.push(
        ...deadlineEvents.map((event) => ({
          ...event,
          allDay: true,
          editable: true,
          extendedProps: {
            type: 'deadline',
            task: event.extendedProps?.task,
          },
        }))
      )
    }

    if (userEvents) {
      allEvents.push(
        ...userEvents.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.startDate,
          end: event.endDate || undefined,
          allDay: event.isAllDay,
          backgroundColor: '#00FCD9',
          textColor: '#0a0a0a',
          editable: true,
          extendedProps: { type: 'event' },
        }))
      )
    }

    return allEvents
  }, [deadlineEvents, userEvents])

  const handleEventDrop = (info: any) => {
    const eventType = info.event.extendedProps?.type

    if (eventType === 'event') {
      const newStart = info.event.start
      if (!newStart) {
        toast.error('Impossible de mettre à jour la date')
        info.revert()
        return
      }

      const isoStart = newStart.toISOString()
      const isoEnd = info.event.end ? new Date(info.event.end).toISOString() : null

      updateCalendarEvent.mutate(
        {
          id: info.event.id,
          data: {
            startDate: isoStart,
            endDate: isoEnd,
          },
        },
        {
          onError: () => {
            toast.error('Erreur lors de la mise à jour')
            info.revert()
          },
        }
      )
      return
    }

    const taskId = info.event.id
    const newStart = info.event.start

    if (!newStart) {
      toast.error('Impossible de mettre à jour la date')
      info.revert()
      return
    }

    updateTask.mutate(
      {
        id: taskId,
        data: {
          deadline: newStart.toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast.success('Deadline mise à jour')
          queryClient.invalidateQueries({ queryKey: ['calendar', 'events'] })
          queryClient.invalidateQueries({ queryKey: ['projects'] })
          queryClient.invalidateQueries({ queryKey: ['today', 'tasks'] })
        },
        onError: () => {
          toast.error('Erreur lors de la mise à jour')
          info.revert()
        },
      }
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50">
      <div className="border-b border-gray-200 p-6 bg-white">
        <h1 className="text-3xl font-bold font-display text-dark">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue d'ensemble de votre semaine et tâches du jour
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-3 gap-6 p-6 h-full">
          {/* Calendar - 2 columns */}
          <div className="col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            {/* Calendar content */}
            <div className="flex-1 overflow-auto">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={mergedEvents}
                headerToolbar={{
                  left: '',
                  center: '',
                  right: '',
                }}
                locale="fr"
                firstDay={firstDay}
                height="100%"
                contentHeight="auto"
                editable={true}
                eventDrop={handleEventDrop}
                slotLabelFormat={{
                  hour: 'numeric',
                  minute: '2-digit',
                  meridiem: 'short',
                }}
                eventDisplay="block"
                dayHeaderFormat={{ weekday: 'short', month: 'numeric', day: 'numeric' }}
                eventContent={(info) => {
                  const eventType = info.event.extendedProps?.type
                  if (eventType === 'deadline') {
                    return (
                      <div className="flex items-center gap-1 text-xs font-medium px-1">
                        <Flag size={12} />
                        <span>{info.event.title}</span>
                      </div>
                    )
                  }
                  return <span className="text-xs font-medium px-1">{info.event.title}</span>
                }}
              />
            </div>
          </div>

          {/* À faire aujourd'hui - 1 column */}
          <div className="col-span-1 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <h2 className="font-semibold text-dark">À faire aujourd'hui</h2>
              <p className="text-xs text-gray-500 mt-1">{todayTasks.length} tâche(s)</p>
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-2">
              {todayTasks.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">
                  Aucune tâche pour aujourd'hui
                </p>
              ) : (
                todayTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
