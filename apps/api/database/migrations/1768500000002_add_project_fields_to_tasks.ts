import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    // Add foreign key constraint to existing project_id column
    this.schema.raw(`
      ALTER TABLE tasks
      ADD CONSTRAINT tasks_project_id_foreign
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    `)

    // Check constraint: project_id and project_status must both be set or both be null
    this.schema.raw(`
      ALTER TABLE tasks
      ADD CONSTRAINT check_project_status_with_project
      CHECK (
        (project_id IS NULL AND project_status IS NULL) OR
        (project_id IS NOT NULL AND project_status IS NOT NULL)
      )
    `)
  }

  async down() {
    // Drop check constraint
    this.schema.raw(`
      ALTER TABLE tasks
      DROP CONSTRAINT IF EXISTS check_project_status_with_project
    `)

    // Drop foreign key constraint
    this.schema.raw(`
      ALTER TABLE tasks
      DROP CONSTRAINT IF EXISTS tasks_project_id_foreign
    `)
  }
}
