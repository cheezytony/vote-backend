import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Poll from './poll.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Vote from './vote.js'
import { randomUUID } from 'crypto'

export enum PollOptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export default class PollOption extends BaseModel {
  serializeExtras = true
  static selfAssignPrimaryKey = false

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare pollId: string

  @column()
  declare name: string

  @column()
  declare description?: string | null

  @column()
  declare reference: string

  @column()
  declare status: PollOptionStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Poll)
  declare poll: BelongsTo<typeof Poll>

  @hasMany(() => Vote)
  declare votes: HasMany<typeof Vote>

  @beforeCreate()
  static assignUUid(pollOption: PollOption) {
    pollOption.id = randomUUID()
  }
}