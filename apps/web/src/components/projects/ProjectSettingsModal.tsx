'use client'
import { useTranslation } from '@/hooks/use-translation'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { TagInput } from '@/components/ui/TagInput'
import { useUpdateProject } from '@/hooks/use-projects'
import { mergeRefs } from '@/lib/merge-refs'
import { useTranslation } from '@/hooks/use-translation'
import type { ProjectWithStats } from '@/services/project-service'

interface ProjectSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  project: ProjectWithStats
}

interface FormData {
  title: string
  description: string
  deadline: string
}

export function ProjectSettingsModal({
  isOpen,
  onClose,
  project,
}: ProjectSettingsModalProps) {
  const { t } = useTranslation()
  const titleRef = useRef<HTMLInputElement>(null)
  const updateProject = useUpdateProject()
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

  // Pre-fill form when project changes
  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description || '',
        deadline: project.deadline ? project.deadline.split('T')[0] : '',
      })
      setTags(project.tags || [])
    }
  }, [project, reset])

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
      await updateProject.mutateAsync({
        id: project.id,
        data: {
          title: data.title.trim(),
          description: data.description.trim() || null,
          deadline: data.deadline || null,
          tags: tags,
        },
      })
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
      aria-labelledby="settings-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 id="settings-modal-title" className="text-xl font-semibold text-dark">
            {t.projects.settings.title}
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
          {/* Project Statistics */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 font-semibold text-dark">{t.projects.settings.statistics}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">{t.projects.settings.totalTasks}</p>
                <p className="text-2xl font-bold text-dark">{project.taskCount || 0}</p>
              </div>
              <div>
                <p className="text-gray-600">{t.projects.settings.progress}</p>
                <p className="text-2xl font-bold text-dark">
                  {project.completionPercentage || 0}%
                </p>
              </div>
              <div>
                <p className="text-gray-600">{t.projects.settings.completed}</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {project.taskCounts?.done || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-600">{t.projects.settings.inProgress}</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {project.taskCounts?.inProgress || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="settings-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.projects.editModal.name} <span className="text-red-500">*</span>
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
              id="settings-title"
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
              htmlFor="settings-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.projects.editModal.description} <span className="text-gray-400 font-normal">({t.common.optional})</span>
            </label>
            <textarea
              {...register('description', {
                maxLength: {
                  value: 2000,
                  message: t.common.validation.maxLength,
                },
              })}
              id="settings-description"
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
              htmlFor="settings-deadline"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.common.deadline} <span className="text-gray-400 font-normal">({t.common.optional})</span>
            </label>
            <input
              {...register('deadline')}
              type="date"
              id="settings-deadline"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chartreuse focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.common.tags} <span className="text-gray-400 font-normal">({t.common.optional})</span>
            </label>
            <TagInput
              tags={tags}
              onTagsChange={setTags}
              placeholder={t.common.addTagPlaceholder}
              maxTags={10}
              disabled={isSubmitting}
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
              {isSubmitting ? t.common.saving : t.common.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
