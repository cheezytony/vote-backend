import { BaseJob } from 'adonis-resque'
import Poll, { PollStatus } from '#models/poll'
import { DateTime } from 'luxon'
// import { chunkModel } from '../../utils/pagination.js'

export default class ExpiredPoll extends BaseJob {
  // cron = '0 0 * * *'
  cron = '0 */1 * * *'

  async perform() {
    // Method 1
    // Updates all expired polls with one query.
    // Simple but effective
    const result = await Poll.query()
      .whereNot('status', PollStatus.CLOSED)
      .whereNotNull('expiresAt')
      .where('expiresAt', '<=', DateTime.now().toSQL())
      .update({
        status: PollStatus.CLOSED,
      })

    console.log('Expired polls updated', { result: JSON.parse(JSON.stringify(result)) })

    // Method 2
    // Fetches the polls in chunks and updates each one after the other
    // This allows actions to be performed on each poll before, during or after the update
    // Slow but thorough
    // await chunkModel(
    //   Poll.query()
    //     .whereNot('status', PollStatus.CLOSED)
    //     .whereNotNull('expiresAt')
    //     .where('expiresAt', '<=', DateTime.now().toSQL()),
    //   async (polls) => {
    //     for await (const poll of polls) {
    //       poll.status = PollStatus.CLOSED
    //       await poll.save()
    //     }
    //   }
    // )

    return 0
  }
}
