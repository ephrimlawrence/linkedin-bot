import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'linked_in_access_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.text("token")
      table.text("state")
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
