import vine from '@vinejs/vine'

export const createTaskValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(200),
    notes: vine.string().trim().maxLength(2000).optional(),
    todayStatus: vine.enum(['backlog', 'todo', 'in_progress', 'done']).optional().nullable(),
    projectId: vine.string().uuid().optional(),
    projectStatus: vine.enum(['backlog', 'todo', 'in_progress', 'done']).optional().nullable(),
    deadline: vine.string().optional().nullable(),
  })
)

export const updateTaskValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(200).optional(),
    notes: vine.any().optional(),
    todayStatus: vine.enum(['backlog', 'todo', 'in_progress', 'done']).optional().nullable(),
    projectStatus: vine.enum(['backlog', 'todo', 'in_progress', 'done']).optional().nullable(),
    deadline: vine.any().optional(),
  })
)
