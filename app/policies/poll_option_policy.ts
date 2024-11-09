import User from '#models/user'
import PollOption from '#models/poll_option'
import { AuthorizationResponse } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import BasePolicy from './base_policy.js'
import Poll, { PollStatus } from '#models/poll'

export default class PollOptionPolicy extends BasePolicy {
  create(user: User, poll: Poll): AuthorizerResponse {
    this.canPostOrDelete(user)

    if (poll.status !== PollStatus.PENDING) {
      return AuthorizationResponse.deny('Only the options for non-activated polls can be changed', 400)
    }

    return true
  }

  update(user: User, _pollOption: PollOption, poll: Poll): AuthorizerResponse {
    this.canPostOrDelete(user)
    
    if (user.id !== poll.userId) {
      return AuthorizationResponse.deny('This account cannot modify the specified poll', 403)
    }

    if (poll.status !== PollStatus.PENDING) {
      return AuthorizationResponse.deny('Only the options for non-activated polls can be changed', 400)
    }

    return true
  }

  delete(user: User, _pollOption: PollOption, poll: Poll): AuthorizerResponse {
    this.canPostOrDelete(user)

    if (user.id !== poll.userId) {
      return AuthorizationResponse.deny('This account cannot modify the specified poll', 403)
    }

    if (poll.status !== PollStatus.PENDING) {
      return AuthorizationResponse.deny('Only the options for non-activated polls can be changed', 400)
    }

    return true
  }
}
