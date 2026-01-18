export interface Project {
  id: string
  userId: string
  title: string
  description: string | null
  deadline: string | null
  tags: string[]
  completionPercentage?: number
  taskCounts?: {
    backlog: number
    todo: number
    inProgress: number
    done: number
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateProjectInput {
  title: string
  description?: string
  deadline?: string
  tags?: string[]
}

export interface UpdateProjectInput {
  title?: string
  description?: string | null
  deadline?: string | null
  tags?: string[]
}
