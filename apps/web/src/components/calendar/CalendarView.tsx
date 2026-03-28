'use client'

import { useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useQueryClient } from '@tanstack/react-query'
import { useCalendarEvents } from '@/hooks/use-calendar-events'
import { useUpdateTask } from '@/hooks/use-today-tasks'
import { CalendarHeader } from './CalendarHeader'
import { toast } from 'sonner'

type ViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'

export function CalendarView() {
  const { data: events, isLoading, error, refetch } = useCalendarEvents()
  const [currentView, setCurrentView] = useState<ViewType>('dayGridMonth')
  const [calendarTitle, setCalendarTitle] = useState<string>('')
  const [weekStart, setWeekStart] = useState<Date | null>(null)
  const [weekEnd, setWeekEnd] = useState<Date | null>(null)
  const calendarRef = useRef<FullCalendar>(null)
  const updateTask = useUpdateTask()
  const queryClient = useQueryClient()

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
      setTimeout(() => updateTitle(view), 0)
    }
  }

  const handleEventDrop = (info: any) => {
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
          // Invalider les caches pour synchroniser partout
          queryClient.invalidateQueries({ queryKey: ['calendar', 'events'] })
          queryClient.invalidateQueries({ queryKey: ['projects'] })
          queryClient.invalidateQueries({ queryKey: ['today', 'tasks'] })
          refetch()
        },
        onError: () => {
          toast.error('Erreur lors de la mise à jour')
          info.revert()
        },
      }
    )
  }

  const handleDateClick = (info: any) => {
    const selectedDate = info.dateStr
    console.log('Date clicked:', selectedDate)
    // Vous pouvez ajouter ici une modal de création de tâche avec la date présélectionnée
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
    <div className="flex h-full flex-col overflow-hidden">
      <CalendarHeader currentView={currentView} onViewChange={handleViewChange} onPrevious={handlePrevious} onNext={handleNext} onToday={handleToday} calendarTitle={calendarTitle} />
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg border border-border">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={currentView}
            events={events || []}
            headerToolbar={{
              left: '',
              center: '',
              right: '',
            }}
            locale="fr"
            datesSet={handleDatesSet}
            height="auto"
            contentHeight="auto"
            editable={true}
            selectable={true}
            selectConstraint="businessHours"
            eventDrop={handleEventDrop}
            dateClick={handleDateClick}
            slotLabelFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
            }}
            eventDisplay="block"
            dayHeaderFormat={{ weekday: 'long', month: 'numeric', day: 'numeric' }}
            eventClick={(info) => {
              console.log('Event clicked:', info.event.title)
            }}
          />
        </div>
      </div>
    </div>
  )
}
