import { PollStatus } from '#models/poll'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'polls'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table
        .string('user_id')
        .references('id')
        .inTable('users')
        .onDelete('NO ACTION')
        .onUpdate('CASCADE')

      table.string('name', 120).notNullable()
      table.string('description', 255).notNullable()
      table.string('reference', 16).unique().notNullable()
      table.string('status').defaultTo(PollStatus.PENDING).index().notNullable()
      table.timestamp('expires_at').nullable()
      table.boolean('can_change_option').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
