import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'emails'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .string('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .after('id')

      table.string('address', 255).notNullable().after('user_id')
      table.boolean('is_active').index().notNullable().defaultTo(false).after('number')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
