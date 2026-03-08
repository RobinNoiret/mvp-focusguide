import apiClient from '@/lib/api-client'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@focus-guide/shared'

class TaskService {
  async createTask(input: CreateTaskInput): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', input)
    return response.data
  }

  async getTodayTasks(): Promise<Task[]> {
    const response = await apiClient.get<Task[]>('/today')
    return response.data
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, input)
    return response.data
  }

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`)
  }
}

export const taskService = new TaskService()
