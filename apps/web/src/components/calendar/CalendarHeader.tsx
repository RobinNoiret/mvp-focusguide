'use client'

import { Button } from '@/components/ui/button'

type ViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'

interface CalendarHeaderProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export function CalendarHeader({ currentView, onViewChange }: CalendarHeaderProps) {
  return (
    <div className="border-b border-border p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-display text-dark">Calendrier</h1>
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
