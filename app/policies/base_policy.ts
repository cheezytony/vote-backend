import User, { UserStatus } from '#models/user'
import { allowGuest, AuthorizationResponse, BasePolicy as BaseBouncerPolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class BasePolicy extends BaseBouncerPolicy {
  @allowGuest()
  list(): AuthorizerResponse {
    return true
  }

  @allowGuest()
  view(): AuthorizerResponse {
    return true
  }

  protected canPostOrDelete(user: User) {
    if (user.status !== UserStatus.ACTIVE) {
      return AuthorizationResponse.deny(
        'This user account is disabled. Please contact an admin.',
        403
      )
    }
    return true
  }
}
