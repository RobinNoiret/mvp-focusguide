import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { projectService, ProjectWithStats } from '@/services/project-service'
import type { CreateProjectInput, UpdateProjectInput, Task } from '@focus-guide/shared'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAllProjects(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectService.getProject(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectService.createProject(input),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Projet créé')
    },

    onError: () => {
      toast.error('Impossible de créer le projet', {
        description: 'Veuillez réessayer.',
      })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectInput }) =>
      projectService.updateProject(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Projet modifié')
    },

    onError: () => {
      toast.error('Impossible de modifier le projet', {
        description: 'Veuillez réessayer.',
      })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),

    // AC 6, 8: Optimistic delete
    onMutate: async (id) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['projects'] })
      await queryClient.cancelQueries({ queryKey: ['projects', id] })
      await queryClient.cancelQueries({ queryKey: ['today', 'tasks'] })

      // Snapshot previous values
      const previousProjects = queryClient.getQueryData<ProjectWithStats[]>(['projects'])
      const previousProject = queryClient.getQueryData<ProjectWithStats>(['projects', id])
      const previousTodayTasks = queryClient.getQueryData<Task[]>(['today', 'tasks'])

      // AC 6: Optimistically remove project from grid
      queryClient.setQueryData<ProjectWithStats[]>(['projects'], (old) =>
        old?.filter((project) => project.id !== id)
      )

      // AC 5: Optimistically remove tasks from Today (cascade)
      queryClient.setQueryData<Task[]>(['today', 'tasks'], (old) => {
        if (!old) return old
        // Remove tasks that belong to deleted project
        return old.filter((task) => task.projectId !== id)
      })

      return { previousProjects, previousProject, previousTodayTasks }
    },

    // AC 8: Rollback on error
    onError: (_err, id, context) => {
      // Restore previous state
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects)
      }
      if (context?.previousProject) {
        queryClient.setQueryData(['projects', id], context.previousProject)
      }
      if (context?.previousTodayTasks) {
        queryClient.setQueryData(['today', 'tasks'], context.previousTodayTasks)
      }

      toast.error('Impossible de supprimer le projet', {
        description: 'Veuillez réessayer.',
      })
    },

    // AC 7, 9: Navigate and invalidate caches
    onSuccess: (_, id) => {
      // AC 9: Invalidate both projects and today caches
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['today', 'tasks'] })

      // AC 7: If on detail page, navigate to projects grid
      if (typeof window !== 'undefined' && window.location.pathname.includes(`/projets/${id}`)) {
        router.push('/projets')
      }

      toast.success('Projet supprimé')
    },
  })
}
