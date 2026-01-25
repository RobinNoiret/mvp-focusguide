import vine from '@vinejs/vine'

const PROJECT_NAME_MAX_LENGTH = 200
const PROJECT_DESCRIPTION_MAX_LENGTH = 2000

export const createProjectValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(PROJECT_NAME_MAX_LENGTH),
    description: vine
      .string()
      .trim()
      .maxLength(PROJECT_DESCRIPTION_MAX_LENGTH)
      .optional(),
    // ISO 8601 datetime format
    deadline: vine
      .string()
      .minLength(10)
      .optional()
      .nullable(),
    tags: vine
      .array(vine.string().trim().maxLength(50))
      .maxLength(10)
      .optional(),
  })
)

export const updateProjectValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(PROJECT_NAME_MAX_LENGTH)
      .optional(),
    description: vine
      .string()
      .trim()
      .maxLength(PROJECT_DESCRIPTION_MAX_LENGTH)
      .optional()
      .nullable(),
    deadline: vine
      .string()
      .minLength(10)
      .optional()
      .nullable(),
    tags: vine
      .array(vine.string().trim().maxLength(50))
      .maxLength(10)
      .optional(),
  })
)
