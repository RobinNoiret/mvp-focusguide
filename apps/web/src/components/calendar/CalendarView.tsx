'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Flag } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useCalendarEventsQuery,
  useUpdateCalendarEvent,
  useDeleteCalendarEvent,
} from '@/hooks/use-calendar-events'
import { useCalendarDeadlines } from '@/hooks/use-calendar-deadlines'
import { useUpdateTask } from '@/hooks/use-today-tasks'
import { userService } from '@/services/user-service'
import { CalendarHeader } from './CalendarHeader'
import { EventModal } from './EventModal'
import { EditTaskModal } from '@/components/modals/EditTaskModal'
import { toast } from 'sonner'
import type { Task } from '@focus-guide/shared'

type ViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'

export function CalendarView() {
  const { data: deadlineEvents, isLoading: deadlinesLoading } = useCalendarDeadlines()
  const { data: userEvents, isLoading: eventsLoading } = useCalendarEventsQuery()
  const [currentView, setCurrentView] = useState<ViewType>('dayGridMonth')
  const [calendarTitle, setCalendarTitle] = useState<string>('')
  const [weekStart, setWeekStart] = useState<Date | null>(null)
  const [weekEnd, setWeekEnd] = useState<Date | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<string>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [firstDay, setFirstDay] = useState<number>(1) // Default to Monday
  const calendarRef = useRef<FullCalendar>(null)
  const updateTask = useUpdateTask()
  const updateCalendarEvent = useUpdateCalendarEvent()
  const queryClient = useQueryClient()

  const isLoading = deadlinesLoading || eventsLoading
  const error = null

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

  const updateTitle = (view?: ViewType) => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi()
      const currentDate = api.getDate()
      const viewToUse = view || currentView

      let title = ''

      if (viewToUse === 'timeGridDay') {
        const options: Intl.DateTimeFormatOptions = {
          day: 'numeric',
          weekday: 'long',
          month: 'long',
          year: 'numeric',
        }
        const formatter = new Intl.DateTimeFormat('fr-FR', options)
        title = formatter.format(currentDate)
      } else if (viewToUse === 'timeGridWeek') {
        // For week view, show the range of dates (Monday to Sunday)
        if (weekStart && weekEnd) {
          // Calculate Sunday (6 days after Monday)
          const displayEnd = new Date(weekStart)
          displayEnd.setDate(displayEnd.getDate() + 6)

          const startFormatter = new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
          })
          const endFormatter = new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })

          title = `${startFormatter.format(weekStart)} - ${endFormatter.format(displayEnd)}`
        }
      } else {
        // Month view
        const options: Intl.DateTimeFormatOptions = {
          month: 'long',
          year: 'numeric',
        }
        const formatter = new Intl.DateTimeFormat('fr-FR', options)
        title = formatter.format(currentDate)
      }

      setCalendarTitle(title.charAt(0).toUpperCase() + title.slice(1))
    }
  }

  const handleDatesSet = (info: any) => {
    setWeekStart(info.start)
    setWeekEnd(info.end)

    // Update title based on current view
    const viewType = info.view.type as ViewType
    const currentDate = info.view.currentStart

    let title = ''

    if (viewType === 'timeGridDay') {
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        weekday: 'long',
        month: 'long',
        year: 'numeric',
      }
      const formatter = new Intl.DateTimeFormat('fr-FR', options)
      title = formatter.format(currentDate)
    } else if (viewType === 'timeGridWeek') {
      // Calculate Sunday (6 days after Monday)
      const displayEnd = new Date(info.start)
      displayEnd.setDate(displayEnd.getDate() + 6)

      const startFormatter = new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
      })
      const endFormatter = new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

      title = `${startFormatter.format(info.start)} - ${endFormatter.format(displayEnd)}`
    } else {
      // Month view
      const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        year: 'numeric',
      }
      const formatter = new Intl.DateTimeFormat('fr-FR', options)
      title = formatter.format(currentDate)
    }

    setCalendarTitle(title.charAt(0).toUpperCase() + title.slice(1))
  }

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.changeView(view)
      // Don't update title here - let datesSet handle it
    }
  }

  // Merge deadline events and user events
  const mergedEvents = useMemo(() => {
    const allEvents = []

    // Add deadline events (draggable but not click-editable, all-day)
    if (deadlineEvents) {
      allEvents.push(
        ...deadlineEvents.map((event) => ({
          ...event,
          allDay: true,
          editable: true,
          extendedProps: {
            type: 'deadline',
            task: event.extendedProps?.task, // Preserve task data
          },
        }))
      )
    }

    // Add user-created events
    if (userEvents) {
      allEvents.push(
        ...userEvents.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.startDate,
          end: event.endDate || undefined,
          allDay: event.isAllDay,
          backgroundColor: '#00FCD9', // Cyan color for user events
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

    // Handle user-created event drag
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

    // Handle task deadline drag
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

  const handleDateClick = (info: any) => {
    // Extract date from dateStr (format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
    const dateStr = info.dateStr.split('T')[0]
    setSelectedDate(dateStr)

    // Extract time if clicking on time grid view
    if (info.dateStr.includes('T')) {
      const timeStr = info.dateStr.split('T')[1]?.substring(0, 5) || ''
      setSelectedTime(timeStr)
    } else {
      setSelectedTime('')
    }

    setModalMode('create')
    setSelectedEvent(null)
    setModalOpen(true)
  }

  const handleEventClick = (info: any) => {
    const eventType = info.event.extendedProps?.type

    // Handle deadline (task) click
    if (eventType === 'deadline') {
      const taskData = info.event.extendedProps?.task
      if (taskData) {
        setEditingTask(taskData as Task)
        setTaskModalOpen(true)
      }
      return
    }

    // Handle user-created event click
    const event = userEvents?.find((e) => e.id === info.event.id)
    if (event) {
      setSelectedEvent(event)
      setModalMode('edit')
      setModalOpen(true)
    }
  }

  const handleEventResize = (info: any) => {
    const eventType = info.event.extendedProps?.type

    // Handle user-created event resize
    if (eventType === 'event') {
      const newStart = info.event.start
      const newEnd = info.event.end

      if (!newStart) {
        toast.error('Impossible de mettre à jour la date')
        info.revert()
        return
      }

      const isoStart = newStart.toISOString()
      const isoEnd = newEnd ? new Date(newEnd).toISOString() : null

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

    // Deadlines cannot be resized
    if (eventType === 'deadline') {
      info.revert()
      toast.error('Impossible de modifier la durée d\'une deadline')
      return
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement du calendrier...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Erreur lors du chargement du calendrier</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-chartreuse hover:underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  const handlePrevious = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev()
    }
  }

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next()
    }
  }

  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today()
    }
  }

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden">
        <CalendarHeader currentView={currentView} onViewChange={handleViewChange} onPrevious={handlePrevious} onNext={handleNext} onToday={handleToday} calendarTitle={calendarTitle} />
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg border border-border">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={currentView}
              events={mergedEvents}
              headerToolbar={{
                left: '',
                center: '',
                right: '',
              }}
              locale="fr"
              firstDay={firstDay}
              datesSet={handleDatesSet}
              height="auto"
              contentHeight="auto"
              editable={true}
              selectable={true}
              selectConstraint="businessHours"
              eventDrop={handleEventDrop}
              eventResize={handleEventResize}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              slotLabelFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short',
              }}
              eventDisplay="block"
              dayHeaderFormat={
                currentView === 'dayGridMonth'
                  ? { weekday: 'short' }
                  : { weekday: 'long', month: 'numeric', day: 'numeric' }
              }
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
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedDate(undefined)
          setSelectedTime(undefined)
        }}
        mode={modalMode}
        initialDate={selectedDate}
        initialTime={selectedTime}
        event={selectedEvent}
      />

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={taskModalOpen}
          onClose={() => {
            setTaskModalOpen(false)
            setEditingTask(null)
          }}
        />
      )}
    </>
  )
}
