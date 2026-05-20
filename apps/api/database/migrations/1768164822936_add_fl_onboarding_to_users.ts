import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    const hasColumn = await this.schema.hasColumn(this.tableName, 'fl_onboarding')
    if (!hasColumn) {
      this.schema.alterTable(this.tableName, (table) => {
        table.boolean('fl_onboarding').defaultTo(false).notNullable()
      })
    }
  }

  async down() {
    const hasColumn = await this.schema.hasColumn(this.tableName, 'fl_onboarding')
    if (hasColumn) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('fl_onboarding')
      })
    }
  }
}
