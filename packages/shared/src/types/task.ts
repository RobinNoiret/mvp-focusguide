export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'done'

export interface Task {
  id: string
  userId: string
  projectId: string | null
  title: string
  notes: string | null
  projectStatus: TaskStatus | null
  todayStatus: TaskStatus | null
  deadline: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateTaskInput {
  title: string
  notes?: string
  todayStatus?: TaskStatus | null
  projectId?: string
  projectStatus?: TaskStatus | null
  deadline?: string | null
}

export interface UpdateTaskInput {
  title?: string
  notes?: string | null
  todayStatus?: TaskStatus | null
  projectStatus?: TaskStatus | null
  deadline?: string | null
}
