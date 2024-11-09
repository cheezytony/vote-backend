import { HttpContext } from '@adonisjs/core/http'
import BadRequestException from '#exceptions/bad_request_exception'
import Email from '#models/email'
import User, { UserStatus } from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { inject } from '@adonisjs/core'

@inject()
export default class SessionService {
  constructor(protected readonly ctx: HttpContext) {}
  
  async createFromCredentials(credentials: { email: string; password: string }) {
    const email = await Email.query().preload('user').where({ address: credentials.email }).first()

    const user = email?.user
    if (!user || !(await hash.verify(user.password, credentials.password))) {
      throw new BadRequestException('Invalid credentials')
    }

    return this.authenticate(user)
  }

  async createFromUser(user: User) {
    return this.authenticate(user)
  }

  private async authenticate(user: User) {
    if (user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('This user account is disabled. Please contact an admin.')
    }

    return await User.accessTokens.create(user)
  }
}
