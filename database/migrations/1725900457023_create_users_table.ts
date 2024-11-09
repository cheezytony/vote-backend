import { UserStatus } from '#models/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()

      table.string('first_name').nullable().after('id')
      table.string('last_name').nullable().after('first_name')
      table.string('password').notNullable().after('last_name')
      table.string('status').defaultTo(UserStatus.ACTIVE).notNullable().index().after('password')

      table.timestamp('created_at').notNullable().after('status')
      table.timestamp('updated_at').nullable().after('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
