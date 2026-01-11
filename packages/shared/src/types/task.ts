export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'done'

export interface Task {
  id: string
  userId: string
  projectId: string | null
  title: string
  notes: string | null
  projectStatus: TaskStatus | null
  todayStatus: TaskStatus | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
