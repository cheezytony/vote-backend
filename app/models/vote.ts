import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import Poll from './poll.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'crypto'
import PollOption from './poll_option.js'

export enum VoteStatus {
  PENDING = 'PENDING',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export default class Vote extends BaseModel {
  static selfAssignPrimaryKey = false

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare pollId: string

  @column()
  declare pollOptionId: string

  @column()
  declare reference: string

  @column()
  declare status: VoteStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Poll)
  declare poll: BelongsTo<typeof Poll>

  @belongsTo(() => PollOption)
  declare pollOption: BelongsTo<typeof PollOption>

  @beforeCreate()
  static assignUUID(user: Vote) {
    user.id = randomUUID()
  }
}
