import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { randomUUID } from 'crypto'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Vote from './vote.js'
import PollOption from './poll_option.js'

export enum PollStatus {
  PENDING = 'PENDING',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export default class Poll extends BaseModel {
  /**
   * Serialize the `$extras` object as it is
   */
  serializeExtras = true

  static selfAssignPrimaryKey = false

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column({})
  declare name: string

  @column({})
  declare description: string

  @column()
  declare reference: string

  @column()
  declare status: PollStatus

  @column.dateTime()
  declare expiresAt: DateTime

  @column()
  declare canChangeOption: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => PollOption)
  declare options: HasMany<typeof PollOption>
  declare optionsCount?: number

  @hasMany(() => Vote)
  declare votes: HasMany<typeof Vote>
  declare votesCount?: number

  @beforeCreate()
  static assignUUid(poll: Poll) {
    poll.id = randomUUID()
  }
}
