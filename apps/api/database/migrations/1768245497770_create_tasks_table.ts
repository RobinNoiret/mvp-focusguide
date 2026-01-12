import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE')
      // NOTE: project_id foreign key constraint will be added in Story 2.1 when projects table is created
      table.uuid('project_id').nullable()
      table.string('title', 500).notNullable()
      table.text('notes').nullable()
      table.enum('project_status', ['backlog', 'todo', 'in_progress', 'done']).nullable()
      table.enum('today_status', ['backlog', 'todo', 'in_progress', 'done']).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
      table.timestamp('deleted_at').nullable()

      // Indexes
      table.index('user_id')
      table.index('project_id')
      table.index('today_status')
      table.index('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
