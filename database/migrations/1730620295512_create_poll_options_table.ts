import { PollOptionStatus } from '#models/poll_option'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'poll_options'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('poll_id').references('id').inTable('polls').onDelete('CASCADE').after('user_id')

      table.string('name', 80).index().notNullable().after('poll_id')
      table.string('description', 255).index().nullable().after('name')
      table.string('reference', 16).unique().notNullable().after('description')
      table.string('status').defaultTo(PollOptionStatus.ACTIVE).notNullable().index().after('reference')
      
      table.timestamp('created_at').after('status')
      table.timestamp('updated_at').after('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}