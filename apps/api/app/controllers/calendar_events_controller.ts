import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import CalendarEvent from '#models/calendar_event'
import { createCalendarEventValidator, updateCalendarEventValidator } from '#validators/calendar_event_validator'
import { NotFoundException, ForbiddenException } from '#exceptions/app_exception'

export default class CalendarEventsController {
  /**
   * GET /v1/calendar-events
   * Returns all calendar events for the authenticated user
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const events = await CalendarEvent.query()
      .where('userId', user.id)
      .orderBy('startDate', 'asc')

    return response.ok(events.map((e) => e.serialize()))
  }

  /**
   * POST /v1/calendar-events
   * Creates a new calendar event
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createCalendarEventValidator)

    const event = await CalendarEvent.create({
      userId: user.id,
      title: data.title,
      startDate: DateTime.fromISO(data.startDate),
      endDate: data.endDate ? DateTime.fromISO(data.endDate) : null,
      isAllDay: data.isAllDay ?? false,
    })

    return response.created(event.serialize())
  }

  /**
   * PATCH /v1/calendar-events/:id
   * Updates a calendar event
   */
  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const event = await CalendarEvent.query()
      .where('id', params.id)
      .first()

    if (!event) {
      throw new NotFoundException('Calendar event', params.id)
    }

    if (event.userId !== user.id) {
      throw new ForbiddenException()
    }

    const data = await request.validateUsing(updateCalendarEventValidator)

    if (data.title !== undefined) {
      event.title = data.title
    }

    if (data.startDate !== undefined) {
      event.startDate = DateTime.fromISO(data.startDate)
    }

    if (data.endDate !== undefined) {
      event.endDate = data.endDate ? DateTime.fromISO(data.endDate) : null
    }

    if (data.isAllDay !== undefined) {
      event.isAllDay = data.isAllDay
    }

    await event.save()

    return response.ok(event.serialize())
  }

  /**
   * DELETE /v1/calendar-events/:id
   * Deletes a calendar event
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const event = await CalendarEvent.query()
      .where('id', params.id)
      .first()

    if (!event) {
      throw new NotFoundException('Calendar event', params.id)
    }

    if (event.userId !== user.id) {
      throw new ForbiddenException()
    }

    await event.delete()

    return response.noContent()
  }
}
