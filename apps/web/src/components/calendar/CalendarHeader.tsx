'use client'

import { Button } from '@/components/ui/button'

import { ChevronLeft, ChevronRight } from 'lucide-react'

type ViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'

interface CalendarHeaderProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  calendarTitle: string
}

export function CalendarHeader({ currentView, onViewChange, onPrevious, onNext, onToday, calendarTitle }: CalendarHeaderProps) {
  return (
    <div className="border-b border-border p-6 space-y-4">
      <h1 className="text-3xl font-bold font-display text-dark">Calendrier</h1>
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            className="text-dark hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={onToday}
            className="text-dark hover:bg-gray-100 px-4"
          >
            Aujourd'hui
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            className="text-dark hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-2xl font-bold font-display text-dark flex-1 text-center">{calendarTitle}</h2>
        <div className="flex gap-2">
          <Button
            variant={currentView === 'timeGridDay' ? 'default' : 'outline'}
            onClick={() => onViewChange('timeGridDay')}
            className={currentView === 'timeGridDay' ? 'bg-chartreuse text-dark hover:bg-chartreuse/90' : ''}
          >
            Jour
          </Button>
          <Button
            variant={currentView === 'timeGridWeek' ? 'default' : 'outline'}
            onClick={() => onViewChange('timeGridWeek')}
            className={currentView === 'timeGridWeek' ? 'bg-chartreuse text-dark hover:bg-chartreuse/90' : ''}
          >
            Semaine
          </Button>
          <Button
            variant={currentView === 'dayGridMonth' ? 'default' : 'outline'}
            onClick={() => onViewChange('dayGridMonth')}
            className={currentView === 'dayGridMonth' ? 'bg-chartreuse text-dark hover:bg-chartreuse/90' : ''}
          >
            Mois
          </Button>
        </div>
      </div>
    </div>
  )
}
