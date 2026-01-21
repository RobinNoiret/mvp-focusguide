import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddPomodoroSettingsToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      // AC 4: JSONB column for settings
      table.jsonb('pomodoro_settings').defaultTo(
        JSON.stringify({
          focusDuration: 25,
          breakDuration: 5,
          repetitions: 3,
          autoSwitch: true,
        })
      )
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('pomodoro_settings')
    })
  }
}
