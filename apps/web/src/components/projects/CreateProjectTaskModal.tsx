'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { mergeRefs } from '@/lib/merge-refs'
import type { TaskStatus } from '@focus-guide/shared'

interface CreateProjectTaskModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectStatus: TaskStatus
  onSubmit: (data: {
    title: string
    notes?: string
    projectId: string
    projectStatus: TaskStatus
    todayStatus: null
    deadline?: string | null
  }) => Promise<void>
}

interface FormData {
  title: string
  notes: string
  deadline: string
}

const columnTitles: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminé',
}

export function CreateProjectTaskModal({
  isOpen,
  onClose,
  projectId,
  projectStatus,
  onSubmit,
}: CreateProjectTaskModalProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { title: '', notes: '', deadline: '' },
  })

  const title = watch('title')
  const notes = watch('notes')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      reset({ title: '', notes: '', deadline: '' })
      setTimeout(() => titleRef.current?.focus(), 0)
    }
  }, [isOpen, reset])

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

  const onSubmitForm = async (data: FormData) => {
    try {
      await onSubmit({
        title: data.title.trim(),
        notes: data.notes.trim() || undefined,
        projectId,
        projectStatus,
        todayStatus: null,
        deadline: data.deadline || null,
      })
      reset()
      onClose()
    } catch {
      // Error handled by caller
    }
  }

  if (!isOpen || !mounted || typeof document === 'undefined') return null

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-task-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 id="create-task-modal-title" className="text-xl font-semibold text-dark">
              Nouvelle tâche
            </h2>
            <p className="text-sm text-gray-600">
              Sera ajoutée à la colonne: <strong>{columnTitles[projectStatus]}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title', {
                required: 'Le titre est requis',
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
              id="task-title"
              placeholder="Nom de la tâche..."
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

          {/* Notes */}
          <div>
            <label
              htmlFor="task-notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              {...register('notes', {
                maxLength: {
                  value: 1000,
                  message: 'Maximum 1000 caractères',
                },
              })}
              id="task-notes"
              placeholder="Détails de la tâche..."
              rows={4}
              maxLength={1000}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chartreuse focus:border-transparent disabled:opacity-50 resize-none"
            />
            <div className="flex justify-between mt-1">
              {errors.notes && (
                <span className="text-sm text-red-500">{errors.notes.message}</span>
              )}
              <span className="text-xs text-gray-400 ml-auto">{notes.length}/1000</span>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label
              htmlFor="task-deadline"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Échéance <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <input
              {...register('deadline')}
              type="date"
              id="task-deadline"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chartreuse focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
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
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-2 text-sm font-medium text-dark bg-chartreuse rounded-md hover:bg-chartreuse/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Création...' : 'Créer la tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
