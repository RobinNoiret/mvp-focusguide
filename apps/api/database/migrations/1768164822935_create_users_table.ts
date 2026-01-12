import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.string('email', 255).notNullable().unique()
      table.string('password').notNullable()
      table.string('name', 255).notNullable()
      table.boolean('email_verified').defaultTo(false)
      table.jsonb('pomodoro_settings').defaultTo('{}')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      // Indexes
      table.index('email')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
