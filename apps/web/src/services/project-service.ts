import apiClient from '@/lib/api-client'
import type { Project, CreateProjectInput, UpdateProjectInput, Task } from '@focus-guide/shared'

export interface ProjectWithStats extends Project {
  taskCount: number
  completionPercentage: number
  taskCounts: {
    backlog: number
    todo: number
    inProgress: number
    done: number
  }
  tasks?: Task[]
}

class ProjectService {
  async getAllProjects(): Promise<ProjectWithStats[]> {
    const response = await apiClient.get<ProjectWithStats[]>('/projects')
    return response.data
  }

  async getProject(id: string): Promise<ProjectWithStats> {
    const response = await apiClient.get<ProjectWithStats>(`/projects/${id}`)
    return response.data
  }

  async createProject(input: CreateProjectInput): Promise<ProjectWithStats> {
    const response = await apiClient.post<ProjectWithStats>('/projects', input)
    return response.data
  }

  async updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
    const response = await apiClient.patch<Project>(`/projects/${id}`, input)
    return response.data
  }

  async deleteProject(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`)
  }
}

export const projectService = new ProjectService()
