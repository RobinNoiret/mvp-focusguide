import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Composite index for the /today endpoint query
      // WHERE user_id = ? AND today_status IS NOT NULL AND deleted_at IS NULL
      // ORDER BY created_at DESC
      table.index(['user_id', 'today_status', 'deleted_at', 'created_at'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['user_id', 'today_status', 'deleted_at', 'created_at'])
    })
  }
}
