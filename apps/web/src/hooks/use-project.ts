import { useQuery } from '@tanstack/react-query'
import { projectService, ProjectWithStats } from '@/services/project-service'

export function useProject(projectId: string) {
  return useQuery<ProjectWithStats>({
    queryKey: ['projects', projectId],
    queryFn: () => projectService.getProject(projectId),
    enabled: !!projectId, // Only fetch if projectId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    // AC 10, 11: React Query caching for smooth transitions
  })
}
