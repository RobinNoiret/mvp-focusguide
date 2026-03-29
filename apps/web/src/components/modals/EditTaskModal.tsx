'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { useUpdateTask } from '@/hooks/use-today-tasks'
import { mergeRefs } from '@/lib/merge-refs'
import type { Task } from '@focus-guide/shared'

interface EditTaskModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  title: string
  notes: string
  deadline?: string
}

export function EditTaskModal({ task, isOpen, onClose }: EditTaskModalProps) {
  const [mounted, setMounted] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const updateTask = useUpdateTask()

  useEffect(() => {
    setMounted(true)
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: task.title,
      notes: task.notes || '',
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
    },
  })

  const title = watch('title')
  const notes = watch('notes')

  useEffect(() => {
    if (isOpen) {
      reset({
        title: task.title,
        notes: task.notes || '',
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
      })
      setTimeout(() => titleRef.current?.focus(), 0)
    }
  }, [isOpen, task, reset])

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
      await updateTask.mutateAsync({
        id: task.id,
        data: {
          title: data.title.trim(),
          notes: data.notes.trim() || null,
          deadline: data.deadline ? `${data.deadline}T00:00:00` : null,
        },
      })
      onClose()
    } catch {
      // Error handled by React Query
    }
  }

  if (!isOpen || !mounted || typeof document === 'undefined') return null

  const portalRoot = document.body
  if (!portalRoot) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="edit-modal-title" className="text-lg font-semibold text-dark">
            Modifier la tâche
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
              htmlFor="edit-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Titre
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
              id="edit-title"
              placeholder="Nom de la tâche..."
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
              htmlFor="edit-notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes{' '}
              <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              {...register('notes', {
                maxLength: {
                  value: 2000,
                  message: 'Maximum 2000 caractères',
                },
              })}
              id="edit-notes"
              placeholder="Ajoutez des détails..."
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

          <div>
            <label
              htmlFor="edit-deadline"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Deadline{' '}
              <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <input
              {...register('deadline')}
              type="date"
              id="edit-deadline"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chartreuse focus:border-transparent disabled:opacity-50"
            />
          </div>

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
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    portalRoot
  )
}
