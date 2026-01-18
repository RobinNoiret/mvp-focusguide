import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      // Foreign key to users table
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      // Project metadata
      table.string('title', 200).notNullable()
      table.text('description').nullable()
      table.date('deadline').nullable()
      table.specificType('tags', 'text[]').defaultTo('{}')

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()

      // Indexes
      table.index('user_id')
      table.index('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
