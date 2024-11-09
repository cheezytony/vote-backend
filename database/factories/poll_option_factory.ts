import factory from '@adonisjs/lucid/factories'
import PollOption, { PollOptionStatus } from '#models/poll_option'
import { VoteFactory } from './vote_factory.js'

export const PollOptionFactory = factory
  .define(PollOption, async ({ faker }) => {
    return {
      name: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      reference: faker.string.alphanumeric({ length: { max: 16, min: 16 } }),
      status: faker.helpers.arrayElement(Object.keys(PollOptionStatus)) as PollOptionStatus,
    }
  })

  .state('inactive', (pollOption) => (pollOption.status = PollOptionStatus.INACTIVE))

  .relation('votes', () => VoteFactory)

  .build()
