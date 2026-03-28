'use client'

import { useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarApi } from '@fullcalendar/core'
import { useCalendarEvents } from '@/hooks/use-calendar-events'
import { CalendarHeader } from './CalendarHeader'

type ViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'

export function CalendarView() {
  const { data: events, isLoading, error } = useCalendarEvents()
  const [currentView, setCurrentView] = useState<ViewType>('dayGridMonth')
  const calendarRef = useRef<FullCalendar>(null)

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.changeView(view)
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

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CalendarHeader currentView={currentView} onViewChange={handleViewChange} />
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg border border-border">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={currentView}
            events={events || []}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: '',
            }}
            locale="fr"
            height="auto"
            contentHeight="auto"
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
