import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare projectId: string | null

  @column()
  declare title: string

  @column()
  declare notes: string | null

  @column()
  declare projectStatus: 'backlog' | 'todo' | 'in_progress' | 'done' | null

  @column()
  declare todayStatus: 'backlog' | 'todo' | 'in_progress' | 'done' | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
