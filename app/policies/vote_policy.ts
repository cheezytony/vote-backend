import User from '#models/user'
import Vote from '#models/vote'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import BasePolicy from './base_policy.js'
import Poll, { PollStatus } from '#models/poll'
import { AuthorizationResponse } from '@adonisjs/bouncer'
import PollOption, { PollOptionStatus } from '#models/poll_option'

export default class VotePolicy extends BasePolicy {
  create(user: User, poll: Poll, pollOption: PollOption): AuthorizerResponse {
    this.canPostOrDelete(user)

    if (poll.status === PollStatus.PENDING) {
      return AuthorizationResponse.deny('This poll is not open yet for voting', 400)
    }

    if (poll.status === PollStatus.CLOSED) {
      return AuthorizationResponse.deny('This poll is closed for voting', 400)
    }

    if (pollOption.status !== PollOptionStatus.ACTIVE) {
      return AuthorizationResponse.deny('This poll option is disabled and cannot be selected', 400)
    }

    return true
  }

  update(user: User, vote: Vote, poll: Poll, pollOptionId: string): AuthorizerResponse {
    this.canPostOrDelete(user)

    if (poll.status === PollStatus.PENDING) {
      return AuthorizationResponse.deny('This poll has not been opened for voting yet', 400)
    }

    if (poll.status === PollStatus.CLOSED) {
      return AuthorizationResponse.deny('This poll has been closed', 400)
    }

    if (pollOptionId === vote.pollOptionId) {
      return AuthorizationResponse.deny('This option has already been selected for this vote', 400)
    }

    if (!poll.canChangeOption) {
      return AuthorizationResponse.deny('You cannot change your vote on this poll', 400)
    }

    const diff = vote.createdAt.diffNow('minutes')
    if (Math.abs(diff.minutes) > 10) {
      return AuthorizationResponse.deny('This vote cannot be updated after 10 minutes casting', 400)
    }

    return true
  }
}
