import vine from '@vinejs/vine'

const TASK_STATUSES = ['backlog', 'todo', 'in_progress', 'done'] as const
const TASK_TITLE_MAX_LENGTH = 200
const TASK_NOTES_MAX_LENGTH = 2000

export const createTaskValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(TASK_TITLE_MAX_LENGTH),
    notes: vine
      .string()
      .trim()
      .maxLength(TASK_NOTES_MAX_LENGTH)
      .optional(),
    todayStatus: vine
      .enum(TASK_STATUSES)
      .optional()
      .nullable(),
    projectId: vine.string().uuid().optional(),
    projectStatus: vine
      .enum(TASK_STATUSES)
      .optional()
      .nullable(),
    deadline: vine
      .string()
      .minLength(10)
      .optional()
      .nullable(),
  })
)

export const updateTaskValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(TASK_TITLE_MAX_LENGTH)
      .optional(),
    notes: vine
      .string()
      .trim()
      .maxLength(TASK_NOTES_MAX_LENGTH)
      .optional()
      .nullable(),
    todayStatus: vine
      .enum(TASK_STATUSES)
      .optional()
      .nullable(),
    projectStatus: vine
      .enum(TASK_STATUSES)
      .optional()
      .nullable(),
    deadline: vine
      .string()
      .minLength(10)
      .optional()
      .nullable(),
  })
)
