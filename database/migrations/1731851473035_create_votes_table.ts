import { VoteStatus } from '#models/vote'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'votes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('user_id').references('id').inTable('users').onDelete('NO ACTION').after('id')
      table.string('poll_id').references('id').inTable('polls').onDelete('CASCADE').after('poll_id')
      table
        .string('poll_option_id')
        .references('id')
        .inTable('poll_options')
        .onDelete('CASCADE')
        .after('poll_id')

      table.string('reference').unique().notNullable().after('poll_option_id')
      table.string('status').index().defaultTo(VoteStatus.PENDING).after('reference')

      table.timestamp('created_at').after('status')
      table.timestamp('updated_at').after('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
