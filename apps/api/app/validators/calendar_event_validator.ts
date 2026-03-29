import vine from '@vinejs/vine'

const CALENDAR_EVENT_TITLE_MAX_LENGTH = 200

export const createCalendarEventValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(CALENDAR_EVENT_TITLE_MAX_LENGTH),
    startDate: vine.string().minLength(10),
    endDate: vine
      .string()
      .minLength(10)
      .optional()
      .nullable(),
    isAllDay: vine.boolean().optional(),
  })
)

export const updateCalendarEventValidator = vine.compile(
  vine.object({
    title: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(CALENDAR_EVENT_TITLE_MAX_LENGTH)
      .optional(),
    startDate: vine.string().minLength(10).optional(),
    endDate: vine
      .string()
      .minLength(10)
      .optional()
      .nullable(),
    isAllDay: vine.boolean().optional(),
  })
)
