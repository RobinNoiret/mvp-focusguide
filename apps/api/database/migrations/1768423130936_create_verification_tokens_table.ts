import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'verification_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE')
      table.string('token').notNullable().unique()
      table.enum('type', ['email_verification', 'password_reset']).notNullable()
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at').notNullable()

      // Indexes
      table.index('token')
      table.index('user_id')
      table.index(['expires_at', 'type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}