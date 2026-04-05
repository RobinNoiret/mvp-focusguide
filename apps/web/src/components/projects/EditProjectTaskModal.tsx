'use client'
import { useTranslation } from '@/hooks/use-translation'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { mergeRefs } from '@/lib/merge-refs'
import { useTranslation } from '@/hooks/use-translation'
import type { Task, UpdateTaskInput } from '@focus-guide/shared'

interface EditProjectTaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  onSubmit: (id: string, data: UpdateTaskInput) => Promise<void>
}

interface FormData {
  title: string
  notes: string
  deadline: string
}

export function EditProjectTaskModal({
  isOpen,
  onClose,
  task,
  onSubmit,
}: EditProjectTaskModalProps) {
  const { t } = useTranslation()
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

  // Pre-fill form when task changes
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        notes: task.notes || '',
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
      })
    }
  }, [task, reset])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleRef.current?.focus(), 0)
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

  const onSubmitForm = async (data: FormData) => {
    if (!task) return

    try {
      await onSubmit(task.id, {
        title: data.title.trim(),
        notes: data.notes.trim() || null,
        deadline: data.deadline || null,
      })
      onClose()
    } catch {
      // Error handled by caller
    }
  }

  if (!isOpen || !mounted || typeof document === 'undefined' || !task) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="edit-task-modal-title" className="text-xl font-semibold text-dark">
            {t.modals.projectTask.edit.title}
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

        <form onSubmit={handleSubmit(onSubmitForm)} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="edit-task-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.modals.projectTask.edit.titleField} <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title', {
                required: t.common.validation.required,
                maxLength: {
                  value: 200,
                  message: t.common.validation.maxLength,
                },
              })}
              ref={mergeRefs(
                register('title').ref,
                titleRef
              )}
              type="text"
              id="edit-task-title"
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
              htmlFor="edit-task-notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.common.notes} <span className="text-gray-400 font-normal">({t.common.optional})</span>
            </label>
            <textarea
              {...register('notes', {
                maxLength: {
                  value: 1000,
                  message: t.common.validation.maxLength,
                },
              })}
              id="edit-task-notes"
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
              htmlFor="edit-task-deadline"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.common.deadline} <span className="text-gray-400 font-normal">({t.common.optional})</span>
            </label>
            <input
              {...register('deadline')}
              type="date"
              id="edit-task-deadline"
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
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-2 text-sm font-medium text-dark bg-chartreuse rounded-md hover:bg-chartreuse/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t.common.saving : t.modals.projectTask.edit.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
