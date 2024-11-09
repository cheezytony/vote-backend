import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { randomUUID } from 'crypto'
import Poll from './poll.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Vote from './vote.js'
import PhoneNumber from './phone.js'
import Email from './email.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export default class User extends compose(BaseModel, AuthFinder) {
  static selfAssignPrimaryKey = false

  declare currentAccessToken?: AccessToken

  serializeExtras = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare status: UserStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    type: 'user_token',
    expiresIn: '7 days',
    prefix: 'user.oat_',
  })

  @hasMany(() => PhoneNumber)
  declare phoneNumbers: HasMany<typeof PhoneNumber>

  @hasMany(() => Email)
  declare emails: HasMany<typeof Email>

  @hasMany(() => Poll)
  declare polls: HasMany<typeof Poll>

  @hasMany(() => Vote)
  declare votes: HasMany<typeof Vote>

  @beforeCreate()
  static assignUUID(user: User) {
    user.id = randomUUID()
  }
}
