import factory from '@adonisjs/lucid/factories'
import Vote, { VoteStatus } from '#models/vote'

export const VoteFactory = factory
  .define(Vote, async ({ faker }) => {
    return {
      reference: faker.string.uuid(),
      status: faker.helpers.arrayElement(Object.keys(VoteStatus)) as VoteStatus,
    }
  })

  .state('pending', (vote) => (vote.status = VoteStatus.PENDING))
  .state('valid', (vote) => (vote.status = VoteStatus.VALID))
  .state('invalid', (vote) => (vote.status = VoteStatus.INVALID))

  .build()
