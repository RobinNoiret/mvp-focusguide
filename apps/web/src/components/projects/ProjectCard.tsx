'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreVertical, Calendar, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import { useDeleteProject } from '@/hooks/use-projects'
import { DeleteProjectConfirmationDialog } from './DeleteProjectConfirmationDialog'
import type { ProjectWithStats } from '@/services/project-service'

interface ProjectCardProps {
  project: ProjectWithStats
  onEdit?: () => void
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const deleteProject = useDeleteProject()

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-menu-trigger]')) {
      return
    }
    router.push(`/projets/${project.id}`)
  }

  const handleDelete = async () => {
    try {
      await deleteProject.mutateAsync(project.id)
      setIsDeleteDialogOpen(false)
    } catch {
      // Error handled by React Query
    }
  }

  const getProgressBarColor = (percentage: number) => {
    if (percentage === 0) return 'bg-gray-300'
    if (percentage < 30) return 'bg-red-400'
    if (percentage < 70) return 'bg-yellow-400'
    if (percentage < 100) return 'bg-cyan-400'
    return 'bg-emerald-400'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col min-h-[280px]"
        data-testid="project-card"
      >
        {/* Header / Info section */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-dark truncate">
              {project.title}
            </h3>

            {/* Description */}
            {project.description && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{project.description}</p>
            )}
          </div>

        {/* Menu */}
        <div className="relative flex-shrink-0 ml-2" data-menu-trigger>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMenuOpen(!isMenuOpen)
              }}
              className="rounded p-1.5 hover:bg-gray-100 transition-colors"
              aria-label="Menu du projet"
            >
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMenuOpen(false)
                  }}
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-36 rounded-md bg-white shadow-lg border border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsMenuOpen(false)
                      onEdit?.()
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil className="h-4 w-4" />
                    {t.projects.edit}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsMenuOpen(false)
                      setIsDeleteDialogOpen(true)
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t.projects.delete}
                  </button>
                </div>
              </>
            )}
        </div>
        </div>

        {/* Metadata - pushed to bottom */}
        <div className="flex-1 mt-4 flex flex-col justify-end gap-3">
            {/* Deadline */}
            <div className="min-h-[24px]">
              {project.deadline && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{t.common.deadline}: {formatDate(project.deadline)}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="min-h-[32px]">
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Task count and Progress */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {project.taskCounts?.done || 0}/{project.taskCount || 0} {t.projects.tasksCount}
              </p>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={cn(
                      'h-full transition-all duration-300',
                      getProgressBarColor(project.completionPercentage || 0)
                    )}
                    style={{ width: `${project.completionPercentage || 0}%` }}
                  />
                </div>
                <p className="text-right text-xs text-gray-500">
                  {project.completionPercentage || 0}%
                </p>
              </div>
            </div>
        </div>
      </div>

      <DeleteProjectConfirmationDialog
        projectTitle={project.title}
        taskCount={project.taskCount || 0}
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </>
  )
}
