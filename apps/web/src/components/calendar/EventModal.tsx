'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Trash2 } from 'lucide-react'
import {
  useCreateCalendarEvent,
  useUpdateCalendarEvent,
  useDeleteCalendarEvent,
  type CalendarEventItem,
} from '@/hooks/use-calendar-events'
import { mergeRefs } from '@/lib/merge-refs'

const eventSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  date: z.string().min(1, 'La date est requise'),
  startTime: z.string().optional().default(''),
  endTime: z.string().optional().default(''),
  isAllDay: z.boolean().default(true),
})

type FormData = z.infer<typeof eventSchema>

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialDate?: string
  initialTime?: string
  event?: CalendarEventItem
}

export function EventModal({
  isOpen,
  onClose,
  mode,
  initialDate,
  initialTime,
  event,
}: EventModalProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)
  const createEvent = useCreateCalendarEvent()
  const updateEvent = useUpdateCalendarEvent()
  const deleteEvent = useDeleteCalendarEvent()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      date: initialDate || '',
      startTime: initialTime || '',
      endTime: '',
      isAllDay: !initialTime, // If initialTime is provided, it's not all day
    },
  })

  const title = watch('title')
  const isAllDay = watch('isAllDay')

  // Initialize form with existing event data in edit mode, or with selected date/time in create mode
  useEffect(() => {
    if (mode === 'edit' && event) {
      const startDate = event.startDate.split('T')[0]
      const startTime = event.startDate.split('T')[1]?.substring(0, 5) || ''
      const endTime = event.endDate ? event.endDate.split('T')[1]?.substring(0, 5) || '' : ''

      setValue('title', event.title)
      setValue('date', startDate)
      setValue('startTime', startTime)
      setValue('endTime', endTime)
      setValue('isAllDay', event.isAllDay)
    } else if (mode === 'create' && initialDate) {
      // Reset and set initial date/time from calendar click
      setValue('date', initialDate)
      if (initialTime) {
        setValue('startTime', initialTime)
        setValue('isAllDay', false)
      } else {
        setValue('isAllDay', true)
      }
    }
  }, [mode, event, initialDate, initialTime, setValue])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && mounted) {
      titleRef.current?.focus()
    }
  }, [isOpen, mounted])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }
    if (isOpen && mounted) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, isSubmitting, onClose, mounted])

  const onSubmit = async (data: FormData) => {
    try {
      const baseDateTime = `${data.date}T00:00:00`

      let startDateTime: string
      let endDateTime: string | null = null

      if (data.isAllDay) {
        startDateTime = baseDateTime
        endDateTime = null
      } else {
        const startTime = data.startTime || '00:00'
        startDateTime = `${data.date}T${startTime}:00`

        // Calculer endTime: 1h après startTime si pas spécifié
        let endTime = data.endTime
        if (!endTime) {
          const [hours, minutes] = startTime.split(':')
          const hour = parseInt(hours, 10)
          const nextHour = (hour + 1) % 24
          endTime = `${String(nextHour).padStart(2, '0')}:${minutes}`
        }
        endDateTime = `${data.date}T${endTime}:00`
      }

      if (mode === 'create') {
        await createEvent.mutateAsync({
          title: data.title.trim(),
          startDate: startDateTime,
          endDate: endDateTime,
          isAllDay: data.isAllDay,
        })
      } else if (mode === 'edit' && event) {
        await updateEvent.mutateAsync({
          id: event.id,
          data: {
            title: data.title.trim(),
            startDate: startDateTime,
            endDate: endDateTime,
            isAllDay: data.isAllDay,
          },
        })
      }

      reset()
      onClose()
    } catch {
      // Error handled by React Query
    }
  }

  const handleDelete = async () => {
    if (!event) return
    try {
      await deleteEvent.mutateAsync(event.id)
      onClose()
    } catch {
      // Error handled by React Query
    }
  }

  if (!mounted || !isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="event-modal-title" className="text-lg font-semibold text-dark">
            {mode === 'create' ? 'Nouvel événement' : 'Modifier l\'événement'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <input
              {...register('title')}
              ref={mergeRefs(register('title').ref, titleRef)}
              type="text"
              id="title"
              placeholder="Nom de l'événement..."
              maxLength={200}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chartreuse focus:border-transparent disabled:opacity-50"
            />
            <div className="flex justify-between mt-1">
              {errors.title && (
                <span className="text-sm text-red-500">{errors.title.message}</span>
              )}
              <span className="text-xs text-gray-400 ml-auto">{title.length}/200</span>
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              {...register('date')}
              type="date"
              id="date"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chartreuse focus:border-transparent disabled:opacity-50"
            />
            {errors.date && (
              <span className="text-sm text-red-500 mt-1">{errors.date.message}</span>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                {...register('isAllDay')}
                type="checkbox"
                disabled={isSubmitting}
                className="w-4 h-4 text-chartreuse rounded focus:ring-2 focus:ring-chartreuse disabled:opacity-50"
              />
              <span className="text-sm font-medium text-gray-700">Événement toute la journée</span>
            </label>
          </div>

          {!isAllDay && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de début
                  </label>
                  <input
                    {...register('startTime')}
                    type="time"
                    id="startTime"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chartreuse focus:border-transparent disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de fin
                  </label>
                  <input
                    {...register('endTime')}
                    type="time"
                    id="endTime"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chartreuse focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-2">
            {mode === 'edit' && event && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting || deleteEvent.isPending}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Supprimer
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || createEvent.isPending || updateEvent.isPending}
              className="px-4 py-2 text-sm font-medium text-dark bg-chartreuse rounded-md hover:bg-chartreuse/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? mode === 'create'
                  ? 'Création...'
                  : 'Mise à jour...'
                : mode === 'create'
                  ? 'Créer'
                  : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
