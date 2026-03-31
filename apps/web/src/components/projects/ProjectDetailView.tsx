'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Info, LayoutGrid, BarChart3, RefreshCw, MoreVertical, Trash2 } from 'lucide-react'
import { AxiosError } from 'axios'
import { ProjectKanban } from './ProjectKanban'
import { ProjectSettingsModal } from './ProjectSettingsModal'
import { ProjectDetailSkeleton } from './ProjectDetailSkeleton'
import { DeleteProjectConfirmationDialog } from './DeleteProjectConfirmationDialog'
import { Button } from '@/components/ui/button'
import { useProject, useDeleteProject } from '@/hooks/use-projects'
import { cn } from '@/lib/utils'

interface ProjectDetailViewProps {
  projectId: string
}

export function ProjectDetailView({ projectId }: ProjectDetailViewProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'kanban' | 'gantt'>('kanban')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { data: project, isLoading, isError, error, refetch, isFetching } = useProject(projectId)
  const deleteProject = useDeleteProject()

  const handleDelete = async () => {
    if (!project) return
    try {
      await deleteProject.mutateAsync(project.id)
      setIsDeleteDialogOpen(false)
    } catch {
      // Error handled by React Query
    }
  }

  // Error handling - 404 page
  if (isError) {
    const axiosError = error as AxiosError
    const is404 = axiosError?.response?.status === 404

    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          {is404 ? (
            <>
              <h1 className="mb-4 text-6xl font-bold text-dark">404</h1>
              <p className="mb-6 text-lg text-gray-600">Projet introuvable</p>
            </>
          ) : (
            <>
              <p className="mb-4 text-lg text-gray-600">
                Erreur lors du chargement du projet
              </p>
            </>
          )}
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push('/projets')} variant="outline">
              Retour aux projets
            </Button>
            {!is404 && (
              <Button
                onClick={() => refetch()}
                disabled={isFetching}
                className="bg-chartreuse text-dark hover:bg-chartreuse/90"
              >
                <RefreshCw className={cn('mr-2 h-4 w-4', isFetching && 'animate-spin')} />
                Réessayer
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Loading state - skeleton
  if (isLoading) {
    return <ProjectDetailSkeleton />
  }

  if (!project) return null

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header with title, back arrow, info icon, view toggle */}
      <div className="border-b border-gray-200 px-6 py-6 flex-shrink-0">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Back arrow navigates to /projets */}
            <button
              onClick={() => router.push('/projets')}
              className="rounded-lg p-2 hover:bg-white transition-colors"
              aria-label="Retour aux projets"
            >
              <ArrowLeft className="h-6 w-6 text-dark" />
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-dark truncate max-w-md">
              {project.title}
            </h1>

            {/* Info icon opens settings modal */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="rounded-lg p-2 hover:bg-white transition-colors"
              aria-label="Paramètres du projet"
            >
              <Info className="h-5 w-5 text-gray-600" />
            </button>

            {/* Three-dot menu with delete option */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-lg p-2 hover:bg-white transition-colors"
                aria-label="Menu du projet"
              >
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-md bg-white shadow-lg border border-gray-200">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        setIsDeleteDialogOpen(true)
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer le projet
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Kanban/Gantt toggle */}
          <div className="flex rounded-lg border border-gray-300 bg-white overflow-hidden">
          <button
            onClick={() => setViewMode('kanban')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 transition-colors',
              viewMode === 'kanban'
                ? 'bg-chartreuse text-dark'
                : 'text-gray-600 hover:bg-gray-50'
            )}
            aria-label="Vue Kanban"
          >
            <LayoutGrid className="h-5 w-5" />
            <span className="font-medium">Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('gantt')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 transition-colors',
              viewMode === 'gantt'
                ? 'bg-chartreuse text-dark'
                : 'text-gray-600 hover:bg-gray-50'
            )}
            aria-label="Vue Gantt"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Gantt</span>
          </button>
          </div>
        </div>
      </div>

      {/* Content area with scroll */}
      <div className="flex-1 overflow-auto p-6 flex flex-col">
        {/* Kanban view */}
        {viewMode === 'kanban' && (
          <div className="flex-1 overflow-hidden">
            <ProjectKanban project={project} />
          </div>
        )}

        {/* Gantt view (placeholder for future story) */}
        {viewMode === 'gantt' && (
          <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
            <p className="text-gray-500">A venir</p>
          </div>
        )}
      </div>

      {/* Settings modal */}
      <ProjectSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        project={project}
      />

      {/* Delete confirmation dialog */}
      <DeleteProjectConfirmationDialog
        projectTitle={project.title}
        taskCount={project.taskCount || 0}
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  )
}
