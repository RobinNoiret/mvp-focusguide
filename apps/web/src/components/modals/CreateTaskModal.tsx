'use client'

import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { useCreateTask } from '@/hooks/use-today-tasks'
import { mergeRefs } from '@/lib/merge-refs'
import type { TaskStatus } from '@focus-guide/shared'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  columnStatus: TaskStatus
}

interface FormData {
  title: string
  notes: string
}

export function CreateTaskModal({
  isOpen,
  onClose,
  columnStatus,
}: CreateTaskModalProps) {
  const { t } = useTranslation()
  const titleRef = useRef<HTMLInputElement>(null)
  const createTask = useCreateTask()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { title: '', notes: '' },
  })

  const title = watch('title')
  const notes = watch('notes')

  useEffect(() => {
    if (isOpen) {
      titleRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, isSubmitting, onClose])

  const onSubmit = async (data: FormData) => {
    try {
      await createTask.mutateAsync({
        title: data.title.trim(),
        notes: data.notes.trim() || undefined,
        todayStatus: columnStatus,
      })
      reset()
      onClose()
    } catch {
      // Error handled by React Query
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="modal-title" className="text-lg font-semibold text-dark">
            {t.modals.task.create.title}
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
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.modals.task.create.titleField}
            </label>
            <input
              {...register('title', {
                required: t.modals.task.create.validation,
                maxLength: {
                  value: 200,
                  message: 'Maximum 200 caractères',
                },
              })}
              ref={mergeRefs(
                register('title').ref,
                titleRef
              )}
              type="text"
              id="title"
              placeholder={t.modals.task.create.titlePlaceholder}
              maxLength={200}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chartreuse focus:border-transparent disabled:opacity-50"
            />
            <div className="flex justify-between mt-1">
              {errors.title && (
                <span className="text-sm text-red-500">
                  {errors.title.message}
                </span>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {title.length}/200
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.modals.task.create.titleField}{' '}
              <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              {...register('notes', {
                maxLength: {
                  value: 2000,
                  message: 'Maximum 2000 caractères',
                },
              })}
              id="notes"
              placeholder={t.modals.task.create.titlePlaceholder}
              rows={4}
              maxLength={2000}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chartreuse focus:border-transparent disabled:opacity-50 resize-none"
            />
            <div className="flex justify-between mt-1">
              {errors.notes && (
                <span className="text-sm text-red-500">
                  {errors.notes.message}
                </span>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {notes.length}/2000
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-2 text-sm font-medium text-dark bg-chartreuse rounded-md hover:bg-chartreuse/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t.common.saving : t.modals.task.create.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
