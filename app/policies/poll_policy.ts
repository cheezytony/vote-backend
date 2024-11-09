import User from '#models/user'
import Poll, { PollStatus } from '#models/poll'
import { AuthorizationResponse } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { UpdatePollDto } from '../dto/poll.js'
import BasePolicy from './base_policy.js'

export default class PollPolicy extends BasePolicy {
  create(user: User): AuthorizerResponse {
    this.canPostOrDelete(user)

    return true
  }

  update(user: User, poll: Poll, payload: UpdatePollDto) {
    this.canPostOrDelete(user)

    if (user.id !== poll.userId) {
      return AuthorizationResponse.deny('This account cannot modify the specified poll', 403)
    }

    if (payload.status) {
      if (poll.status === PollStatus.CLOSED) {
        return AuthorizationResponse.deny(
          "Once a poll is closed, it's status CANNOT be changed",
          400
        )
      }

      if (poll.status === PollStatus.OPEN && payload.status === PollStatus.PENDING) {
        return AuthorizationResponse.deny(
          'Once a poll is opened, it CANNOT be set back to pending',
          400
        )
      }
    }

    return true
  }
}
