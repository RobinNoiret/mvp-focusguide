/**
 * Shared constants used across the application
 */

// Task status constants
export const TASK_STATUSES = ['backlog', 'todo', 'in_progress', 'done'] as const

export const STATUS_ORDER: Record<string, number> = {
  backlog: 0,
  todo: 1,
  in_progress: 2,
  done: 3,
}

export const STATUS_LABELS: Record<string, string> = {
  backlog: 'Backlog',
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminée',
}

export const STATUS_COLORS: Record<string, string> = {
  backlog: 'bg-gray-100 text-gray-700',
  todo: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
}

// Timing constants
export const TOKEN_EXPIRY = {
  ACCESS: 15 * 60, // 15 minutes in seconds
  REFRESH: 7 * 24 * 60 * 60, // 7 days in seconds
} as const

export const SYNC_INTERVALS = {
  BACKGROUND: 60 * 1000, // 60 seconds
} as const

export const REACT_QUERY_DEFAULTS = {
  STALE_TIME: {
    PROJECTS: 5 * 60 * 1000, // 5 minutes
    TODAY_TASKS: 60 * 1000, // 1 minute
    USER: 30 * 60 * 1000, // 30 minutes
    SETTINGS: 30 * 60 * 1000, // 30 minutes
  },
} as const

// Validation constants
export const VALIDATION = {
  TASK_TITLE_MAX_LENGTH: 200,
  TASK_NOTES_MAX_LENGTH: 2000,
  PROJECT_NAME_MAX_LENGTH: 200,
  PROJECT_DESCRIPTION_MAX_LENGTH: 2000,
} as const
