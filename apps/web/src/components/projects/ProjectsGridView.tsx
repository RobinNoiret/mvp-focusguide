'use client'

import { useState } from 'react'
import { Plus, FolderOpen, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTranslation } from '@/hooks/use-translation'
import { ProjectCard } from './ProjectCard'
import { ProjectCardSkeleton } from './ProjectCardSkeleton'
import { CreateProjectModal } from './CreateProjectModal'
import { EditProjectModal } from './EditProjectModal'
import { useProjects } from '@/hooks/use-projects'
import type { Project } from '@focus-guide/shared'

export function ProjectsGridView() {
  const { t } = useTranslation()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const { data: projects, isLoading, isError, refetch, isFetching } = useProjects()

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-display text-dark">{t.projects.title}</h1>

        {/* Create project button */}
        <Button
          className="bg-chartreuse text-dark hover:bg-chartreuse/90"
          onClick={() => setIsCreateModalOpen(true)}
          data-tour="btn-create-project"
        >
          <Plus className="mr-2 h-5 w-5" />
          {t.projects.newProject}
        </Button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto p-6">
        {/* Loading state */}
        {isLoading && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

      {/* Error state */}
      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="mb-4 text-lg text-gray-600">
            {t.today.loadFailed}
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isFetching}
          >
            <RefreshCw className={cn('mr-2 h-4 w-4', isFetching && 'animate-spin')} />
            {t.common.retry}
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && projects?.length === 0 && (
        <EmptyState
          icon={<FolderOpen className="h-16 w-16" />}
          title={t.projects.empty}
          description={t.projects.createModal.submit}
          action={{
            label: t.projects.createModal.submit,
            onClick: () => setIsCreateModalOpen(true),
          }}
          className="py-16"
        />
      )}

      {/* Projects grid */}
      {!isLoading && !isError && projects && projects.length > 0 && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" data-tour="projects-grid">
          {projects.map((project) => (
            <div key={project.id} data-tour={project === projects[0] ? 'project-card' : undefined}>
              <ProjectCard
                project={project}
                onEdit={() => setEditingProject(project)}
              />
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Create project modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit project modal */}
      <EditProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        project={editingProject}
      />
    </div>
  )
}
