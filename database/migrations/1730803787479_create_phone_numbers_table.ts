import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'phone_numbers'

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

      table.string('country_code', 10).notNullable().after('user_id')
      table.string('number', 16).notNullable().after('country_code')
      table.boolean('is_active').index().notNullable().defaultTo(false).after('number')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
