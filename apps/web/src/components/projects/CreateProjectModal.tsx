'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { TagInput } from '@/components/ui/TagInput'
import { useCreateProject } from '@/hooks/use-projects'
import { mergeRefs } from '@/lib/merge-refs'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  title: string
  description: string
  deadline: string
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const createProject = useCreateProject()
  const [tags, setTags] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { title: '', description: '', deadline: '' },
  })

  const title = watch('title')
  const description = watch('description')

  useEffect(() => {
    setMounted(true)
  }, [])

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
      await createProject.mutateAsync({
        title: data.title.trim(),
        description: data.description.trim() || undefined,
        deadline: data.deadline || undefined,
        tags: tags.length > 0 ? tags : undefined,
      })
      reset()
      setTags([])
      onClose()
    } catch {
      // Error handled by React Query
    }
  }

  if (!isOpen || !mounted || typeof document === 'undefined') return null

  const modalContent = (
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

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 id="modal-title" className="text-xl font-semibold text-dark">
            Créer un projet
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
          {/* Title */}
          <div>
            <label
              htmlFor="title"
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
              id="title"
              placeholder="Nom du projet..."
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

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              {...register('description', {
                maxLength: {
                  value: 2000,
                  message: 'Maximum 2000 caractères',
                },
              })}
              id="description"
              placeholder="Décrivez votre projet..."
              rows={4}
              maxLength={2000}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chartreuse focus:border-transparent disabled:opacity-50 resize-none"
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <span className="text-sm text-red-500">{errors.description.message}</span>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {description.length}/2000
              </span>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Échéance <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <input
              {...register('deadline')}
              type="date"
              id="deadline"
              min={new Date().toISOString().split('T')[0]}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chartreuse focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <TagInput
              tags={tags}
              onTagsChange={setTags}
              placeholder="Ajouter un tag (max 10)"
              maxTags={10}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Séparez les tags par virgule ou Entrée
            </p>
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
              {isSubmitting ? 'Création...' : 'Créer le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
