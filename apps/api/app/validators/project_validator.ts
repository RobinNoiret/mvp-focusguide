import vine from '@vinejs/vine'

export const createProjectValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(200),
    description: vine.string().trim().maxLength(2000).optional(),
    deadline: vine.string().optional(),
    tags: vine
      .array(vine.string().trim().maxLength(50))
      .maxLength(10)
      .optional(),
  })
)

export const updateProjectValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(200).optional(),
    description: vine.any().optional(),
    deadline: vine.any().optional(),
    tags: vine
      .array(vine.string().trim().maxLength(50))
      .maxLength(10)
      .optional(),
  })
)
