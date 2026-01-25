// User types
export type { User, PomodoroSettings } from './types/user.js'

// Task types
export type { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from './types/task.js'

// Project types
export type { Project, CreateProjectInput, UpdateProjectInput } from './types/project.js'

// Auth types
export type {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './types/auth.js'

// Constants
export {
  TASK_STATUSES,
  STATUS_ORDER,
  STATUS_LABELS,
  STATUS_COLORS,
  TOKEN_EXPIRY,
  SYNC_INTERVALS,
  REACT_QUERY_DEFAULTS,
  VALIDATION,
} from './constants'
